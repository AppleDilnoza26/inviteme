import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { CardPreview } from "@/components/CardPreview";
import { PlanBadge } from "@/components/PlanBadge";
import { Link } from "@/i18n/navigation";
import { parseContent } from "@/lib/content";
import { canEdit } from "@/lib/plan-guard";
import { featuresOf } from "@/lib/plans";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";
import { resolveLayout } from "@/templates/types";
import { InvitationActions } from "./InvitationActions";
import { RevertFreeButton } from "./RevertFreeButton";

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await requireUser(locale, "/dashboard");
  const t = await getTranslations("dashboard");
  const format = await getFormatter();

  const invitations = await prisma.invitation.findMany({
    where: { userId: user.id },
    include: { template: true },
    orderBy: { updatedAt: "desc" },
  });
  const { maxInvitations } = featuresOf(user.plan);
  const isFree = user.plan === "FREE";
  const limitReached = invitations.length >= maxInvitations;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">{t("eyebrow")}</p>
          <h1 className="mt-3 text-4xl md:text-5xl">{t("greeting", { name: user.name })}</h1>
        </div>

        <div className="paper flex flex-col gap-4 p-5 md:min-w-[340px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-widest text-ink-soft uppercase">{t("plan")}</span>
            <PlanBadge plan={user.plan} />
          </div>
          {isFree ? (
            <>
              <div>
                <p className="text-sm font-medium">{t("counter", { count: invitations.length, max: maxInvitations })}</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sand">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-powder to-gold"
                    style={{ width: `${Math.min(100, (invitations.length / maxInvitations) * 100)}%` }}
                  />
                </div>
              </div>
              <Link href="/pricing" className="btn btn-gold !py-2.5">
                ✦ {t("upgrade")}
              </Link>
            </>
          ) : (
            <>
              <p className="text-sm font-medium">{t("unlimited", { count: invitations.length })}</p>
              <p className="text-xs text-ink-soft">{t("proSince")}</p>
              <RevertFreeButton label={t("revertFree")} />
            </>
          )}
        </div>
      </div>

      <div className="gold-rule my-12" />

      {invitations.length === 0 ? (
        <div className="paper mx-auto max-w-lg p-12 text-center">
          <h2 className="text-3xl">{t("empty")}</h2>
          <p className="mt-3 text-sm text-ink-soft">{t("emptyText")}</p>
          <Link href="/templates" className="btn btn-primary mt-8">
            {t("newInvitation")}
          </Link>
        </div>
      ) : (
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/templates"
            className={`group flex min-h-[260px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-colors ${
              limitReached ? "border-line text-ink-soft/60" : "border-beige text-ink-soft hover:border-gold hover:text-ink"
            }`}
          >
            <span className="font-display text-5xl">+</span>
            <span className="text-sm font-semibold">{t("newInvitation")}</span>
            {limitReached && <span className="text-xs">{t("counter", { count: invitations.length, max: maxInvitations })}</span>}
          </Link>

          {invitations.map((inv) => {
            const content = parseContent(inv.content);
            return (
              <article key={inv.id} className="flex flex-col gap-4">
                <Link href={`/invitations/${inv.id}`} className="block overflow-hidden rounded-xl shadow-[var(--shadow-paper)] transition-shadow hover:shadow-[var(--shadow-lift)]">
                  <CardPreview layout={resolveLayout(inv.template.layout)} content={content} locale={locale} />
                </Link>
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="truncate text-xl">{inv.title}</h3>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase ${
                        inv.status === "DRAFT" ? "bg-sand text-ink-soft" : "bg-blush text-[#8a5a4f]"
                      }`}
                    >
                      {inv.status === "DRAFT" ? t("draft") : t("saved")}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-ink-soft">
                    {t("updated", { date: format.dateTime(inv.updatedAt, { dateStyle: "medium" }) })}
                  </p>
                </div>
                <InvitationActions
                  id={inv.id}
                  editable={canEdit(user.plan, inv.status)}
                  isDraft={inv.status === "DRAFT"}
                />
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
