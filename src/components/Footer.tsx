import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Logo } from "./Logo";

export async function Footer() {
  const t = await getTranslations("common");
  return (
    <footer className="mt-24 border-t border-line bg-cream/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <Logo />
          <p className="max-w-sm text-sm text-ink-soft">{t("footer")}</p>
        </div>
        <div className="flex flex-col gap-3 text-sm text-ink-soft md:items-end">
          <div className="flex gap-6">
            <Link href="/templates" className="hover:text-ink">
              {t("nav.templates")}
            </Link>
            <Link href="/pricing" className="hover:text-ink">
              {t("nav.pricing")}
            </Link>
          </div>
          <p className="max-w-sm text-xs md:text-right">{t("footerDemo")}</p>
        </div>
      </div>
    </footer>
  );
}
