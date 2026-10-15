import "server-only";
import type { TemplateDefaults } from "./content";
import { getFont, getPalette } from "./design";
import { featuresOf, type LockedFeature, type PlanId } from "./plans";
import { prisma } from "./prisma";
import type { InvitationContent } from "@/templates/types";

export class PlanLimitError extends Error {
  constructor(public feature: LockedFeature) {
    super(`Plan limit: ${feature}`);
    this.name = "PlanLimitError";
  }
}

export async function assertCanCreate(userId: string, plan: PlanId) {
  const { maxInvitations } = featuresOf(plan);
  if (!Number.isFinite(maxInvitations)) return;
  const count = await prisma.invitation.count({ where: { userId } });
  if (count >= maxInvitations) throw new PlanLimitError("invitationLimit");
}

export function assertTemplateAllowed(plan: PlanId, template: { isPremium: boolean }) {
  if (template.isPremium && !featuresOf(plan).premiumTemplates) throw new PlanLimitError("premiumTemplate");
}

/** A template's own font and palette come with the template; anything beyond the free set is Pro. */
export function fontAllowed(plan: PlanId, font: string, templateDefaults: TemplateDefaults) {
  return font === templateDefaults.font || !getFont(font)?.premium || featuresOf(plan).premiumFonts;
}

export function paletteAllowed(plan: PlanId, palette: string, templateDefaults: TemplateDefaults) {
  return palette === templateDefaults.palette || !getPalette(palette)?.premium || featuresOf(plan).premiumPalettes;
}

export function assertContentAllowed(plan: PlanId, content: InvitationContent, templateDefaults: TemplateDefaults) {
  if (!fontAllowed(plan, content.font, templateDefaults)) throw new PlanLimitError("premiumFont");
  if (!paletteAllowed(plan, content.palette, templateDefaults)) throw new PlanLimitError("premiumPalette");
}

/** Free users may edit a draft once; re-opening a saved invitation is a Pro feature. */
export function canEdit(plan: PlanId, status: string) {
  return status === "DRAFT" || featuresOf(plan).reopenSaved;
}

export function assertCanEdit(plan: PlanId, status: string) {
  if (!canEdit(plan, status)) throw new PlanLimitError("reopen");
}

export function needsWatermark(plan: PlanId) {
  return !featuresOf(plan).watermarkFreeExport;
}
