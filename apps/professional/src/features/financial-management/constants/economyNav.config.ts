import type { BreadcrumbItem } from "@/types/common";
import type { RouteTabItem } from "@/types/navigation";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";

export const ECONOMY_MODULE_BASE_URL = "/module/financial-management";
export const ECONOMY_INVOICE_BASE_URL = `${ECONOMY_MODULE_BASE_URL}/invoice`;
export const ECONOMY_EXPENSE_BASE_URL = `${ECONOMY_MODULE_BASE_URL}/economy`;
export const ECONOMY_FORECAST_BASE_URL = `${ECONOMY_MODULE_BASE_URL}/forecast`;
export const ECONOMY_ROT_RUT_BASE_URL = `${ECONOMY_MODULE_BASE_URL}/rot-rut`;
export const ECONOMY_PERSONNEL_BASE_URL = `${ECONOMY_MODULE_BASE_URL}/personnel`;
export const ECONOMY_LAW_BASE_URL = `${ECONOMY_MODULE_BASE_URL}/law`;
export const ECONOMY_DEBT_COLLECTION_BASE_URL = `${ECONOMY_MODULE_BASE_URL}/debt-collection`;

/** Module title shown as the H1 on every page of the Economi module (Rule 1). */
export const ECONOMY_MODULE_TITLE = localizationConstants.financialManagement;

/**
 * `Home > Modul > Ekonomistyrning` breadcrumb for Economi Dashboard / Overview.
 */
export function economyDashboardBreadcrumbs(
	section?: TranslationKeys,
): BreadcrumbItem[] {
	return [
		{ label: localizationConstants.home, href: "/dashboard" },
		{ label: localizationConstants.moduleItem },
		{
			label: localizationConstants.financialManagement,
			href: ECONOMY_MODULE_BASE_URL,
		},
		{ label: section ?? localizationConstants.dashboard },
	];
}

/**
 * `Home > Modul > Ekonomistyrning > Section` breadcrumb for Economi subpages (Rule 2).
 */
export function economyBreadcrumbs(section: TranslationKeys): BreadcrumbItem[] {
	return [
		{ label: localizationConstants.home, href: "/dashboard" },
		{ label: localizationConstants.moduleItem },
		{
			label: localizationConstants.financialManagement,
			href: ECONOMY_MODULE_BASE_URL,
		},
		{ label: section },
	];
}

/** Primary tab row for the Economi (Financial Management) module (Rule 1). */
export const ECONOMY_MODULE_TABS: RouteTabItem[] = [
	{
		id: "overview",
		labelKey: localizationConstants.dashboard,
		href: ECONOMY_MODULE_BASE_URL,
		exact: true,
	},
	{
		id: "invoice",
		labelKey: localizationConstants.invoice,
		href: ECONOMY_INVOICE_BASE_URL,
	},
	{
		id: "economy",
		labelKey: localizationConstants.economy,
		href: ECONOMY_EXPENSE_BASE_URL,
	},
	{
		id: "forecast",
		labelKey: localizationConstants.forecast,
		href: ECONOMY_FORECAST_BASE_URL,
	},
	{
		id: "rot-rut",
		labelKey: localizationConstants.rotRutNav,
		href: ECONOMY_ROT_RUT_BASE_URL,
	},
	{
		id: "personnel",
		labelKey: localizationConstants.personnel,
		href: ECONOMY_PERSONNEL_BASE_URL,
	},
	{
		id: "law",
		labelKey: localizationConstants.law,
		href: ECONOMY_LAW_BASE_URL,
	},
	{
		id: "debt-collection",
		labelKey: localizationConstants.debtCollection,
		href: ECONOMY_DEBT_COLLECTION_BASE_URL,
	},
];
