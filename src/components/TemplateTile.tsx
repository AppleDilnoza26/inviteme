import { getLocale, getTranslations } from "next-intl/server";
import { defaultContent } from "@/templates/catalog";
import type { TemplateDef } from "@/templates/types";
import { CardPreview } from "./CardPreview";
import { UseTemplateButton } from "./UseTemplateButton";

export async function TemplateTile({
  template,
  locked,
  signedIn,
  showAction = true,
}: {
  template: TemplateDef;
  locked: boolean;
  signedIn: boolean;
  showAction?: boolean;
}) {
  const t = await getTranslations();
  const locale = await getLocale();
  const name = locale === "en" ? template.name.en : template.name.ru;

  return (
    <article className="group flex flex-col gap-4">
      <div className="relative overflow-hidden rounded-xl shadow-[var(--shadow-paper)] transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[var(--shadow-lift)]">
        <CardPreview layout={template.layout} content={defaultContent(template, locale)} locale={locale} />
        {template.isPremium ? (
          <span className="absolute top-3 right-3 rounded-full bg-gradient-to-r from-[#d8bd84] to-[#a8853f] px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-white uppercase shadow-md">
            ✦ Pro
          </span>
        ) : (
          <span className="absolute top-3 right-3 rounded-full bg-ivory/90 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-ink-soft uppercase shadow-sm">
            {t("templates.free")}
          </span>
        )}
        {locked && (
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-ink/75 px-4 py-2.5 text-xs font-semibold text-[#f0dcae] backdrop-blur-sm">
            🔒 {t("templates.proOnly")}
          </div>
        )}
      </div>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-xl leading-tight">{name}</h3>
        <span className="text-[11px] font-semibold tracking-widest text-ink-soft uppercase">
          {t(`templates.categories.${template.category}`)}
        </span>
      </div>
      {showAction && <UseTemplateButton slug={template.slug} locked={locked} signedIn={signedIn} />}
    </article>
  );
}
