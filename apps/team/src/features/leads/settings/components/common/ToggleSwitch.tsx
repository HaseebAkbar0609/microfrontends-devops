"use client";

import { cn } from "@/lib/utils";

export function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange?: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange?.(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full border transition-colors",
        checked ? "border-emerald-600 bg-emerald-600" : "border-slate-200 bg-slate-100"
      )}
      aria-pressed={checked}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-5" : "translate-x-1"
        )}
      />
    </button>
  );
}
