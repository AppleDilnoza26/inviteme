export type FontKey =
  | "cormorant"
  | "playfair"
  | "manrope"
  | "lora"
  | "prata"
  | "greatVibes"
  | "marckScript"
  | "philosopher"
  | "alice"
  | "forum"
  | "badScript"
  | "lobster"
  | "comfortaa"
  | "unbounded"
  | "pacifico"
  | "yeseva"
  | "caveat"
  | "delaGothic"
  | "oswald"
  | "rubikMono"
  | "tenor";

export type FontDef = {
  key: FontKey;
  family: string;
  cssVar: string;
  premium: boolean;
};

export const FONTS: FontDef[] = [
  { key: "cormorant", family: "Cormorant Garamond", cssVar: "--font-cormorant", premium: false },
  { key: "playfair", family: "Playfair Display", cssVar: "--font-playfair", premium: false },
  { key: "manrope", family: "Manrope", cssVar: "--font-manrope", premium: false },
  { key: "lora", family: "Lora", cssVar: "--font-lora", premium: true },
  { key: "prata", family: "Prata", cssVar: "--font-prata", premium: true },
  { key: "greatVibes", family: "Great Vibes", cssVar: "--font-great-vibes", premium: true },
  { key: "marckScript", family: "Marck Script", cssVar: "--font-marck-script", premium: true },
  { key: "philosopher", family: "Philosopher", cssVar: "--font-philosopher", premium: true },
  { key: "alice", family: "Alice", cssVar: "--font-alice", premium: true },
  { key: "forum", family: "Forum", cssVar: "--font-forum", premium: true },
  { key: "badScript", family: "Bad Script", cssVar: "--font-bad-script", premium: true },
  { key: "lobster", family: "Lobster", cssVar: "--font-lobster", premium: true },
  { key: "comfortaa", family: "Comfortaa", cssVar: "--font-comfortaa", premium: true },
  { key: "unbounded", family: "Unbounded", cssVar: "--font-unbounded", premium: true },
  { key: "pacifico", family: "Pacifico", cssVar: "--font-pacifico", premium: true },
  { key: "yeseva", family: "Yeseva One", cssVar: "--font-yeseva", premium: true },
  { key: "caveat", family: "Caveat", cssVar: "--font-caveat", premium: true },
  { key: "delaGothic", family: "Dela Gothic One", cssVar: "--font-dela-gothic", premium: true },
  { key: "oswald", family: "Oswald", cssVar: "--font-oswald", premium: true },
  { key: "rubikMono", family: "Rubik Mono One", cssVar: "--font-rubik-mono", premium: true },
  { key: "tenor", family: "Tenor Sans", cssVar: "--font-tenor", premium: true },
];

export const BODY_FONT: FontDef = FONTS[0];

export function getFont(key: string): FontDef | undefined {
  return FONTS.find((f) => f.key === key);
}

export type Palette = {
  key: string;
  name: { ru: string; en: string };
  bg: string;
  surface: string;
  text: string;
  muted: string;
  accent: string;
  /** Secondary decorative colors (flowers, confetti, leaves). */
  accent2: string;
  accent3: string;
  premium: boolean;
};

export const PALETTES: Palette[] = [
  { key: "ivory", name: { ru: "Слоновая кость", en: "Ivory" }, bg: "#F5EEE3", surface: "#FFFDF8", text: "#2E2722", muted: "#7A6C60", accent: "#B8975A", accent2: "#E3D3B5", accent3: "#9A8F7A", premium: false },
  { key: "blush", name: { ru: "Пудра", en: "Blush" }, bg: "#F6E4DF", surface: "#FFF9F7", text: "#4A2F2F", muted: "#8A6F6A", accent: "#C98B86", accent2: "#EDBDB8", accent3: "#9FB08F", premium: false },
  { key: "linen", name: { ru: "Лён", en: "Linen" }, bg: "#EBDFCC", surface: "#FBF7F0", text: "#352C24", muted: "#7D705F", accent: "#9C7B4B", accent2: "#D7C3A0", accent3: "#8A7A5E", premium: false },
  { key: "sage", name: { ru: "Шалфей", en: "Sage" }, bg: "#E3E7DA", surface: "#FAFBF5", text: "#2B3127", muted: "#6B7462", accent: "#7F9168", accent2: "#B5C3A2", accent3: "#56684A", premium: true },
  { key: "midnight", name: { ru: "Полночь", en: "Midnight" }, bg: "#1F2433", surface: "#262C3D", text: "#F3EBDD", muted: "#B9B1A3", accent: "#D4B26A", accent2: "#8E9AC2", accent3: "#F3EBDD", premium: true },
  { key: "terracotta", name: { ru: "Терракота", en: "Terracotta" }, bg: "#F1DDCD", surface: "#FFF8F2", text: "#4A2A1C", muted: "#8E6552", accent: "#C0683F", accent2: "#E3A47E", accent3: "#A38E68", premium: true },
  { key: "lavender", name: { ru: "Лаванда", en: "Lavender" }, bg: "#E9E3F0", surface: "#FCFAFE", text: "#2F2838", muted: "#776C86", accent: "#9C86B5", accent2: "#D3C5E4", accent3: "#A7B79A", premium: true },
  { key: "emerald", name: { ru: "Изумруд", en: "Emerald" }, bg: "#16332C", surface: "#1C3D35", text: "#F4EEE1", muted: "#B7C2B4", accent: "#D1B56E", accent2: "#8F7A45", accent3: "#EAD9A6", premium: true },
  { key: "champagne", name: { ru: "Шампань", en: "Champagne" }, bg: "#F1E6CF", surface: "#FFFBF2", text: "#3A3020", muted: "#857558", accent: "#B8955A", accent2: "#E2CFA4", accent3: "#8F7E5C", premium: true },
  { key: "festive", name: { ru: "Праздник", en: "Festive" }, bg: "#FFF0E3", surface: "#FFFFFF", text: "#2B1B3D", muted: "#6E5A7E", accent: "#FF5A7A", accent2: "#FFC23C", accent3: "#36B9CC", premium: true },
  { key: "graphite", name: { ru: "Графит", en: "Graphite" }, bg: "#E7E3DD", surface: "#FAF9F6", text: "#1C1C1C", muted: "#6B6B6B", accent: "#D9603B", accent2: "#1C1C1C", accent3: "#C9C2B8", premium: true },
  { key: "retro", name: { ru: "Ретро", en: "Retro" }, bg: "#F6E7C8", surface: "#FFF6E5", text: "#2D2A26", muted: "#6E6455", accent: "#E4572E", accent2: "#F2A541", accent3: "#2A9D8F", premium: true },
  { key: "baby", name: { ru: "Облачко", en: "Cloud" }, bg: "#E6F0F5", surface: "#FFFFFF", text: "#3D4A5C", muted: "#7D8A9C", accent: "#F2A3B5", accent2: "#A8D8C8", accent3: "#F7D98B", premium: true },
  { key: "noir", name: { ru: "Нуар", en: "Noir" }, bg: "#121317", surface: "#1A1C22", text: "#F3E9D2", muted: "#A79E89", accent: "#C9A45C", accent2: "#6E5A32", accent3: "#E6CF95", premium: true },
  { key: "navy", name: { ru: "Звёздная ночь", en: "Starry night" }, bg: "#121A33", surface: "#1A2445", text: "#F2EEE6", muted: "#A9B0C7", accent: "#E8C677", accent2: "#7F93D1", accent3: "#FFFFFF", premium: true },
  { key: "bauhaus", name: { ru: "Баухаус", en: "Bauhaus" }, bg: "#F1EADB", surface: "#FBF7EE", text: "#141414", muted: "#5A5650", accent: "#E2412F", accent2: "#F3B521", accent3: "#1E4FA0", premium: true },
  { key: "memphis", name: { ru: "Мемфис", en: "Memphis" }, bg: "#E6DAFB", surface: "#FFFFFF", text: "#16131F", muted: "#544C6B", accent: "#FF4F8B", accent2: "#FFD43B", accent3: "#16C2A3", premium: true },
];

export function getPalette(key: string): Palette | undefined {
  return PALETTES.find((p) => p.key === key);
}
