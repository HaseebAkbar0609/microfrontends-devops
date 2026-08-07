import {
	Briefcase,
	Database,
	LayoutTemplate,
	Megaphone,
	ScrollText,
} from "lucide-react";
import { DynamicSubSidebarItem } from "@/components/layout/sidebar/DynamicSubSidebar";
import localizationConstants from "@/utils/translation/constants";

export const businessSupportSidebarItems: DynamicSubSidebarItem[] = [
	{
		id: "management-support",
		labelKey: localizationConstants.managementSupport,
		href: "/module/business-support/management-support",
		icon: Briefcase,
	},
	{
		id: "marketing-sales",
		labelKey: localizationConstants.marketingSales,
		href: "/module/business-support/marketing-sales",
		icon: Megaphone,
	},
	{
		id: "agreement",
		labelKey: localizationConstants.agreement,
		href: "/module/business-support/agreement/dashboard",
		icon: ScrollText,
	},
	{
		id: "data-it",
		labelKey: localizationConstants.dataIT,
		href: "/module/business-support/data-it",
		icon: Database,
	},
	{
		id: "templates",
		labelKey: localizationConstants.templates,
		href: "/module/business-support/templates",
		icon: LayoutTemplate,
	},
];
