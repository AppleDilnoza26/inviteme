import type { CSSProperties, ReactNode } from "react";
import type { Palette } from "@/lib/design";
import type { InvitationFields } from "./types";

// Everything here must stay compatible with Satori (next/og): inline styles only,
// every element with more than one child needs display: flex, SVGs need explicit width/height.

export const W = 600;
export const H = 840;

export type Labels = { date: string; time: string; venue: string };

export type LayoutProps = {
  f: InvitationFields;
  p: Palette;
  /** Headline font family (user-selectable). */
  d: string;
  /** Body font family (fixed per layout). */
  b: string;
  /** Accent font family (fixed per layout, falls back to the headline font). */
  a: string;
  s: number;
  labels: Labels;
};

export const row = (style: CSSProperties = {}): CSSProperties => ({ display: "flex", ...style });
export const col = (style: CSSProperties = {}): CSSProperties => ({ display: "flex", flexDirection: "column", ...style });
export const center = (style: CSSProperties = {}): CSSProperties =>
  col({ alignItems: "center", justifyContent: "center", ...style });

export function T({ children, style }: { children: ReactNode; style: CSSProperties }) {
  if (children === "" || children == null || children === false) return null;
  return <div style={{ display: "flex", ...style }}>{children}</div>;
}

export function Lines({ text, style }: { text: string; style: CSSProperties }) {
  const lines = text.split("\n").filter((l) => l.trim().length > 0);
  if (lines.length === 0) return null;
  const align = style.textAlign === "left" ? "flex-start" : style.textAlign === "right" ? "flex-end" : "center";
  return (
    <div style={col({ alignItems: align })}>
      {lines.map((line, i) => (
        <div key={i} style={{ ...style, display: "flex" }}>
          {line}
        </div>
      ))}
    </div>
  );
}

/** Shrinks a headline so long names keep the composition intact. */
export function fit(text: string, base: number, soft = 14, hard = 24) {
  const len = text.length;
  if (len > hard) return base * 0.58;
  if (len > soft) return base * 0.76;
  return base;
}

/** "Anna & Michael" -> ["Anna", "Michael"]; otherwise null. */
export function splitNames(title: string): [string, string] | null {
  const parts = title.split("&").map((x) => x.trim());
  return parts.length === 2 && parts[0] && parts[1] ? [parts[0], parts[1]] : null;
}

/** Couple names stacked around an ampersand; any other title renders as one line. */
export function Names({ title, style, amp, gap = 0 }: { title: string; style: CSSProperties; amp: CSSProperties; gap?: number }) {
  const names = splitNames(title);
  if (!names) return <T style={style}>{title}</T>;
  return (
    <div style={center({ gap })}>
      <T style={style}>{names[0]}</T>
      <T style={amp}>&</T>
      <T style={style}>{names[1]}</T>
    </div>
  );
}

/**
 * In-flow content above absolutely positioned decor. Browsers paint positioned boxes over
 * static ones, so the text layer must be positioned too (Satori simply follows DOM order).
 */
export function Content({ style, children }: { style?: CSSProperties; children: ReactNode }) {
  return <div style={col({ position: "relative", flex: 1, ...style })}>{children}</div>;
}

export function Rule({ s, w, color, h = 1, style }: { s: number; w: number; color: string; h?: number; style?: CSSProperties }) {
  return <div style={{ display: "flex", width: w * s, height: h * s, backgroundColor: color, ...style }} />;
}

/** First number in a title ("Sophia is 30!" -> "30"), else its initial. */
export function headlineNumber(title: string) {
  const n = title.match(/\d+/)?.[0];
  return (n ?? initials(title)).slice(0, 3);
}

export function initials(title: string) {
  const names = splitNames(title);
  if (names) return `${names[0][0] ?? ""}${names[1][0] ?? ""}`.toUpperCase();
  return (title.trim()[0] ?? "").toUpperCase();
}

export function Abs({
  s,
  top,
  left,
  right,
  bottom,
  width,
  height,
  style,
  children,
}: {
  s: number;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  width?: number;
  height?: number;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  // Satori fails on style keys whose value is undefined, so only set what was given.
  const box: CSSProperties = {};
  const set = (key: "top" | "left" | "right" | "bottom" | "width" | "height", n?: number) => {
    if (n !== undefined) box[key] = n * s;
  };
  set("top", top);
  set("left", left);
  set("right", right);
  set("bottom", bottom);
  set("width", width);
  set("height", height);
  return (
    <div style={{ position: "absolute", display: "flex", ...box, ...style }}>
      {children}
    </div>
  );
}

/** Static strings drawn by layouts; the PNG export must include their glyphs in the font subset. */
export const DECOR_TEXT = "№—–!+×RSVPSpecimen";

export function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- small SVG ornaments ---------- */

type Svg = { s: number; size: number; style?: CSSProperties };

function svgBox(s: number, w: number, h: number, style?: CSSProperties) {
  return { width: w * s, height: h * s, viewBox: `0 0 ${w} ${h}`, style: { display: "flex", ...style } };
}

export const SPARKLE = "M50 0 C54 38 62 46 100 50 C62 54 54 62 50 100 C46 62 38 54 0 50 C38 46 46 38 50 0Z";

export function Sparkle({ s, size, color, style }: Svg & { color: string }) {
  return (
    <svg {...svgBox(s, size, size, style)} viewBox="0 0 100 100">
      <path d={SPARKLE} fill={color} />
    </svg>
  );
}

/** Night sky dots, sparkles and a small constellation, keeping the text column clear. */
export function StarField({ s, p, seed = 11 }: { s: number; p: Palette; seed?: number }) {
  const r = rng(seed);
  const dots: ReactNode[] = [];
  for (let i = 0; i < 160 && dots.length < 80; i++) {
    const x = r() * W;
    const y = r() * H;
    const size = 0.6 + r() * 1.6;
    const o = 0.35 + r() * 0.6;
    if (x > 110 && x < 490 && y > 220 && y < 820) continue;
    dots.push(<circle key={`d${i}`} cx={x} cy={y} r={size} fill={p.accent3} opacity={o} />);
  }
  const sparkles = [
    [70, 120, 18], [520, 90, 12], [530, 300, 9], [70, 420, 10], [530, 520, 16], [60, 700, 12], [540, 760, 9], [80, 260, 7],
  ].map(([x, y, z], i) => (
    <path key={`s${i}`} d={SPARKLE} fill={p.accent} transform={`translate(${x - z} ${y - z}) scale(${(z * 2) / 100})`} />
  ));
  const constellation = [
    [400, 150], [440, 175], [470, 160], [500, 200], [480, 230],
  ];
  return (
    <svg width={W * s} height={H * s} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", top: 0, left: 0, display: "flex" }}>
      {dots}
      <path d={`M${constellation.map(([x, y]) => `${x} ${y}`).join(" L")}`} stroke={p.accent2} strokeWidth={0.8} fill="none" opacity={0.7} />
      {constellation.map(([x, y], i) => (
        <circle key={`k${i}`} cx={x} cy={y} r={2.4} fill={p.accent3} />
      ))}
      {sparkles}
    </svg>
  );
}

/** Pampas grass plume. */
export function Pampas({ s, size, color, stem, style, seed = 5 }: Svg & { color: string; stem: string; seed?: number }) {
  const r = rng(seed);
  const strokes = Array.from({ length: 70 }, (_, i) => {
    const t = i / 70;
    const y = 30 + t * 200;
    const x = 60 + Math.sin(t * 2) * 10;
    const len = 14 + Math.sin(t * Math.PI) * 26 + r() * 6;
    const dir = i % 2 ? 1 : -1;
    return (
      <line
        key={i}
        x1={x}
        y1={y}
        x2={x + dir * len}
        y2={y - len * 0.7}
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        opacity={0.75}
      />
    );
  });
  return (
    <svg {...svgBox(s, size * 0.4, size, style)} viewBox="0 0 120 300">
      <path d="M62 300 C64 220 58 120 60 20" stroke={stem} strokeWidth={2} fill="none" />
      {strokes}
    </svg>
  );
}

export function DiamondRow({ s, width, color, count = 9, style }: { s: number; width: number; color: string; count?: number; style?: CSSProperties }) {
  const gap = 200 / count;
  return (
    <svg {...svgBox(s, width, 14, style)} viewBox="0 0 200 14">
      {Array.from({ length: count }, (_, i) => {
        const x = gap / 2 + i * gap;
        const big = i === Math.floor(count / 2);
        const r = big ? 7 : 4;
        return <polygon key={i} points={`${x},${7 - r} ${x + r},7 ${x},${7 + r} ${x - r},7`} fill={color} opacity={big ? 1 : 0.7} />;
      })}
    </svg>
  );
}
