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
  defaultOpen?: boolean;
  children: React.ReactNode;
};

export function OfferSendSection({
  title,
  icon,
  defaultOpen = true,
  children,
}: OfferSendSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm pt-2 pb-0 h-auto">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center justify-between gap-3 px-6 py-3 text-left"
          >
            <div className="flex items-center gap-3">
              {icon && (
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                  {icon}
                </span>
              )}
              <span className="text-base font-medium text-slate-900">
                {title}
              </span>
            </div>
            <ChevronDown
              className={cn(
                "h-5 w-5 text-slate-500 transition-transform",
                open && "rotate-180"
              )}
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

