import { BreadcrumbItem } from "@/types/common";
import { RouteTabItem } from "@/types/navigation";
import localizationConstants from "@/utils/translation/constants";

export const PERSONNEL_MODULE_BASE_URL = "/module/financial-management/personnel";

export const PERSONNEL_NAV_ITEMS: RouteTabItem[] = [
	{
		id: "dashboard",
		labelKey: localizationConstants.personalDashboardTab,
		href: PERSONNEL_MODULE_BASE_URL,
	},
	{
		id: "overview",
		labelKey: localizationConstants.personalOverviewTab,
		href: `${PERSONNEL_MODULE_BASE_URL}/overview`,
	},
	{
		id: "worktime",
		labelKey: localizationConstants.worktimeTab,
		href: `${PERSONNEL_MODULE_BASE_URL}/worktime`,
	},
];

export function personnelBreadcrumbs(pageTitle?: string): BreadcrumbItem[] {
	const items: BreadcrumbItem[] = [
		{
			label: localizationConstants.home,
			href: "/home",
		},
		{
			label: localizationConstants.personnel,
			href: PERSONNEL_MODULE_BASE_URL,
		},
	];

	if (pageTitle && pageTitle !== localizationConstants.personnel) {
		items.push({
			label: pageTitle,
		});
	}

	return items;
}
