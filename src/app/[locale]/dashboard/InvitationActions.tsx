"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { deleteInvitation } from "@/actions/invitations";
import { UpgradeModal } from "@/components/UpgradeModal";
import { Link, useRouter } from "@/i18n/navigation";
import type { LockedFeature } from "@/lib/plans";

export function InvitationActions({ id, editable, isDraft }: { id: string; editable: boolean; isDraft: boolean }) {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const router = useRouter();
  const [feature, setFeature] = useState<LockedFeature | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-2">
      {editable ? (
        <Link href={`/editor/${id}`} className="btn btn-primary !px-4 !py-2 text-xs">
          {isDraft ? t("continue") : t("edit")}
        </Link>
      ) : (
        <button type="button" className="btn btn-ghost !px-4 !py-2 text-xs" onClick={() => setFeature("reopen")}>
          🔒 {t("edit")}
        </button>
      )}
      <Link href={`/invitations/${id}`} className="btn btn-ghost !px-4 !py-2 text-xs">
        {t("view")}
      </Link>
      {!isDraft && (
        <a href={`/api/invitations/${id}/export?locale=${locale}`} className="btn btn-ghost !px-4 !py-2 text-xs">
          ↓ {t("download")}
        </a>
      )}
      <button
        type="button"
        disabled={pending}
        className="ml-auto text-xs font-medium text-ink-soft hover:text-[#8a3f33]"
        onClick={() => {
          if (!confirm(t("confirmDelete"))) return;
          startTransition(async () => {
            await deleteInvitation(id);
            router.refresh();
          });
        }}
      >
        {t("delete")}
      </button>
      <UpgradeModal feature={feature} onClose={() => setFeature(null)} />
    </div>
  );
}
