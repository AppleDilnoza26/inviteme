"use server";

import { revalidatePath } from "next/cache";
import { contentSchema, parseTemplateDefaults } from "@/lib/content";
import {
  assertCanCreate,
  assertCanEdit,
  assertContentAllowed,
  assertTemplateAllowed,
  PlanLimitError,
} from "@/lib/plan-guard";
import { featuresOf } from "@/lib/plans";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { defaultContent, getTemplate } from "@/templates/catalog";
import type { ActionResult } from "./result";

function handle(e: unknown): ActionResult<never> {
  if (e instanceof PlanLimitError) return { ok: false, error: "PLAN_LIMIT", feature: e.feature };
  throw e;
}

export async function createInvitation(slug: string, locale: string): Promise<ActionResult<{ id: string }>> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "UNAUTHORIZED" };

  const template = await prisma.template.findUnique({ where: { slug } });
  const def = getTemplate(slug);
  if (!template || !def) return { ok: false, error: "NOT_FOUND" };

  try {
    assertTemplateAllowed(user.plan, template);
    await assertCanCreate(user.id, user.plan);
  } catch (e) {
    return handle(e);
  }

  const content = defaultContent(def, locale);
  const invitation = await prisma.invitation.create({
    data: {
      userId: user.id,
      templateId: template.id,
      title: content.fields.title,
      content: JSON.stringify(content),
    },
  });

  const max = featuresOf(user.plan).maxInvitations;
  if (Number.isFinite(max) && (await prisma.invitation.count({ where: { userId: user.id } })) > max) {
    await prisma.invitation.delete({ where: { id: invitation.id } });
    return { ok: false, error: "PLAN_LIMIT", feature: "invitationLimit" };
  }

  revalidatePath("/[locale]/dashboard", "page");
  return { ok: true, id: invitation.id };
}

export async function saveInvitation(
  id: string,
  input: unknown,
): Promise<ActionResult<{ status: string; locked: boolean }>> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "UNAUTHORIZED" };

  const parsed = contentSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "INVALID" };

  const invitation = await prisma.invitation.findFirst({
    where: { id, userId: user.id },
    include: { template: true },
  });
  if (!invitation) return { ok: false, error: "NOT_FOUND" };

  try {
    assertCanEdit(user.plan, invitation.status);
    assertTemplateAllowed(user.plan, invitation.template);
    assertContentAllowed(user.plan, parsed.data, parseTemplateDefaults(invitation.template.defaults));
  } catch (e) {
    return handle(e);
  }

  await prisma.invitation.update({
    where: { id },
    data: {
      content: JSON.stringify(parsed.data),
      title: parsed.data.fields.title || invitation.title,
      status: "SAVED",
    },
  });
  revalidatePath("/[locale]/dashboard", "page");
  return { ok: true, status: "SAVED", locked: user.plan === "FREE" };
}

export async function deleteInvitation(id: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "UNAUTHORIZED" };
  const { count } = await prisma.invitation.deleteMany({ where: { id, userId: user.id } });
  if (!count) return { ok: false, error: "NOT_FOUND" };
  revalidatePath("/[locale]/dashboard", "page");
  return { ok: true };
}
