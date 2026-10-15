import "server-only";
import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "./auth";
import { normalizePlan, type PlanId } from "./plans";
import { prisma } from "./prisma";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  plan: PlanId;
};

// The plan is always read from the database (never from the cached session cookie),
// so upgrades and downgrades take effect on the very next request.
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, plan: true },
  });
  if (!user) return null;
  return { ...user, plan: normalizePlan(user.plan) };
});
