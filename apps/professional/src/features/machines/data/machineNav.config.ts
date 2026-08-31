import type { BreadcrumbItem } from "@/types/common";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";

export const MACHINE_MODULE_BASE_URL = "/module/production/machine";
export const MACHINE_OVERVIEW_BASE_URL = "/module/production/machine/overview";
export const MACHINE_HANDLING_BASE_URL = "/module/production/machine/handling";
export const MACHINE_STATISTICS_BASE_URL = "/module/production/machine/statistics";
export const MACHINE_PURCHASE_BASE_URL = "/module/production/machine/purchase";

/** Module title shown as the H1 on every page of the Machine module. */
export const MACHINE_MODULE_TITLE = localizationConstants.machineOverviewTitle;

/**
 * `Home > Modul > Maskin` breadcrumb for Machine Dashboard.
 */
export function machineDashboardBreadcrumbs(): BreadcrumbItem[] {
	return [
		{ label: localizationConstants.home, href: "/dashboard" },
		{ label: localizationConstants.moduleLabel },
		{ label: localizationConstants.machine },
	];
}

import type { RouteTabItem } from "@/types/navigation";

export const MACHINE_MODULE_TABS: RouteTabItem[] = [
	{
		id: "dashboard",
		labelKey: localizationConstants.machineSidebarDashboard,
		href: "/module/production/machine",
		exact: true,
	},
	{
		id: "overview",
		labelKey: localizationConstants.machineSidebarOverview,
		href: "/module/production/machine/overview",
	},
	{
		id: "handling",
		labelKey: localizationConstants.machineSidebarHandling,
		href: "/module/production/machine/handling",
	},
	{
		id: "purchase",
		labelKey: localizationConstants.machineSidebarPurchase,
		href: "/module/production/machine/purchase",
	},
	{
		id: "statistics",
		labelKey: localizationConstants.machineSidebarStatistics,
		href: "/module/production/machine/statistics",
	},
	{
		id: "archive",
		labelKey: localizationConstants.machineSidebarArchive,
		href: "/module/production/machine/archive",
	},
];

/**
 * `Home > Modul > Maskin > Section` breadcrumb, matching the breadcrumb row in
 * the TFS-803 Figma frame.
 */
export function machineBreadcrumbs(section: TranslationKeys): BreadcrumbItem[] {
	return [
		{ label: localizationConstants.home, href: "/dashboard" },
		{ label: localizationConstants.moduleLabel },
		{ label: localizationConstants.machine, href: MACHINE_MODULE_BASE_URL },
		{ label: section },
	];
}
