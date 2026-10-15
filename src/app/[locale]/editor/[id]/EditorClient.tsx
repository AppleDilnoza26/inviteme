"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { saveInvitation } from "@/actions/invitations";
import { CardPreview } from "@/components/CardPreview";
import { UpgradeModal } from "@/components/UpgradeModal";
import { Link, useRouter } from "@/i18n/navigation";
import { FONTS, PALETTES, type FontKey } from "@/lib/design";
import type { LockedFeature, PlanId } from "@/lib/plans";
import { FIELD_KEYS, type InvitationContent, type InvitationFields, type Layout } from "@/templates/types";

const MULTILINE: (keyof InvitationFields)[] = ["message"];

export function EditorClient({
  id,
  layout,
  initial,
  templateDefaults,
  plan,
  premiumFonts,
  premiumPalettes,
}: {
  id: string;
  layout: Layout;
  initial: InvitationContent;
  templateDefaults: { font: string; palette: string };
  plan: PlanId;
  premiumFonts: boolean;
  premiumPalettes: boolean;
}) {
  const t = useTranslations("editor");
  const tc = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const [content, setContent] = useState<InvitationContent>(initial);
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [feature, setFeature] = useState<LockedFeature | null>(null);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [pending, startTransition] = useTransition();
  const isFree = plan === "FREE";

  const setField = (key: keyof InvitationFields, value: string) => {
    setStatus("idle");
    setContent((c) => ({ ...c, fields: { ...c.fields, [key]: value } }));
  };

  // Mirrors fontAllowed / paletteAllowed in plan-guard; the server re-checks on save.
  const fontLocked = (key: string, premium: boolean) => premium && !premiumFonts && key !== templateDefaults.font;
  const paletteLocked = (key: string, premium: boolean) =>
    premium && !premiumPalettes && key !== templateDefaults.palette;

  const pickFont = (key: FontKey, premium: boolean) => {
    if (fontLocked(key, premium)) return setFeature("premiumFont");
    setStatus("idle");
    setContent((c) => ({ ...c, font: key }));
  };

  const pickPalette = (key: string, premium: boolean) => {
    if (paletteLocked(key, premium)) return setFeature("premiumPalette");
    setStatus("idle");
    setContent((c) => ({ ...c, palette: key }));
  };

  const save = () =>
    startTransition(async () => {
      const res = await saveInvitation(id, content);
      if (res.ok) {
        if (res.locked) {
          router.push(`/invitations/${id}`);
          router.refresh();
        } else setStatus("saved");
      } else if (res.error === "PLAN_LIMIT") setFeature(res.feature);
      else setStatus("error");
    });

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 md:py-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link href="/dashboard" className="text-sm font-medium text-ink-soft hover:text-ink">
          ← {t("back")}
        </Link>
        <div className="flex items-center gap-3">
          {status === "saved" && <span className="text-sm text-gold-deep">✓ {t("saved")}</span>}
          {status === "error" && <span className="text-sm text-[#8a3f33]">{t("error")}</span>}
          {!isFree && status === "saved" && (
            <a href={`/api/invitations/${id}/export?locale=${locale}`} className="btn btn-ghost !py-2.5">
              {t("download")}
            </a>
          )}
          <button type="button" className="btn btn-primary !py-2.5" onClick={save} disabled={pending}>
            {pending ? t("saving") : isFree ? t("saveAndFinish") : t("save")}
          </button>
        </div>
      </div>

      <div className="mb-6 flex rounded-full border border-line p-1 text-sm font-medium lg:hidden">
        {(["edit", "preview"] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setTab(k)}
            className={`flex-1 rounded-full py-2 ${tab === k ? "bg-ink text-ivory" : "text-ink-soft"}`}
          >
            {k === "edit" ? t("tabEdit") : t("tabPreview")}
          </button>
        ))}
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <section className={`flex flex-col gap-8 ${tab === "edit" ? "" : "hidden lg:flex"}`}>
          <p className={`rounded-xl border px-4 py-3 text-sm ${isFree ? "border-powder bg-blush/60" : "border-gold/40 bg-cream"}`}>
            {isFree ? t("freeNote") : t("proNote")}
          </p>

          <div className="paper p-6 md:p-8">
            <h2 className="text-2xl">{t("sectionText")}</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {FIELD_KEYS.map((key) => (
                <div key={key} className={MULTILINE.includes(key) || key === "title" ? "sm:col-span-2" : ""}>
                  <label className="label" htmlFor={key}>
                    {t(`fields.${key}`)}
                  </label>
                  {MULTILINE.includes(key) ? (
                    <textarea
                      id={key}
                      rows={3}
                      maxLength={300}
                      className="field resize-none"
                      value={content.fields[key]}
                      onChange={(e) => setField(key, e.target.value)}
                    />
                  ) : (
                    <input
                      id={key}
                      maxLength={key === "title" ? 60 : 140}
                      className="field"
                      value={content.fields[key]}
                      onChange={(e) => setField(key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="paper p-6 md:p-8">
            <h2 className="text-2xl">{t("sectionStyle")}</h2>

            <p className="label mt-6">{t("font")}</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {FONTS.map((f) => {
                const locked = fontLocked(f.key, f.premium);
                const active = content.font === f.key;
                return (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => pickFont(f.key, f.premium)}
                    className={`relative rounded-xl border px-3 py-3 text-left transition-all ${
                      active ? "border-gold bg-cream shadow-sm" : "border-line hover:border-beige"
                    } ${locked ? "opacity-70" : ""}`}
                  >
                    <span className="block truncate text-xl leading-tight" style={{ fontFamily: `var(${f.cssVar})` }}>
                      {locale === "en" ? "Aa Love" : "Аа Любовь"}
                    </span>
                    <span className="mt-1 block truncate text-[11px] text-ink-soft">{f.family}</span>
                    {f.premium && (
                      <span className="absolute top-2 right-2 text-[10px] text-gold-deep" title={tc("premium")}>
                        {locked ? "🔒" : "✦"}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <p className="label mt-8">{t("palette")}</p>
            <div className="flex flex-wrap gap-3">
              {PALETTES.map((p) => {
                const locked = paletteLocked(p.key, p.premium);
                const active = content.palette === p.key;
                return (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => pickPalette(p.key, p.premium)}
                    title={locale === "en" ? p.name.en : p.name.ru}
                    className={`relative flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all ${
                      active ? "scale-110 border-gold" : "border-transparent hover:scale-105"
                    }`}
                  >
                    <span
                      className="block h-10 w-10 overflow-hidden rounded-full shadow-inner"
                      style={{ background: `linear-gradient(135deg, ${p.bg} 0 50%, ${p.accent} 50% 100%)` }}
                    />
                    {locked && (
                      <span className="absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full bg-ivory text-[10px] shadow">
                        🔒
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className={`${tab === "preview" ? "" : "hidden lg:block"}`}>
          <div className="lg:sticky lg:top-28">
            <div className="rounded-2xl bg-sand/50 p-5 md:p-10">
              <div className="mx-auto max-w-[460px] overflow-hidden rounded-md shadow-[var(--shadow-lift)]">
                <CardPreview layout={layout} content={content} locale={locale} watermark={isFree} />
              </div>
            </div>
            {isFree && <p className="mt-3 text-center text-xs text-ink-soft">{t("watermarkNote")}</p>}
          </div>
        </section>
      </div>

      <UpgradeModal feature={feature} onClose={() => setFeature(null)} />
    </div>
  );
}
