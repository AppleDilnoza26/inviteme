import type { FontKey } from "@/lib/design";

export type Category = "wedding" | "birthday" | "party" | "other";
export const CATEGORIES: Category[] = ["wedding", "birthday", "party", "other"];

export type Layout =
  | "elegant"
  | "confetti"
  | "modern"
  | "floral"
  | "luxury"
  | "retro"
  | "baby"
  | "classic"
  | "boho"
  | "greenery"
  | "deco"
  | "celestial"
  | "bauhaus"
  | "memphis";

const LAYOUTS: Layout[] = [
  "bauhaus",
  "memphis",
  "elegant",
  "confetti",
  "modern",
  "floral",
  "luxury",
  "retro",
  "baby",
  "classic",
  "boho",
  "greenery",
  "deco",
  "celestial",
];

// Layout names used by the first version of the catalog.
const LEGACY_LAYOUTS: Record<string, Layout> = { arch: "boho", minimal: "modern", botanical: "greenery" };

export function resolveLayout(name: string): Layout {
  if ((LAYOUTS as string[]).includes(name)) return name as Layout;
  return LEGACY_LAYOUTS[name] ?? "classic";
}

export type Direction = "romantic" | "modern";
export const DIRECTIONS: Direction[] = ["romantic", "modern"];

export const LAYOUT_DIRECTION: Record<Layout, Direction> = {
  elegant: "romantic",
  floral: "romantic",
  greenery: "romantic",
  boho: "romantic",
  classic: "romantic",
  baby: "romantic",
  celestial: "romantic",
  modern: "modern",
  confetti: "modern",
  retro: "modern",
  deco: "modern",
  luxury: "modern",
  bauhaus: "modern",
  memphis: "modern",
};

/** Body text font is part of each layout's identity; the headline font is user-selectable. */
export const LAYOUT_BODY_FONT: Record<Layout, FontKey> = {
  elegant: "cormorant",
  confetti: "manrope",
  modern: "manrope",
  floral: "cormorant",
  luxury: "tenor",
  retro: "manrope",
  baby: "cormorant",
  classic: "cormorant",
  boho: "lora",
  greenery: "cormorant",
  deco: "manrope",
  celestial: "cormorant",
  bauhaus: "oswald",
  memphis: "manrope",
};

/** Optional third font fixed by the layout (a numeral, masthead or handwritten note). */
export const LAYOUT_ACCENT_FONT: Partial<Record<Layout, FontKey>> = {
  confetti: "delaGothic",
  modern: "playfair",
  greenery: "caveat",
  boho: "caveat",
  baby: "caveat",
  luxury: "prata",
  memphis: "caveat",
};

export type InvitationFields = {
  eyebrow: string;
  title: string;
  subtitle: string;
  message: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  footer: string;
};

export const FIELD_KEYS: (keyof InvitationFields)[] = [
  "eyebrow",
  "title",
  "subtitle",
  "message",
  "date",
  "time",
  "venue",
  "address",
  "footer",
];

export type InvitationContent = {
  fields: InvitationFields;
  font: FontKey;
  palette: string;
};

export type TemplateDef = {
  slug: string;
  category: Category;
  layout: Layout;
  isPremium: boolean;
  name: { ru: string; en: string };
  font: FontKey;
  palette: string;
  defaults: { ru: InvitationFields; en: InvitationFields };
};
