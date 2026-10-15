import type { PlanId } from "@/lib/plans";

export function PlanBadge({ plan }: { plan: PlanId }) {
  return plan === "PRO" ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#d8bd84] to-[#b08d4a] px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-white uppercase">
      ✦ Pro
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full border border-beige px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-ink-soft uppercase">
      Free
    </span>
  );
}
