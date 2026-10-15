"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { createInvitation } from "@/actions/invitations";
import { Link, useRouter } from "@/i18n/navigation";
import type { LockedFeature } from "@/lib/plans";
import { UpgradeModal } from "./UpgradeModal";

export function UseTemplateButton({
  slug,
  locked,
  signedIn,
}: {
  slug: string;
  locked: boolean;
  signedIn: boolean;
}) {
  const t = useTranslations("templates");
  const locale = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [feature, setFeature] = useState<LockedFeature | null>(null);

  if (!signedIn) {
    return (
      <Link href={{ pathname: "/register", query: { next: `/${locale}/templates` } }} className="btn btn-ghost w-full !py-2.5">
        {t("use")}
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        disabled={pending}
        className={`btn w-full !py-2.5 ${locked ? "btn-gold" : "btn-primary"}`}
        onClick={() =>
          startTransition(async () => {
            // The server decides; the "locked" flag only changes the label.
            const res = await createInvitation(slug, locale);
            if (res.ok) router.push(`/editor/${res.id}`);
            else if (res.error === "PLAN_LIMIT") setFeature(res.feature);
            else if (res.error === "UNAUTHORIZED") router.push("/login");
          })
        }
      >
        {pending ? t("creating") : locked ? `✦ ${t("unlock")}` : t("use")}
      </button>
      <UpgradeModal feature={feature} onClose={() => setFeature(null)} />
    </>
  );
}
