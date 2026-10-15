import type { Palette } from "@/lib/design";
import { H, W, type LayoutProps } from "./kit";
import { Bauhaus, Confetti, Deco, Luxury, Memphis, Modern, Retro } from "./modern";
import { Baby, Boho, Celestial, Classic, Elegant, Floral, Greenery } from "./romantic";
import type { InvitationFields, Layout } from "./types";

export const CARD_WIDTH = W;
export const CARD_HEIGHT = H;

// Markup must stay compatible with Satori (next/og): see ./kit.tsx.
export type InvitationCardProps = {
  layout: Layout;
  fields: InvitationFields;
  palette: Palette;
  displayFont: string;
  bodyFont: string;
  accentFont?: string;
  scale?: number;
  watermark?: boolean;
  locale?: string;
};

const LABELS = {
  ru: { date: "Дата", time: "Время", venue: "Место" },
  en: { date: "Date", time: "Time", venue: "Venue" },
};

const RENDERERS: Record<Layout, (props: LayoutProps) => React.ReactElement> = {
  elegant: Elegant,
  confetti: Confetti,
  modern: Modern,
  floral: Floral,
  luxury: Luxury,
  retro: Retro,
  baby: Baby,
  classic: Classic,
  boho: Boho,
  greenery: Greenery,
  deco: Deco,
  celestial: Celestial,
  bauhaus: Bauhaus,
  memphis: Memphis,
};

function Watermark({ s, color, font }: { s: number; color: string; font: string }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: W * s,
        height: H * s,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        opacity: 0.18,
      }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            display: "flex",
            transform: "rotate(-24deg)",
            fontFamily: font,
            whiteSpace: "nowrap",
            fontSize: 40 * s,
            letterSpacing: 6 * s,
            color,
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          InviteMe · Free
        </div>
      ))}
    </div>
  );
}

export function InvitationCard({
  layout,
  fields,
  palette,
  displayFont,
  bodyFont,
  accentFont,
  scale = 1,
  watermark,
  locale = "ru",
}: InvitationCardProps) {
  const Render = RENDERERS[layout] ?? Classic;
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: W * scale,
        height: H * scale,
        backgroundColor: palette.bg,
        overflow: "hidden",
      }}
    >
      <Render
        f={fields}
        p={palette}
        d={displayFont}
        b={bodyFont}
        a={accentFont ?? displayFont}
        s={scale}
        labels={locale === "en" ? LABELS.en : LABELS.ru}
      />
      {watermark ? <Watermark s={scale} color={palette.text} font={bodyFont} /> : null}
    </div>
  );
}
