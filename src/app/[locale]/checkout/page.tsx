import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PLANS } from "@/lib/plans";
import { requireUser } from "@/lib/require-user";
import { CheckoutForm } from "./CheckoutForm";

export default async function CheckoutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await requireUser(locale, "/checkout");
  const t = await getTranslations("checkout");

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 md:py-16">
      <div className="mb-10 flex items-start gap-4 rounded-2xl border-2 border-dashed border-[#d9a441] bg-[#fff6df] p-5">
        <span className="shrink-0 rounded-md bg-[#d9a441] px-2.5 py-1 text-[11px] font-bold tracking-[0.2em] text-white uppercase">
          {t("testBadge")}
        </span>
        <p className="text-sm text-[#6b4f12]">{t("testText")}</p>
      </div>

      <p className="eyebrow">{t("eyebrow")}</p>
      <h1 className="mt-3 text-5xl">{t("title")}</h1>

      {user.plan === "PRO" ? (
        <div className="paper mt-10 p-10 text-center">
          <p className="text-lg">{t("alreadyPro")}</p>
          <Link href="/dashboard" className="btn btn-primary mt-6">
            {t("goDashboard")}
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 md:grid-cols-[1.3fr_1fr]">
          <CheckoutForm defaultName={user.name} />

          <aside className="paper h-fit p-8">
            <h2 className="text-2xl">{t("summary")}</h2>
            <div className="gold-rule my-6" />
            <div className="flex justify-between text-sm">
              <span>{t("planLine")}</span>
              <span className="font-semibold">${PLANS.PRO.priceUsd}</span>
            </div>
            <div className="mt-6 flex items-baseline justify-between border-t border-line pt-6">
              <span className="text-sm font-semibold">{t("total")}</span>
              <span className="font-display text-3xl">{t("totalTest")}</span>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
