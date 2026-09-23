"use client";

import { useFormStatus } from "react-dom";
import { ArrowIcon } from "@/components/arrow-icon";

export function PendingSubmit({ label, pendingLabel, className, ariaLabel, arrow = false }: { label: string; pendingLabel: string; className: string; ariaLabel?: string; arrow?: boolean }) {
  const { pending } = useFormStatus();
  return <button type="submit" className={`${className} pending-submit`} disabled={pending} aria-busy={pending} aria-label={ariaLabel}>
    {pending ? pendingLabel : label}{arrow && <span aria-hidden="true"><ArrowIcon /></span>}
  </button>;
}
