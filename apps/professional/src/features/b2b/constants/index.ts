import {
	Archive,
	CalendarDays,
	ClipboardList,
	FileText,
	Image as ImageIcon,
	Newspaper,
	Search,
	Store,
	TrendingUp,
} from "lucide-react";
import { BreadcrumbItem } from "@/types/common";
import { DynamicSubSidebarItem } from "@/components/layout/sidebar/DynamicSubSidebar";
import { WidgetItem } from "@/features/widgetdashboard/components/DraggableSidebarItem";
import localizationConstants from "@/utils/translation/constants";

export const B2B_DASHBOARD_BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.home, href: "/home" },
	{ label: localizationConstants.b2b, href: "/module/business/b2b" },
	{ label: localizationConstants.b2bOverview },
];

export const b2bSidebarItems: DynamicSubSidebarItem[] = [
	{
		id: "overview",
		labelKey: localizationConstants.b2bOverview,
		href: "/module/business/b2b",
		icon: FileText,
		exact: true,
	},
	{
		id: "project-market",
		labelKey: localizationConstants.b2bProjectMarket,
		href: "/module/business/b2b/project-market",
		icon: Store,
	},
	{
		id: "archive",
		labelKey: localizationConstants.archive,
		href: "/module/business/b2b/archive",
		icon: Archive,
	},
];

export const B2B_SIDEBAR_ITEMS: WidgetItem[] = [
	{
		id: "availableAssignments",
		label: localizationConstants.b2bAvailableAssignments,
		icon: Search,
	},
	{
		id: "myB2BAds",
		label: localizationConstants.b2bMyAds,
		icon: ClipboardList,
	},
	{
		id: "b2bCalendar",
		label: localizationConstants.b2bCalendar,
		icon: CalendarDays,
	},
	{
		id: "statistics",
		label: localizationConstants.b2bStatistics,
		icon: TrendingUp,
	},
	{ id: "image", label: localizationConstants.imageLabel, icon: ImageIcon },
	{ id: "news", label: localizationConstants.newsLabel, icon: Newspaper },
];
