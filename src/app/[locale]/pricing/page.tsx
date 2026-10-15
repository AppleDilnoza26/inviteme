import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PLANS } from "@/lib/plans";
import { getCurrentUser } from "@/lib/session";

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pricing");
  const user = await getCurrentUser();
  const freeFeatures = t.raw("freeFeatures") as string[];
  const proFeatures = t.raw("proFeatures") as string[];

  const Check = ({ gold }: { gold?: boolean }) => (
    <span
      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] ${
        gold ? "bg-gold text-white" : "bg-sand text-ink-soft"
      }`}
    >
      ✓
    </span>
  );

  return (
    <div className="mx-auto max-w-5xl px-5 py-14 md:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h1 className="mt-3 text-5xl md:text-6xl">{t("title")}</h1>
        <p className="mt-4 text-ink-soft">{t("subtitle")}</p>
      </div>

      <div className="mt-14 grid gap-8 md:grid-cols-2">
        <div className="paper flex flex-col p-8 md:p-10">
          <h2 className="text-4xl">{t("freeName")}</h2>
          <p className="mt-1 text-sm text-ink-soft">{t("freeTagline")}</p>
          <p className="mt-8 flex items-baseline gap-2">
            <span className="font-display text-6xl">${PLANS.FREE.priceUsd}</span>
            <span className="text-sm text-ink-soft">{t("perMonth")}</span>
          </p>
          <div className="gold-rule my-8" />
          <ul className="flex flex-1 flex-col gap-3 text-sm">
            {freeFeatures.map((f) => (
              <li key={f} className="flex gap-3">
                <Check />
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-10">
            {user?.plan === "FREE" ? (
              <span className="btn btn-ghost w-full cursor-default">{t("current")}</span>
            ) : user ? null : (
              <Link href="/register" className="btn btn-ghost w-full">
                {t("startFree")}
              </Link>
            )}
          </div>
        </div>

        <div className="relative flex flex-col overflow-hidden rounded-[1.25rem] border border-gold/50 bg-gradient-to-b from-[#fffaf0] to-cream p-8 shadow-[var(--shadow-lift)] md:p-10">
          <span className="absolute top-6 right-6 rounded-full bg-ink px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-[#f0dcae] uppercase">
            {t("popular")}
          </span>
          <h2 className="text-4xl">
            {t("proName")} <span className="text-gold">✦</span>
          </h2>
          <p className="mt-1 text-sm text-ink-soft">{t("proTagline")}</p>
          <p className="mt-8 flex items-baseline gap-2">
            <span className="font-display text-6xl">${PLANS.PRO.priceUsd}</span>
            <span className="text-sm text-ink-soft">{t("perMonth")}</span>
          </p>
          <div className="gold-rule my-8" />
          <ul className="flex flex-1 flex-col gap-3 text-sm">
            {proFeatures.map((f) => (
              <li key={f} className="flex gap-3">
                <Check gold />
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-10">
            {user?.plan === "PRO" ? (
              <span className="btn btn-ghost w-full cursor-default">{t("current")}</span>
            ) : (
              <Link href={user ? "/checkout" : { pathname: "/register", query: { next: `/${locale}/checkout` } }} className="btn btn-gold w-full">
                {t("choosePro")}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
