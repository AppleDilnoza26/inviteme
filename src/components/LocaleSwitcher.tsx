"use client";

import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  return (
    <div className={`flex rounded-full border border-line p-0.5 text-[11px] font-bold tracking-widest ${pending ? "opacity-60" : ""}`}>
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => {
            const query = searchParams.toString();
            startTransition(() => router.replace(query ? `${pathname}?${query}` : pathname, { locale: l }));
          }}
          className={`rounded-full px-2.5 py-1 uppercase transition-colors ${
            l === locale ? "bg-ink text-ivory" : "text-ink-soft hover:text-ink"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
