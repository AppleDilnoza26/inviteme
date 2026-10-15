import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { parseContent, parseTemplateDefaults } from "@/lib/content";
import { canEdit } from "@/lib/plan-guard";
import { featuresOf } from "@/lib/plans";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";
import { resolveLayout } from "@/templates/types";
import { EditorClient } from "./EditorClient";

export default async function EditorPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const user = await requireUser(locale, `/editor/${id}`);

  const invitation = await prisma.invitation.findFirst({
    where: { id, userId: user.id },
    include: { template: true },
  });
  if (!invitation) notFound();

  if (!canEdit(user.plan, invitation.status)) {
    redirect({ href: { pathname: `/invitations/${id}`, query: { locked: "reopen" } }, locale });
  }

  const f = featuresOf(user.plan);
  return (
    <EditorClient
      id={invitation.id}
      layout={resolveLayout(invitation.template.layout)}
      initial={parseContent(invitation.content)}
      templateDefaults={parseTemplateDefaults(invitation.template.defaults)}
      plan={user.plan}
      premiumFonts={f.premiumFonts}
      premiumPalettes={f.premiumPalettes}
    />
  );
}
