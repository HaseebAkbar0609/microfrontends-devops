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
  hideChevron?: boolean;
  className?: string;
  headerBorderClassName?: string;
}

export function CompanyAccordionSection({
  title,
  icon,
  children,
  defaultOpen = true,
  noPadding = false,
  hideChevron = false,
  className,
  headerBorderClassName,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-[#E5E5E5] bg-white shadow-2xs w-full",
        className
      )}
    >
      {hideChevron ? (
        <div className="flex h-[56px] min-h-[56px] w-full items-center justify-between px-5 py-0 font-normal">
          <div className="flex items-center gap-3">
            <span className="flex items-center shrink-0 text-slate-800">{icon}</span>
            <span className="font-sans text-base font-medium leading-6 tracking-normal text-slate-900">
              {title}
            </span>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-[56px] min-h-[56px] w-full cursor-pointer items-center justify-between px-5 py-0 text-left transition-colors hover:bg-slate-50/70 font-normal rounded-none shadow-none"
        >
          <div className="flex items-center gap-3">
            <span className="flex items-center shrink-0 text-slate-800">{icon}</span>
            <span className="font-sans text-base font-medium leading-6 tracking-normal text-slate-900">
              {title}
            </span>
          </div>
          <ChevronUp
            size={18}
            className={cn(
              "text-zinc-500 transition-transform duration-200",
              !open && "rotate-180"
            )}
            aria-hidden={true}
          />
        </button>
      )}
      {(open || hideChevron) && (
        <div
          className={
            noPadding
              ? headerBorderClassName
                ? ""
                : "border-t border-[#E5E5E5]"
              : headerBorderClassName
              ? "p-4 sm:p-4"
              : "border-t border-[#E5E5E5] p-4 sm:p-4"
          }
        >
          {headerBorderClassName && (
            <div className={cn("border-t border-[#E5E5E5]", headerBorderClassName)} />
          )}
          {children}
        </div>
      )}
    </div>
  );
}
