"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import type { ActionResult } from "./result";

/**
 * Demo checkout: no payment provider is involved and no card data reaches the server.
 * Records a test subscription and switches the user to Pro.
 */
export async function activateProDemo(): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "UNAUTHORIZED" };
  if (user.plan === "PRO") return { ok: true };

  const periodEnd = new Date();
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  await prisma.$transaction([
    prisma.subscription.create({
      data: { userId: user.id, plan: "PRO", status: "ACTIVE", isTest: true, currentPeriodEnd: periodEnd },
    }),
    prisma.user.update({ where: { id: user.id }, data: { plan: "PRO" } }),
  ]);

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function revertToFreeDemo(): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "UNAUTHORIZED" };

  await prisma.$transaction([
    prisma.subscription.updateMany({
      where: { userId: user.id, status: "ACTIVE" },
      data: { status: "CANCELED", canceledAt: new Date() },
    }),
    prisma.user.update({ where: { id: user.id }, data: { plan: "FREE" } }),
  ]);

  revalidatePath("/", "layout");
  return { ok: true };
}
