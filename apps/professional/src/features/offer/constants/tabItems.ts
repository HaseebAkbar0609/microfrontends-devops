import { RouteTabItem } from "@/types/navigation";
import localizationConstants from "@/utils/translation/constants";

export const offerNavItems: RouteTabItem[] = [
	{
		id: "dashboard",
		labelKey: localizationConstants.offerDashboard,
		href: "/module/business/offer/dashboard",
	},
	{
		id: "list",
		labelKey: localizationConstants.offerList,
		href: "/module/business/offer/list",
	},
	{
		id: "archive",
		labelKey: localizationConstants.archive,
		href: "/module/business/offer/archive",
	},
];

export const offerSidebarItems = offerNavItems;

export const goToItems: RouteTabItem[] = [
	{
		id: "quote-request",
		labelKey: localizationConstants.offerTabRequest,
		href: "/module/business/offer/request",
	},
];
