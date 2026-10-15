"use client";

import { useState } from "react";
import { UpgradeModal } from "@/components/UpgradeModal";
import { Link } from "@/i18n/navigation";
import type { LockedFeature } from "@/lib/plans";

export function LockedNotice({
  id,
  editable,
  openOnMount,
  label,
}: {
  id: string;
  editable: boolean;
  openOnMount: boolean;
  label: string;
}) {
  const [feature, setFeature] = useState<LockedFeature | null>(openOnMount && !editable ? "reopen" : null);

  if (editable) {
    return (
      <Link href={`/editor/${id}`} className="btn btn-ghost !py-2.5">
        {label}
      </Link>
    );
  }
  return (
    <>
      <button type="button" className="btn btn-ghost !py-2.5" onClick={() => setFeature("reopen")}>
        🔒 {label}
      </button>
      <UpgradeModal feature={feature} onClose={() => setFeature(null)} />
    </>
  );
}
