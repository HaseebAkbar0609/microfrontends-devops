import type { RouteTabItem } from "@/types/navigation";
import localizationConstants from "@/utils/translation/constants";

export const DESIGN_MODULE_BASE_URL = "/module/production/design";

/** Module title shown as the H1 on every page of the Design module (rule 1). */
export const DESIGN_MODULE_TITLE = localizationConstants.design;

/** Primary tab row for the Design (Projektering) module. */
export const DESIGN_MODULE_TABS: RouteTabItem[] = [
	{
		id: "dashboard",
		labelKey: localizationConstants.designDashboard,
		href: DESIGN_MODULE_BASE_URL,
		exact: true,
	},
	{
		id: "ritningar",
		labelKey: localizationConstants.designSidebarRitningar,
		href: `${DESIGN_MODULE_BASE_URL}/ritningar`,
	},
	{
		id: "bim",
		labelKey: localizationConstants.designSidebarBIM,
		href: `${DESIGN_MODULE_BASE_URL}/bim`,
	},
	{
		id: "handlingar",
		labelKey: localizationConstants.designSidebarHandlingar,
		href: `${DESIGN_MODULE_BASE_URL}/handlingar`,
	},
	{
		id: "granskning",
		labelKey: localizationConstants.designSidebarGranskning,
		href: `${DESIGN_MODULE_BASE_URL}/granskning`,
	},
	{
		id: "revisioner",
		labelKey: localizationConstants.designSidebarRevisioner,
		href: `${DESIGN_MODULE_BASE_URL}/revisioner`,
	},
	{
		id: "archive",
		labelKey: localizationConstants.designSidebarArchive,
		href: `${DESIGN_MODULE_BASE_URL}/archive`,
	},
];
