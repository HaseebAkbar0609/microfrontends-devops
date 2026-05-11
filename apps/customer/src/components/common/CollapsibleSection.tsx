"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface CollapsibleSectionProps {
  title: ReactNode;
  icon?: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  headerClassName?: string;
  titleClassName?: string;
  contentClassName?: string;
  children: ReactNode;
}

export function CollapsibleSection({
  title,
  icon,
  defaultOpen = true,
  className,
  headerClassName,
  titleClassName,
  contentClassName,
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className={className}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          type="button"
          className={cn(
            "mb-4 flex w-full items-center justify-between border-b border-slate-200 pb-4 px-5 hover:bg-transparent",
            headerClassName
          )}
        >
          <div className={cn("flex items-center gap-2 !text-md font-semibold text-slate-700", titleClassName)}>
            {icon}
            {title}
          </div>
          <ChevronDown
            size={20}
            className={cn(
              "text-slate-400 transition-transform",
              open ? "rotate-180" : ""
            )}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className={contentClassName}>
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
