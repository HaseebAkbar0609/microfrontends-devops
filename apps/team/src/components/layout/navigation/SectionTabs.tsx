"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryParams } from "@/components/hooks/useQueryParams";
import { cn } from "@/lib/utils";
import type { TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { TAB_LIST_CLASS, TAB_TRIGGER_CLASS } from "./tabRowStyles";

export interface SectionTabItem {
  id: string;
  /** Translation key, resolved through `Translate`. Preferred over `label`. */
  labelKey?: TranslationKeys;
  /** Literal label, for values that are not translatable. */
  label?: string;
}

interface SectionTabsProps {
  items: SectionTabItem[];
  /** Query-string key used to persist the active section. */
  paramName?: string;
  /** Section shown when the query param is absent. Defaults to the first item. */
  defaultId?: string;
  ariaLabel?: string;
  className?: string;
  /** `TabsContent` panels, one per item. */
  children?: React.ReactNode;
}

/**
 * Secondary tab row for a record whose sections live on the same route
 * (state kept in the query string). Same Tabs component and Type=Line style as
 * the primary row, per rule 3 — it only differs in where it is placed.
 *
 * When a record's sections are separate routes, use `ModuleTabs` instead.
 */
export function SectionTabs({
  items,
  paramName = "section",
  defaultId,
  ariaLabel,
  className,
  children,
}: SectionTabsProps) {
  const { query, changeQueries } = useQueryParams();

  if (items.length === 0) return null;

  const fallbackId = defaultId ?? items[0].id;
  const paramValue = query.get(paramName);
  const activeId = items.some((item) => item.id === paramValue)
    ? (paramValue as string)
    : fallbackId;

  const handleValueChange = (value: string) => {
    // Keep the default section out of the URL so links stay clean.
    changeQueries({ [paramName]: value === fallbackId ? null : value });
  };

  return (
    <Tabs
      value={activeId}
      onValueChange={handleValueChange}
      className={cn("w-full", className)}
    >
      <div className="border-b border-slate-200">
        <TabsList
          variant="line"
          className={TAB_LIST_CLASS}
          aria-label={ariaLabel}
        >
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
      </div>
      {children}
    </Tabs>
  );
}

export default SectionTabs;
