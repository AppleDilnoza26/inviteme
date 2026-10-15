export type PlanId = "FREE" | "PRO";

export type PlanFeatures = {
  maxInvitations: number;
  premiumTemplates: boolean;
  premiumFonts: boolean;
  premiumPalettes: boolean;
  watermarkFreeExport: boolean;
  reopenSaved: boolean;
};

export const PLANS: Record<PlanId, { priceUsd: number; features: PlanFeatures }> = {
  FREE: {
    priceUsd: 0,
    features: {
      maxInvitations: 3,
      premiumTemplates: false,
      premiumFonts: false,
      premiumPalettes: false,
      watermarkFreeExport: false,
      reopenSaved: false,
    },
  },
  PRO: {
    priceUsd: 4.99,
    features: {
      maxInvitations: Infinity,
      premiumTemplates: true,
      premiumFonts: true,
      premiumPalettes: true,
      watermarkFreeExport: true,
      reopenSaved: true,
    },
  },
};

export function normalizePlan(plan: string | null | undefined): PlanId {
  return plan === "PRO" ? "PRO" : "FREE";
}

export function featuresOf(plan: string | null | undefined): PlanFeatures {
  return PLANS[normalizePlan(plan)].features;
}

export type LockedFeature = "invitationLimit" | "premiumTemplate" | "premiumFont" | "premiumPalette" | "reopen";
