import { RouteTabItem } from "@/types/navigation";
import localizationConstants from "@/utils/translation/constants";

export const businessSupportNavItems: RouteTabItem[] = [
	{
		id: "management-support",
		labelKey: localizationConstants.managementSupport,
		href: "/module/business-support/management-support",
	},
	{
		id: "marketing-sales",
		labelKey: localizationConstants.marketingSales,
		href: "/module/business-support/marketing-sales",
	},
	{
		id: "agreement",
		labelKey: localizationConstants.agreement,
		href: "/module/business-support/agreement",
	},
	{
		id: "data-it",
		labelKey: localizationConstants.dataIT,
		href: "/module/business-support/data-it",
	},
	{
		id: "templates",
		labelKey: localizationConstants.templates,
		href: "/module/business-support/templates",
	},
];

export const businessSupportSidebarItems = businessSupportNavItems;

export const agreementNavItems: RouteTabItem[] = [
	{
		id: "dashboard",
		labelKey: localizationConstants.agreementDashboardTitle,
		href: "/module/business-support/agreement/dashboard",
	},
	{
		id: "overview",
		labelKey: localizationConstants.agreementOverview,
		href: "/module/business-support/agreement/overview",
	},
	{
		id: "documents",
		labelKey: localizationConstants.documentCenterItem,
		href: "/module/business-support/agreement/documents",
	},
	{
		id: "archive",
		labelKey: localizationConstants.archiveItem,
		href: "/module/business-support/agreement/archive",
	},
];

export const agreementSidebarItems = agreementNavItems;
