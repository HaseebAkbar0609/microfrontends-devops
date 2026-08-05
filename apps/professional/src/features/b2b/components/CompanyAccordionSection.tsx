"use client";

import { useState } from "react";
import { ChevronUp } from "lucide-react";

interface Props {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  noPadding?: boolean;
}

export function CompanyAccordionSection({ title, icon, children, defaultOpen = true, noPadding = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between px-5 py-4"
      >
        <div className="flex items-center gap-2 text-slate-600">
          {icon}
          <span className="text-sm font-semibold text-zinc-900">{title}</span>
        </div>
        <ChevronUp
          size={16}
          className={`text-slate-400 transition-transform duration-200 ${open ? "" : "rotate-180"}`}
          aria-hidden={true}
        />
      </button>
      {open && (
        <div className={noPadding ? "border-t border-slate-100" : "border-t border-slate-100 px-5 py-4"}>
          {children}
        </div>
      )}
    </div>
  );
}
