"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Link } from "@/i18n/navigation";
import type { LockedFeature } from "@/lib/plans";

export function UpgradeModal({ feature, onClose }: { feature: LockedFeature | null; onClose: () => void }) {
  const t = useTranslations("upgrade");

  useEffect(() => {
    if (!feature) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [feature, onClose]);

  if (!feature) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        className="paper relative w-full max-w-md overflow-hidden p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-powder via-gold to-powder" />
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-blush text-2xl text-gold-deep">✦</div>
        <h2 className="text-3xl">{t(`title.${feature}`)}</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">{t(`text.${feature}`)}</p>
        <p className="eyebrow mt-6">{t("price")}</p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link href="/checkout" className="btn btn-gold">
            {t("cta")}
          </Link>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            {t("later")}
          </button>
        </div>
      </div>
    </div>
  );
}
