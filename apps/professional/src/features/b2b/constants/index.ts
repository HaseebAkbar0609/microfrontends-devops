import {
	Archive,
	BarChart3,
	Bot,
	CalendarDays,
	ClipboardList,
	FileText,
	Handshake,
	Image as ImageIcon,
	Layers,
	Megaphone,
	Newspaper,
	PieChart,
	ScrollText,
	Search,
	Store,
	Zap,
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
		id: "deals",
		labelKey: localizationConstants.b2bDeals,
		href: "/module/business/b2b/deals",
		icon: Handshake,
	},
	{
		id: "avtal",
		labelKey: localizationConstants.b2bAvtal,
		href: "/module/business/b2b/agreements",
		icon: ScrollText,
	},
	{
		id: "archive",
		labelKey: localizationConstants.archive,
		href: "/module/business/b2b/archive",
		icon: Archive,
	},
];

/** Same 11 widgets as the B2B grid, in ticket order (plus the empty slot). */
export const B2B_SIDEBAR_ITEMS: WidgetItem[] = [
	{
		id: "emptyPage",
		label: localizationConstants.emptyPageLabel,
		icon: Layers,
	},
	{
		id: "b2bOverview",
		label: localizationConstants.b2bWidgetOverviewTitle,
		icon: PieChart,
	},
	{
		id: "b2bAvailableAssignments",
		label: localizationConstants.b2bWidgetAvailableTitle,
		icon: Search,
	},
	{
		id: "b2bPublishedAssignments",
		label: localizationConstants.b2bWidgetPublishedTitle,
		icon: Megaphone,
	},
	{
		id: "b2bInterestRegistrations",
		label: localizationConstants.b2bWidgetInterestTitle,
		icon: Handshake,
	},
	{
		id: "b2bAds",
		label: localizationConstants.b2bWidgetAdsTitle,
		icon: ClipboardList,
	},
	{
		id: "b2bCalendar",
		label: localizationConstants.b2bWidgetCalendarTitle,
		icon: CalendarDays,
	},
	{
		id: "b2bActivity",
		label: localizationConstants.b2bWidgetActivityTitle,
		icon: Zap,
	},
	{
		id: "b2bAiRecommendations",
		label: localizationConstants.b2bWidgetAiTitle,
		icon: Bot,
	},
	{
		id: "b2bStatistics",
		label: localizationConstants.b2bWidgetStatsTitle,
		icon: BarChart3,
	},
	{
		id: "b2bNews",
		label: localizationConstants.b2bWidgetNewsTitle,
		icon: Newspaper,
	},
	{
		id: "image",
		label: localizationConstants.b2bWidgetImageTitle,
		icon: ImageIcon,
	},
];
