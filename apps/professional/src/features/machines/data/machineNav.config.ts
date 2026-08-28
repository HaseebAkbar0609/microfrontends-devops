import type { BreadcrumbItem } from "@/types/common";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";

export const MACHINE_MODULE_BASE_URL = "/module/production/machine";
export const MACHINE_HANDLING_BASE_URL = "/module/production/machine/handling";
export const MACHINE_STATISTICS_BASE_URL = "/module/production/machine/statistics";

/** Module title shown as the H1 on every page of the Machine module. */
export const MACHINE_MODULE_TITLE = localizationConstants.machineOverviewTitle;

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
