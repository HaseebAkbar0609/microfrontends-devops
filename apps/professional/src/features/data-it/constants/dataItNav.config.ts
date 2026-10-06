import type { RouteTabItem } from "@/types/navigation";
import type { BreadcrumbItem } from "@/types/common";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";

export const DATA_IT_MODULE_BASE_URL = "/module/business-support/data-it";

export const dataItNavItems: RouteTabItem[] = [
	{
		id: "dashboard",
		labelKey: localizationConstants.dashboard,
		href: DATA_IT_MODULE_BASE_URL,
		exact: true,
	},
	{
		id: "overview",
		labelKey: localizationConstants.dataItOverview,
		href: `${DATA_IT_MODULE_BASE_URL}/overview`,
	},
	{
		id: "equipment",
		labelKey: localizationConstants.dataItEquipment,
		href: `${DATA_IT_MODULE_BASE_URL}/equipment`,
	},
	{
		id: "system",
		labelKey: localizationConstants.dataItSystem,
		href: `${DATA_IT_MODULE_BASE_URL}/system`,
	},
	{
		id: "support",
		labelKey: localizationConstants.dataItSupport,
		href: `${DATA_IT_MODULE_BASE_URL}/support`,
	},
	{
		id: "security",
		labelKey: localizationConstants.dataItSecurity,
		href: `${DATA_IT_MODULE_BASE_URL}/security`,
	},
	{
		id: "protocol",
		labelKey: localizationConstants.dataItProtocol,
		href: `${DATA_IT_MODULE_BASE_URL}/protocol`,
	},
	{
		id: "economy",
		labelKey: localizationConstants.dataItEconomy,
		href: `${DATA_IT_MODULE_BASE_URL}/economy`,
	},
	{
		id: "procurement",
		labelKey: localizationConstants.dataItPurchase,
		href: `${DATA_IT_MODULE_BASE_URL}/procurement`,
	},
	{
		id: "templates",
		labelKey: localizationConstants.dataItTemplates,
		href: `${DATA_IT_MODULE_BASE_URL}/templates`,
	},
	{
		id: "statistics",
		labelKey: localizationConstants.dataItStatistics,
		href: `${DATA_IT_MODULE_BASE_URL}/statistics`,
	},
	{
		id: "documents",
		labelKey: localizationConstants.dataItDocuments,
		href: `${DATA_IT_MODULE_BASE_URL}/documents`,
	},
	{
		id: "archive",
		labelKey: localizationConstants.dataItArchive,
		href: `${DATA_IT_MODULE_BASE_URL}/archive`,
	},
];

export const dataItBreadcrumbs = (
	sectionKey?: TranslationKeys,
): BreadcrumbItem[] => [
	{
		label: localizationConstants.home,
		href: "/dashboard",
	},
	{
		label: localizationConstants.moduleItem,
	},
	{
		label: localizationConstants.businessSupport,
		href: "/module/business-support",
	},
	{
		label: sectionKey ?? localizationConstants.dataIT,
	},
];
