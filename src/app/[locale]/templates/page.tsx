import { getTranslations, setRequestLocale } from "next-intl/server";
import { TemplateTile } from "@/components/TemplateTile";
import { Link } from "@/i18n/navigation";
import { featuresOf } from "@/lib/plans";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { getTemplate } from "@/templates/catalog";
import { CATEGORIES, type Category } from "@/templates/types";

export default async function TemplatesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { category } = await searchParams;
  const active = CATEGORIES.includes(category as Category) ? (category as Category) : null;

  const t = await getTranslations("templates");
  const user = await getCurrentUser();
  const premiumAllowed = featuresOf(user?.plan).premiumTemplates;

  const rows = await prisma.template.findMany({
    where: active ? { category: active } : undefined,
    orderBy: [{ isPremium: "asc" }, { sortOrder: "asc" }],
  });
  const templates = rows.map((r) => getTemplate(r.slug)).filter((t) => t !== undefined);

  const tabs: { key: Category | null; label: string }[] = [
    { key: null, label: t("all") },
    ...CATEGORIES.map((c) => ({ key: c, label: t(`categories.${c}`) })),
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h1 className="mt-3 text-5xl md:text-6xl">{t("title")}</h1>
        <p className="mt-4 text-ink-soft">{t("subtitle")}</p>
      </div>

      <nav className="mt-10 flex flex-wrap justify-center gap-2">
        {tabs.map((tab) => (
          <Link
            key={tab.key ?? "all"}
            href={tab.key ? { pathname: "/templates", query: { category: tab.key } } : "/templates"}
            className={`rounded-full border px-5 py-2 text-sm font-medium transition-colors ${
              active === tab.key ? "border-ink bg-ink text-ivory" : "border-line text-ink-soft hover:border-gold hover:text-ink"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((tpl) => (
          <TemplateTile key={tpl.slug} template={tpl} locked={tpl.isPremium && !premiumAllowed} signedIn={!!user} />
        ))}
      </div>
    </div>
  );
}
