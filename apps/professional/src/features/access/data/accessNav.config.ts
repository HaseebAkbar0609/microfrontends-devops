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
