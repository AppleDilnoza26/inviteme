import type { LockedFeature } from "@/lib/plans";

export type ActionError =
  | { ok: false; error: "PLAN_LIMIT"; feature: LockedFeature }
  | { ok: false; error: "UNAUTHORIZED" | "NOT_FOUND" | "INVALID" };

export type ActionResult<T = object> = ({ ok: true } & T) | ActionError;
