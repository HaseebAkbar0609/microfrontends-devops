import type { ModuleTabItem } from "@/components/layout/navigation";
import type { BreadcrumbItem } from "@/types/common";
import localizationConstants, {
  type TranslationKeys,
} from "@/utils/translation/constants";

export const ACCESS_MODULE_BASE_URL = "/module/production/access";

/** Module title shown as the H1 on every page of the Smart Access module (rule 1). */
export const ACCESS_MODULE_TITLE = localizationConstants.access;

/** `Home > Smart Access > Section` breadcrumb for Smart Access list/overview pages. */
export function accessBreadcrumbs(section: TranslationKeys): BreadcrumbItem[] {
  return [
    { label: localizationConstants.home, href: "/dashboard" },
    { label: localizationConstants.access, href: ACCESS_MODULE_BASE_URL },
    { label: section },
  ];
}

/**
 * Primary tab row for the Smart Access module.
 *
 * Only the designed section exists so far (Figma "Åtkomsthantering"). Add the
 * next section here and every page picks it up, which keeps the row identical
 * across the module as rule 1 requires.
 */
export const ACCESS_MODULE_TABS: ModuleTabItem[] = [
  {
    id: "access-management",
    labelKey: localizationConstants.accessManagement,
    href: ACCESS_MODULE_BASE_URL,
  },
];

/** Address of one access record's details page (TFS-1102). */
export function accessDetailsUrl(id: string): string {
  return `${ACCESS_MODULE_BASE_URL}/${encodeURIComponent(id)}`;
}

/** Address of one access item's details page (TFS-1104), under the Access tab. */
export function accessItemUrl(recordId: string, itemId: string): string {
  return `${accessDetailsUrl(recordId)}/access/${encodeURIComponent(itemId)}`;
}

/**
 * Secondary tab row of a record page (guideline pattern 3): the record's own
 * sections, on their own routes.
 */
export function accessDetailsTabs(id: string): ModuleTabItem[] {
  const base = accessDetailsUrl(id);
  return [
    { id: "information", labelKey: localizationConstants.accessTabInformation, href: base, exact: true },
    { id: "access", labelKey: localizationConstants.accessTabAccess, href: `${base}/access` },
  ];
}
