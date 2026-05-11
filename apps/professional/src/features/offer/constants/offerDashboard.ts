import { BreadcrumbItem } from "@/types/common";
import localizationConstants from "@/utils/translation/constants";

export const OFFER_DASHBOARD_BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.home, href: "/home" },
	{
		label: localizationConstants.offer,
		href: "module/business/offer/dashboard",
	},
	{ label: localizationConstants.offerDashboard },
];
