"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

type OfferSendSectionProps = {
  title: React.ReactNode;
  icon?: React.ReactNode;
  iconWrapperClassName?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

export function OfferSendSection({
  title,
  icon,
  iconWrapperClassName,
  defaultOpen = true,
  children,
}: OfferSendSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-none pt-2 pb-0 h-auto">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center justify-between gap-3 px-6 py-3.5 text-left"
          >
            <div className="flex items-center gap-2.5">
              {icon && (
                <span
                  className={cn(
                    "inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700",
                    iconWrapperClassName
                  )}
                >
                  {icon}
                </span>
              )}
              <span className="font-sans font-medium text-[16px] leading-[24px] text-[#1E293B]">
                {title}
              </span>
            </div>
            <ChevronDown
              className={cn(
                "h-5 w-5 text-[#1E293B] transition-transform",
                open && "rotate-180"
              )}
              strokeWidth={2}
            />
          </button>
        </CollapsibleTrigger>

        <div className="h-px w-full bg-slate-200" />

        <CollapsibleContent>
          <div className="px-6 py-5">{children}</div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
