import type { BreadcrumbItem } from "@/types/common";
import localizationConstants, {
  type TranslationKeys,
} from "@/utils/translation/constants";

/**
 * `Home > Production > Section` breadcrumb for Production areas that do not have
 * their own module tab row yet. Navigation between the Production areas lives in
 * the main sidebar rail's Production flyout.
 */
export function productionBreadcrumbs(
  section: TranslationKeys
): BreadcrumbItem[] {
  return [
    { label: localizationConstants.home, href: "/dashboard" },
    { label: localizationConstants.production },
    { label: section },
  ];
}
