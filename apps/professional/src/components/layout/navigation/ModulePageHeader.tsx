import { PageHeader } from "@/components/layout/PageHeader";
import { cn } from "@/lib/utils";
import type { BreadcrumbItem } from "@/types/common";
import { ModuleTabs } from "./ModuleTabs";
import { RecordNavRow, type RecordNavRowProps } from "./RecordNavRow";
import type { ModuleTabItem } from "./moduleNav.types";

type ModulePageHeaderBaseProps = {
  /** Translation key for the module title (rule 1: identical on every page of the module). */
  title: string;
  /** The module's primary tab row. */
  tabs?: ModuleTabItem[];
  className?: string;
};

/** Pattern 1 — a list/overview page reached straight from a primary tab. */
type ListVariantProps = {
  breadcrumbs?: BreadcrumbItem[];
  record?: never;
  secondaryTabs?: never;
};

/** Patterns 2-4 — a page reached by drilling into a specific record. */
type RecordVariantProps = {
  record: RecordNavRowProps;
  breadcrumbs?: never;
  /**
   * Pattern 3 only. Sections that live on their own routes; for sections on the
   * same route use `SectionTabs` in the page body instead.
   */
  secondaryTabs?: ModuleTabItem[];
};

export type ModulePageHeaderProps = ModulePageHeaderBaseProps &
  (ListVariantProps | RecordVariantProps);

/**
 * The module header block from the tab navigation guideline.
 *
 * Order is H1 -> breadcrumb -> primary tabs -> back-navigation row, matching the
 * Figma frame. The prop types enforce rule 5: a breadcrumb and a record row can
 * never both be present, and secondary tabs are only reachable on the record
 * variant, so they can never appear without a back-navigation row above them.
 */
export function ModulePageHeader({
  title,
  tabs,
  breadcrumbs,
  record,
  secondaryTabs,
  className,
}: ModulePageHeaderProps) {
  return (
    <div className={cn("bg-white border-b border-slate-200 px-5", className)}>
      <PageHeader
        title={title}
        breadcrumbs={breadcrumbs}
        className="border-b-0 px-0 pb-0"
      />

      {tabs && tabs.length > 0 && (
        <div className="mt-3 -mb-[1px]">
          <ModuleTabs items={tabs} ariaLabel={title} />
        </div>
      )}

      {record && <RecordNavRow {...record} />}

      {record && secondaryTabs && secondaryTabs.length > 0 && (
        <div className="mt-3 -mb-[1px]">
          <ModuleTabs items={secondaryTabs} />
        </div>
      )}
    </div>
  );
}

export default ModulePageHeader;
