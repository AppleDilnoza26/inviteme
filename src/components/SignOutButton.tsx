"use client";

import { useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";

export function SignOutButton({ label }: { label: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
      onClick={async () => {
        await authClient.signOut();
        router.push("/");
        router.refresh();
      }}
    >
      {label}
    </button>
  );
}
