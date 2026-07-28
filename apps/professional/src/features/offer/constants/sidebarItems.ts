import { Folder, FolderOpen, Archive } from "lucide-react";
import { DynamicSubSidebarItem } from "@/components/layout/sidebar/DynamicSubSidebar";
import localizationConstants from "@/utils/translation/constants";

export const offerSidebarItems: DynamicSubSidebarItem[] = [
	{
		id: "dashboard",
		labelKey: localizationConstants.offerDashboard,
		href: "dashboard",
		icon: Folder,
		activeIcon: FolderOpen,
	},
	{
		id: "list",
		labelKey: localizationConstants.offerList,
		href: "list",
		icon: Folder,
		activeIcon: FolderOpen,
	},
	{
		id: "archive",
		labelKey: localizationConstants.archive,
		href: "archive",
		icon: Archive,
		activeIcon: Archive,
	},
];

export const goToItems: DynamicSubSidebarItem[] = [
	{
		id: "quote-1001",
		label: "Offert nr 1001",
		href: "/module/business/offer/1001/request",
		icon: Folder,
	},
];
