"use client";

import { usePathname, useRouter } from "next/navigation";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";
import { findActiveModuleTab, type ModuleTabItem } from "./moduleNav.types";
import { TAB_LIST_CLASS, TAB_TRIGGER_CLASS } from "./tabRowStyles";

interface ModuleTabsProps {
  items: ModuleTabItem[];
  /** Accessible name for the tab row, e.g. the module title. */
  ariaLabel?: string;
  className?: string;
}

/**
 * Route-driven tab row (Type = Line). Used for the primary row under the module
 * H1, and for secondary rows whose sections are separate routes.
 */
export function ModuleTabs({ items, ariaLabel, className }: ModuleTabsProps) {
  const pathname = usePathname();
  const router = useRouter();

  if (items.length === 0) return null;

  const activeItem = findActiveModuleTab(items, pathname);

  const handleValueChange = (value: string) => {
    const next = items.find((item) => item.id === value);
    if (next && next.href !== pathname) {
      router.push(next.href);
    }
  };

  return (
    <Tabs
      value={activeItem?.id ?? ""}
      onValueChange={handleValueChange}
      className={cn("w-full", className)}
    >
      <TabsList variant="line" className={TAB_LIST_CLASS} aria-label={ariaLabel}>
        {items.map((item) => (
          <TabsTrigger
            key={item.id}
            value={item.id}
            className={TAB_TRIGGER_CLASS}
          >
            {item.labelKey ? <Translate text={item.labelKey} /> : item.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

export default ModuleTabs;
