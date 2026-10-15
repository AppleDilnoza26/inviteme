import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CardPreview } from "@/components/CardPreview";
import { Link } from "@/i18n/navigation";
import { parseContent } from "@/lib/content";
import { canEdit, needsWatermark } from "@/lib/plan-guard";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";
import { resolveLayout } from "@/templates/types";
import { LockedNotice } from "./LockedNotice";

export default async function InvitationPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ locked?: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const { locked } = await searchParams;
  const user = await requireUser(locale, `/invitations/${id}`);
  const t = await getTranslations("view");
  const te = await getTranslations("editor");

  const invitation = await prisma.invitation.findFirst({
    where: { id, userId: user.id },
    include: { template: true },
  });
  if (!invitation) notFound();

  const editable = canEdit(user.plan, invitation.status);
  const watermark = needsWatermark(user.plan);

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 md:py-14">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <Link href="/dashboard" className="text-sm font-medium text-ink-soft hover:text-ink">
          ← {t("back")}
        </Link>
        <div className="flex flex-wrap gap-2">
          {invitation.status === "SAVED" && (
            <a href={`/api/invitations/${id}/export?locale=${locale}`} className="btn btn-primary !py-2.5">
              ↓ {t("download")}
            </a>
          )}
          <LockedNotice id={id} editable={editable} openOnMount={locked === "reopen"} label={t("edit")} />
        </div>
      </div>

      <div className="rounded-2xl bg-sand/50 p-5 md:p-12">
        <div className="mx-auto max-w-[480px] overflow-hidden rounded-md shadow-[var(--shadow-lift)]">
          <CardPreview
            layout={resolveLayout(invitation.template.layout)}
            content={parseContent(invitation.content)}
            locale={locale}
            watermark={watermark}
          />
        </div>
      </div>
      {watermark && <p className="mt-4 text-center text-xs text-ink-soft">{te("watermarkNote")}</p>}
    </div>
  );
}
