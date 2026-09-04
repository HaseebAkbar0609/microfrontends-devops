import type { ModuleTabItem } from "@/components/layout/navigation";
import type { BreadcrumbItem } from "@/types/common";
import localizationConstants, {
  type TranslationKeys,
} from "@/utils/translation/constants";

export const ORDER_MODULE_BASE_URL = "/module/production/order";

/** Module title shown as the H1 on every page of the Order module (rule 1). */
export const ORDER_MODULE_TITLE = localizationConstants.orderModule;

/** `Home > Order > Section` breadcrumb for Order list/overview pages. */
export function orderBreadcrumbs(section?: TranslationKeys): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { label: localizationConstants.home, href: "/home" },
    { label: localizationConstants.moduleItem, href: "/module" },
    { label: localizationConstants.production, href: "/module/production" },
    { label: localizationConstants.orderModule, href: "/module/production/order" },
  ];
  if (section) {
    items.push({ label: section });
  }
  return items;
}

/** Primary tab row for the Order module. */
export const ORDER_MODULE_TABS: ModuleTabItem[] = [
  {
    id: "order-dashboard",
    labelKey: localizationConstants.orderDashboard,
    href: "/module/production/order/dashboard",
  },
  {
    id: "order-overview",
    labelKey: localizationConstants.orderOverview,
    href: "/module/production/order/overview",
    matchSubPaths: ["/module/production/order/create", "/module/production/order/"],
  },
  {
    id: "order-direct",
    labelKey: localizationConstants.orderDirect,
    href: "/module/production/order/direct",
  },
  {
    id: "economic-overview",
    labelKey: localizationConstants.economicOverview,
    href: "/module/production/order/economy",
  },
  {
    id: "planning",
    labelKey: localizationConstants.planning,
    href: "/module/production/order/planning",
  },
  {
    id: "warranty",
    labelKey: localizationConstants.warrantyCommitments,
    href: "/module/production/order/warranty",
  },
  {
    id: "archive",
    labelKey: localizationConstants.archive,
    href: "/module/production/order/archive",
  },
];
