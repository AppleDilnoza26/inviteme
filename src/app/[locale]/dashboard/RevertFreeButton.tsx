"use client";

import { useTransition } from "react";
import { revertToFreeDemo } from "@/actions/subscription";
import { useRouter } from "@/i18n/navigation";

export function RevertFreeButton({ label }: { label: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      className="text-left text-xs font-medium text-ink-soft underline underline-offset-4 hover:text-ink"
      onClick={() =>
        startTransition(async () => {
          await revertToFreeDemo();
          router.refresh();
        })
      }
    >
      {pending ? "…" : label}
    </button>
  );
}
