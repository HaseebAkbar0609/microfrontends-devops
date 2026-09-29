import type { BreadcrumbItem } from "@/types/common";
import type { RouteTabItem } from "@/types/navigation";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";

export const VEHICLE_MODULE_BASE_URL = "/module/production/vehicle";
export const VEHICLE_FLEET_BASE_URL = "/module/production/vehicle/fleet";
export const VEHICLE_DRIVE_BASE_URL = "/module/production/vehicle/drive";
export const VEHICLE_ROUTES_BASE_URL = "/module/production/vehicle/routes";
export const VEHICLE_ARCHIVE_BASE_URL = "/module/production/vehicle/archive";

/** Module title shown as the top H1 above the tab bar */
export const VEHICLE_MODULE_TITLE = localizationConstants.vehicle;

/**
 * `Home > Modul > Fordon` breadcrumb for Vehicle Dashboard
 */
export function vehicleDashboardBreadcrumbs(): BreadcrumbItem[] {
	return [
		{ label: localizationConstants.home, href: "/dashboard" },
		{ label: localizationConstants.moduleLabel },
		{ label: localizationConstants.vehicle },
	];
}

/**
 * `Home > Modul > Fordon > Section` breadcrumb for Vehicle subpages
 */
export function vehicleBreadcrumbs(section: TranslationKeys): BreadcrumbItem[] {
	return [
		{ label: localizationConstants.home, href: "/dashboard" },
		{ label: localizationConstants.moduleLabel },
		{ label: localizationConstants.vehicle, href: VEHICLE_MODULE_BASE_URL },
		{ label: section },
	];
}

/** Primary tab row for the Vehicle module matching the 1-level tabs guideline */
export const VEHICLE_MODULE_TABS: RouteTabItem[] = [
	{
		id: "dashboard",
		labelKey: localizationConstants.vehicleTabDashboard,
		href: VEHICLE_MODULE_BASE_URL,
		exact: true,
	},
	{
		id: "fleet",
		labelKey: localizationConstants.vehicleTabFleet,
		href: VEHICLE_FLEET_BASE_URL,
	},
	{
		id: "drive",
		labelKey: localizationConstants.vehicleTabDrive,
		href: VEHICLE_DRIVE_BASE_URL,
	},
	{
		id: "routes",
		labelKey: localizationConstants.vehicleTabRoutes,
		href: VEHICLE_ROUTES_BASE_URL,
	},
	{
		id: "archive",
		labelKey: localizationConstants.vehicleTabArchive,
		href: VEHICLE_ARCHIVE_BASE_URL,
	},
];
