"use client";

import { useState } from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  noPadding?: boolean;
  className?: string;
}

export function CompanyAccordionSection({
  title,
  icon,
  children,
  defaultOpen = true,
  noPadding = false,
  className,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={cn("overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs transition-all", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between px-5 py-4 text-left hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex items-center gap-2.5 text-slate-700">
          <span className="shrink-0 text-slate-700">{icon}</span>
          <span className="text-[14px] font-semibold tracking-tight text-slate-900">{title}</span>
        </div>
        <ChevronUp
          size={16}
          className={cn(
            "text-slate-400 transition-transform duration-200 shrink-0",
            !open && "rotate-180"
          )}
          aria-hidden={true}
        />
      </button>
      {open && (
        <div className={cn(noPadding ? "border-t border-slate-100" : "border-t border-slate-100 px-5 py-5")}>
          {children}
        </div>
      )}
    </div>
  );
}
