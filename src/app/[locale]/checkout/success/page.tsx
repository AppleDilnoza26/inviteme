import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, redirect } from "@/i18n/navigation";
import { requireUser } from "@/lib/require-user";

export default async function CheckoutSuccessPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await requireUser(locale, "/checkout/success");
  if (user.plan !== "PRO") redirect({ href: "/checkout", locale });
  const t = await getTranslations("checkout");

  return (
    <div className="mx-auto max-w-xl px-5 py-20 text-center">
      <div className="paper relative overflow-hidden p-10 md:p-14">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-powder via-gold to-powder" />
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#e6cf9b] to-[#b08d4a] text-3xl text-white shadow-lg">
          ✦
        </div>
        <span className="mt-6 inline-block rounded-md bg-[#d9a441] px-2.5 py-1 text-[10px] font-bold tracking-[0.2em] text-white uppercase">
          {t("testBadge")}
        </span>
        <h1 className="mt-4 text-5xl">{t("successTitle")}</h1>
        <p className="mt-4 text-ink-soft">{t("successText")}</p>
        <p className="mt-2 text-xs text-ink-soft">{t("successNote")}</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/dashboard" className="btn btn-primary">
            {t("goDashboard")}
          </Link>
          <Link href="/templates" className="btn btn-ghost">
            {t("goTemplates")}
          </Link>
        </div>
      </div>
    </div>
  );
}
