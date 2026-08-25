import type { ModuleTabItem } from "@/components/layout/navigation";
import type { BreadcrumbItem } from "@/types/common";
import localizationConstants, {
  type TranslationKeys,
} from "@/utils/translation/constants";

export const PURCHASE_MODULE_BASE_URL = "/module/production/purchase";

/** Module title shown as the H1 on every page of the Purchase module (rule 1). */
export const PURCHASE_MODULE_TITLE = localizationConstants.purchaseModuleTitle;

/** `Home > Module > Purchasing > Section` breadcrumb for Purchase list pages. */
export function purchaseBreadcrumbs(
  section: TranslationKeys
): BreadcrumbItem[] {
  return [
    { label: localizationConstants.home, href: "/dashboard" },
    { label: localizationConstants.moduleItem },
    {
      label: localizationConstants.purchaseModuleTitle,
      href: PURCHASE_MODULE_BASE_URL,
    },
    { label: section },
  ];
}

/** Primary tab row for the Purchase module. */
export const PURCHASE_MODULE_TABS: ModuleTabItem[] = [
  {
    id: "purchase-dashboard",
    labelKey: localizationConstants.purchaseTabDashboard,
    href: PURCHASE_MODULE_BASE_URL,
    exact: true,
  },
  {
    id: "purchase-overview",
    labelKey: localizationConstants.purchaseTabOverview,
    href: `${PURCHASE_MODULE_BASE_URL}/overview`,
  },
  {
    id: "purchase-suppliers",
    labelKey: localizationConstants.purchaseTabSuppliers,
    href: `${PURCHASE_MODULE_BASE_URL}/suppliers`,
  },
  {
    id: "purchase-complaints",
    labelKey: localizationConstants.purchaseTabComplaints,
    href: `${PURCHASE_MODULE_BASE_URL}/complaints`,
  },
  {
    id: "purchase-goods-reception",
    labelKey: localizationConstants.purchaseTabGoodsReception,
    href: `${PURCHASE_MODULE_BASE_URL}/goods-reception`,
  },
  {
    id: "purchase-qa",
    labelKey: localizationConstants.purchaseTabQa,
    href: `${PURCHASE_MODULE_BASE_URL}/qa`,
  },
  {
    id: "purchase-archive",
    labelKey: localizationConstants.purchaseTabArchive,
    href: `${PURCHASE_MODULE_BASE_URL}/archive`,
  },
];
