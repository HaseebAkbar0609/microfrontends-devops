"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryParams } from "@/hooks/useQueryParams";
import { cn } from "@/lib/utils";
import type { TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { TAB_LIST_CLASS, TAB_TRIGGER_CLASS } from "./tabRowStyles";

export interface SectionTabItem {
  id: string;
  /** Translation key, resolved through `Translate`. Preferred over `label`. */
  labelKey?: TranslationKeys;
  /** Literal label, for values that are not translatable. */
  label?: string;
  /**
   * A section the design draws but that cannot be opened yet. It stays in the
   * row, disabled, with `disabledReasonKey` as its tooltip — never a tab that
   * silently shows nothing.
   */
  disabled?: boolean;
  disabledReasonKey?: TranslationKeys;
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
  const t = useTranslate();

  if (items.length === 0) return null;

  const fallbackId = defaultId ?? items[0].id;
  const paramValue = query.get(paramName);
  /* A disabled section cannot be reached by editing the query string either. */
  const activeId = items.some((item) => item.id === paramValue && !item.disabled)
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
              disabled={item.disabled}
              title={
                item.disabled && item.disabledReasonKey
                  ? t(item.disabledReasonKey)
                  : undefined
              }
              className={cn(
                TAB_TRIGGER_CLASS,
                item.disabled && "disabled:pointer-events-auto disabled:cursor-not-allowed",
              )}
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
