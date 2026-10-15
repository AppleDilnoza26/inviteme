import { getTranslations, setRequestLocale } from "next-intl/server";
import { CardPreview } from "@/components/CardPreview";
import { TemplateTile } from "@/components/TemplateTile";
import { Link } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/session";
import { defaultContent, getTemplate } from "@/templates/catalog";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const user = await getCurrentUser();

  const hero = ["floral-romance", "elegant-wedding", "luxury-gold"].map((s) => getTemplate(s)!);
  const showcase = ["birthday-celebration", "retro-party", "baby-shower", "art-deco-gala", "starry-night", "boho-arch"].map(
    (s) => getTemplate(s)!,
  );
  const startHref = user ? "/templates" : "/register";

  const features = ["templates", "editor", "export"] as const;
  const steps = ["one", "two", "three"] as const;

  return (
    <div className="overflow-x-hidden">
      <section className="relative">
        <div className="pointer-events-none absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full bg-powder/40 blur-3xl" />
        <div className="pointer-events-none absolute top-40 -left-40 h-[420px] w-[420px] rounded-full bg-sand/60 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 pt-14 pb-20 md:grid-cols-[1.05fr_1fr] md:pt-24 md:pb-28">
          <div>
            <p className="eyebrow">{t("eyebrow")}</p>
            <h1 className="mt-5 text-5xl leading-[1.02] md:text-7xl">{t("title")}</h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">{t("subtitle")}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href={startHref} className="btn btn-primary">
                {t("ctaPrimary")}
              </Link>
              <Link href="/templates" className="btn btn-ghost">
                {t("ctaSecondary")}
              </Link>
            </div>
          </div>

          <div className="relative mx-auto h-[420px] w-full max-w-[460px] md:h-[520px]">
            {hero.map((tpl, i) => {
              const pos = [
                "left-0 top-10 -rotate-[8deg] w-[52%]",
                "left-1/2 top-0 -translate-x-1/2 z-10 w-[58%]",
                "right-0 top-12 rotate-[7deg] w-[52%]",
              ][i];
              return (
                <div key={tpl.slug} className={`absolute overflow-hidden rounded-lg shadow-[var(--shadow-lift)] ${pos}`}>
                  <CardPreview layout={tpl.layout} content={defaultContent(tpl, locale)} locale={locale} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-cream/50">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="text-center text-4xl md:text-5xl">{t("featuresTitle")}</h2>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {features.map((f, i) => (
              <div key={f} className="text-center">
                <div className="font-display mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/50 text-2xl text-gold-deep">
                  {["I", "II", "III"][i]}
                </div>
                <h3 className="mt-5 text-2xl">{t(`features.${f}.title`)}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-ink-soft">{t(`features.${f}.text`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-24">
        <h2 className="text-center text-4xl md:text-5xl">{t("stepsTitle")}</h2>
        <ol className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s} className="paper p-8">
              <span className="font-display text-5xl text-gold">0{i + 1}</span>
              <h3 className="mt-3 text-2xl">{t(`steps.${s}.title`)}</h3>
              <p className="mt-2 text-sm text-ink-soft">{t(`steps.${s}.text`)}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-10">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-4xl md:text-5xl">{t("showcaseTitle")}</h2>
          <Link href="/templates" className="text-sm font-semibold text-gold-deep hover:underline">
            {t("ctaSecondary")} →
          </Link>
        </div>
        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {showcase.map((tpl) => (
            <TemplateTile key={tpl.slug} template={tpl} locked={false} signedIn={!!user} showAction={false} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-20">
        <div className="relative overflow-hidden rounded-3xl bg-ink px-8 py-16 text-center text-ivory md:px-16">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full bg-gold/30 blur-3xl" />
          <h2 className="relative text-4xl md:text-5xl">{t("finalTitle")}</h2>
          <p className="relative mx-auto mt-4 max-w-xl text-ivory/75">{t("finalText")}</p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link href={startHref} className="btn btn-gold">
              {t("ctaPrimary")}
            </Link>
            <Link href="/pricing" className="btn border border-ivory/30 text-ivory hover:bg-ivory/10">
              Free & Pro
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
