import { z } from "zod";
import { FONTS, PALETTES, type FontKey } from "./design";
import type { InvitationContent } from "@/templates/types";

const field = (max: number) => z.string().max(max).default("");

export const contentSchema = z.object({
  fields: z.object({
    eyebrow: field(80),
    title: field(60),
    subtitle: field(100),
    message: field(300),
    date: field(60),
    time: field(30),
    venue: field(100),
    address: field(140),
    footer: field(140),
  }),
  font: z.enum(FONTS.map((f) => f.key) as [FontKey, ...FontKey[]]),
  palette: z.enum(PALETTES.map((p) => p.key) as [string, ...string[]]),
});

export function parseContent(raw: string): InvitationContent {
  return contentSchema.parse(JSON.parse(raw));
}

export type TemplateDefaults = { font: string; palette: string };

/** Reads the font/palette stored with a Template row (`defaults` JSON column). */
export function parseTemplateDefaults(raw: string): TemplateDefaults {
  const parsed = JSON.parse(raw) as Partial<TemplateDefaults>;
  return { font: String(parsed.font ?? ""), palette: String(parsed.palette ?? "") };
}
