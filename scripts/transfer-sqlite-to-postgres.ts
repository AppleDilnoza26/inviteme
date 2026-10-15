/**
 * One-off copy of InviteMe data from the old SQLite file into an EMPTY PostgreSQL database.
 *
 *   npm run db:transfer                                        plan only: reads SQLite, never connects to PostgreSQL
 *   npm run db:transfer -- --source=prisma/dev.db              plan for another SQLite file
 *   npm run db:transfer -- --apply --confirm-host=<host>       copy into DATABASE_URL (host must match exactly)
 *
 * The SQLite file is opened read-only. IDs, relations, password hashes and legacy templates are copied as-is.
 * Sessions and verification tokens are not copied (users simply sign in again).
 * Writes run in one transaction and abort if any target table already has rows.
 */
import { createHash } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { PrismaClient } from "@prisma/client";

const args = new Map(
  process.argv.slice(2).map((a) => {
    const [k, ...v] = a.replace(/^--/, "").split("=");
    return [k, v.join("=") || "true"] as const;
  }),
);
const source = args.get("source") ?? "prisma/dev.backup.db";
const apply = args.get("apply") === "true";
const confirmHost = args.get("confirm-host");

type Row = Record<string, unknown>;

function toDate(v: unknown): Date | null {
  if (v === null || v === undefined) return null;
  if (typeof v === "number" || typeof v === "bigint") return new Date(Number(v));
  const s = String(v);
  const d = /^\d+$/.test(s) ? new Date(Number(s)) : new Date(s);
  if (Number.isNaN(d.getTime())) throw new Error(`Invalid date value: ${s}`);
  return d;
}

function toBool(v: unknown): boolean {
  return v === 1 || v === 1n || v === true || v === "1" || v === "true";
}

const req = <T>(v: T | null): T => {
  if (v === null) throw new Error("Unexpected NULL in a required column");
  return v;
};
const str = (v: unknown) => String(v);
const optStr = (v: unknown) => (v === null || v === undefined ? null : String(v));

function readSqlite(path: string) {
  const db = new DatabaseSync(path, { readOnly: true });
  const all = (sql: string) => db.prepare(sql).all() as Row[];
  try {
    const users = all(`SELECT * FROM "user" ORDER BY "createdAt", "id"`).map((r) => ({
      id: str(r.id),
      name: str(r.name),
      email: str(r.email),
      emailVerified: toBool(r.emailVerified),
      image: optStr(r.image),
      plan: str(r.plan),
      createdAt: req(toDate(r.createdAt)),
      updatedAt: req(toDate(r.updatedAt)),
    }));
    const accounts = all(`SELECT * FROM "account" ORDER BY "createdAt", "id"`).map((r) => ({
      id: str(r.id),
      accountId: str(r.accountId),
      providerId: str(r.providerId),
      userId: str(r.userId),
      accessToken: optStr(r.accessToken),
      refreshToken: optStr(r.refreshToken),
      idToken: optStr(r.idToken),
      accessTokenExpiresAt: toDate(r.accessTokenExpiresAt),
      refreshTokenExpiresAt: toDate(r.refreshTokenExpiresAt),
      scope: optStr(r.scope),
      password: optStr(r.password),
      createdAt: req(toDate(r.createdAt)),
      updatedAt: req(toDate(r.updatedAt)),
    }));
    const templates = all(`SELECT * FROM "Template" ORDER BY "sortOrder", "id"`).map((r) => ({
      id: str(r.id),
      slug: str(r.slug),
      category: str(r.category),
      layout: str(r.layout),
      isPremium: toBool(r.isPremium),
      defaults: str(r.defaults),
      sortOrder: Number(r.sortOrder),
    }));
    const invitations = all(`SELECT * FROM "Invitation" ORDER BY "createdAt", "id"`).map((r) => ({
      id: str(r.id),
      userId: str(r.userId),
      templateId: str(r.templateId),
      title: str(r.title),
      content: str(r.content),
      status: str(r.status),
      createdAt: req(toDate(r.createdAt)),
      updatedAt: req(toDate(r.updatedAt)),
    }));
    const subscriptions = all(`SELECT * FROM "Subscription" ORDER BY "startedAt", "id"`).map((r) => ({
      id: str(r.id),
      userId: str(r.userId),
      plan: str(r.plan),
      status: str(r.status),
      isTest: toBool(r.isTest),
      startedAt: req(toDate(r.startedAt)),
      currentPeriodEnd: req(toDate(r.currentPeriodEnd)),
      canceledAt: toDate(r.canceledAt),
    }));
    const skipped = {
      session: Number((all(`SELECT count(*) AS c FROM "session"`)[0] as Row).c),
      verification: Number((all(`SELECT count(*) AS c FROM "verification"`)[0] as Row).c),
    };
    return { users, accounts, templates, invitations, subscriptions, skipped };
  } finally {
    db.close();
  }
}

type Data = ReturnType<typeof readSqlite>;

function checkRelations(d: Data) {
  const userIds = new Set(d.users.map((u) => u.id));
  const templateIds = new Set(d.templates.map((t) => t.id));
  const problems = [
    ...d.accounts.filter((a) => !userIds.has(a.userId)).map((a) => `account ${a.id} -> missing user`),
    ...d.invitations.filter((i) => !userIds.has(i.userId)).map((i) => `invitation ${i.id} -> missing user`),
    ...d.invitations.filter((i) => !templateIds.has(i.templateId)).map((i) => `invitation ${i.id} -> missing template`),
    ...d.subscriptions.filter((s) => !userIds.has(s.userId)).map((s) => `subscription ${s.id} -> missing user`),
  ];
  const emails = d.users.map((u) => u.email.toLowerCase());
  if (new Set(emails).size !== emails.length) problems.push("emails collide case-insensitively");
  return problems;
}

// Fingerprints let source and target be compared without printing any values.
const fingerprint = (values: (string | null)[]) => createHash("sha256").update(values.map((v) => v ?? "\u0000").sort().join("\n")).digest("hex").slice(0, 16);

function summarize(d: Pick<Data, "users" | "accounts" | "templates" | "invitations" | "subscriptions">) {
  return {
    user: { rows: d.users.length, ids: fingerprint(d.users.map((u) => u.id)) },
    account: {
      rows: d.accounts.length,
      ids: fingerprint(d.accounts.map((a) => a.id)),
      passwordHashes: fingerprint(d.accounts.map((a) => `${a.id}:${a.password}`)),
    },
    Template: { rows: d.templates.length, ids: fingerprint(d.templates.map((t) => `${t.id}:${t.slug}`)) },
    Invitation: { rows: d.invitations.length, links: fingerprint(d.invitations.map((i) => `${i.id}:${i.userId}:${i.templateId}`)) },
    Subscription: { rows: d.subscriptions.length, links: fingerprint(d.subscriptions.map((s) => `${s.id}:${s.userId}`)) },
  };
}

async function main() {
  const data = readSqlite(source);
  const problems = checkRelations(data);

  console.log(`Source (read-only): ${source}`);
  console.log("Will copy:", JSON.stringify(summarize(data), null, 2));
  console.log("Will NOT copy:", data.skipped);
  if (problems.length) {
    console.error("Relation problems, aborting:", problems);
    process.exit(1);
  }

  if (!apply) {
    console.log("\nPlan only. Nothing was written and PostgreSQL was not contacted.");
    return;
  }

  const url = process.env.DATABASE_URL;
  if (!url || !/^postgres(ql)?:\/\//.test(url)) throw new Error("DATABASE_URL must be a postgresql:// URL");
  const host = new URL(url).host;
  if (confirmHost !== host) {
    throw new Error(`Refusing to write: pass --confirm-host=${host} to confirm the target database host.`);
  }

  const prisma = new PrismaClient({ datasources: { db: { url } } });
  try {
    await prisma.$transaction(
      async (tx) => {
        const existing = {
          user: await tx.user.count(),
          account: await tx.account.count(),
          session: await tx.session.count(),
          Template: await tx.template.count(),
          Invitation: await tx.invitation.count(),
          Subscription: await tx.subscription.count(),
        };
        if (Object.values(existing).some((n) => n > 0)) {
          throw new Error(`Target is not empty, nothing written: ${JSON.stringify(existing)}`);
        }
        await tx.user.createMany({ data: data.users });
        await tx.account.createMany({ data: data.accounts });
        await tx.template.createMany({ data: data.templates });
        await tx.invitation.createMany({ data: data.invitations });
        await tx.subscription.createMany({ data: data.subscriptions });
      },
      { timeout: 120_000, maxWait: 30_000 },
    );

    const target = summarize({
      users: await prisma.user.findMany(),
      accounts: await prisma.account.findMany(),
      templates: await prisma.template.findMany(),
      invitations: await prisma.invitation.findMany(),
      subscriptions: await prisma.subscription.findMany(),
    });
    const ok = JSON.stringify(target) === JSON.stringify(summarize(data));
    console.log(`\nCopied into ${host}.`, JSON.stringify(target, null, 2));
    console.log(ok ? "Verification OK: row counts, IDs, relations and password hashes match." : "VERIFICATION MISMATCH: compare the summaries above.");
    if (!ok) process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
