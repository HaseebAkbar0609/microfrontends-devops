import { FileText, Archive, ArrowRight } from "lucide-react";
import { DynamicSubSidebarItem } from "@/components/layout/sidebar/DynamicSubSidebar";
import localizationConstants from "@/utils/translation/constants";

export const offerSidebarItems: DynamicSubSidebarItem[] = [
	{
		id: "dashboard",
		labelKey: localizationConstants.offerDashboard,
		href: "dashboard",
		icon: FileText,
	},
	{
		id: "list",
		labelKey: localizationConstants.quoteList,
		href: "list",
		icon: FileText,
	},
	{
		id: "archive",
		labelKey: localizationConstants.archive,
		href: "archive",
		icon: Archive,
	},
];

export const goToItems: DynamicSubSidebarItem[] = [
	{
		id: "quote-1001",
		label: `${localizationConstants.quoteNo} 1001`,
		href: "1001",
		icon: ArrowRight,
	},
];
