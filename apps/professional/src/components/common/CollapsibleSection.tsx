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
  /** Controls the section from outside — a form reopening one that hides an error. Omit to let it keep its own state. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
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
  open: openProp,
  onOpenChange,
  className,
  headerClassName,
  titleClassName,
  contentClassName,
  children,
}: CollapsibleSectionProps) {
  const [openState, setOpenState] = useState(defaultOpen);
  const open = openProp ?? openState;
  const setOpen = (next: boolean) => {
    setOpenState(next);
    onOpenChange?.(next);
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen} className={className}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          type="button"
          className={cn(
            "mb-4 flex w-full font-medium text-md items-center justify-between border-b border-slate-200 pb-4 px-5 hover:bg-transparent",
            headerClassName
          )}
        >
          <div className={cn("flex items-center gap-2  text-mainTextColor", titleClassName)}>
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
