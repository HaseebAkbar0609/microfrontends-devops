import {
	Archive,
	ArrowRight,
	BarChart3,
	Bell,
	Bot,
	CalendarDays,
	CircleDollarSign,
	Clock,
	FileText,
	Image as ImageIcon,
	Layers,
	Newspaper,
	PieChart,
	Receipt,
	TrafficCone,
	Trophy,
} from "lucide-react";
import { BreadcrumbItem } from "@/types/common";
import { DynamicSubSidebarItem } from "@/components/layout/sidebar/DynamicSubSidebar";
import { WidgetItem } from "@/features/widgetdashboard/components/DraggableSidebarItem";
import localizationConstants from "@/utils/translation/constants";

export const CALCULATION_DASHBOARD_BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.home, href: "/home" },
	{
		label: localizationConstants.calculation,
		href: "/module/business/calculation",
	},
	{ label: localizationConstants.calcOverview },
];

export const calculationSidebarItems: DynamicSubSidebarItem[] = [
	{
		id: "overview",
		labelKey: localizationConstants.calcOverview,
		href: "/module/business/calculation",
		icon: FileText,
		exact: true,
	},
	{
		id: "kalkyl",
		labelKey: localizationConstants.calcKalkyl,
		href: "/module/business/calculation/kalkyl",
		icon: FileText,
	},
	{
		id: "statistics",
		labelKey: localizationConstants.calcStatistics,
		href: "/module/business/calculation/statistics",
		icon: BarChart3,
	},
	{
		id: "archive",
		labelKey: localizationConstants.archive,
		href: "/module/business/calculation/archive",
		icon: Archive,
	},
];

export const calculationGoToItems: DynamicSubSidebarItem[] = [
	{
		id: "calculation-3001",
		label: "Calculation 3001",
		href: "/module/business/calculation",
		icon: ArrowRight,
	},
];

/** Same 12 widgets as the calculation grid, in ticket order (plus the empty slot). */
export const CALCULATION_SIDEBAR_ITEMS: WidgetItem[] = [
	{
		id: "emptyPage",
		label: localizationConstants.emptyPageLabel,
		icon: Layers,
	},
	{
		id: "calcOverview",
		label: localizationConstants.calcWidgetOverviewTitle,
		icon: PieChart,
	},
	{
		id: "calcStatus",
		label: localizationConstants.calcWidgetStatusTitle,
		icon: TrafficCone,
	},
	{
		id: "calcValue",
		label: localizationConstants.calcWidgetValueTitle,
		icon: CircleDollarSign,
	},
	{
		id: "calcCostDistribution",
		label: localizationConstants.calcWidgetCostTitle,
		icon: Receipt,
	},
	{
		id: "calcCalendar",
		label: localizationConstants.calcWidgetCalendarTitle,
		icon: CalendarDays,
	},
	{
		id: "calcLatest",
		label: localizationConstants.calcWidgetLatestTitle,
		icon: Clock,
	},
	{
		id: "calcRequiresAction",
		label: localizationConstants.calcWidgetActionTitle,
		icon: Bell,
	},
	{
		id: "calcWonLost",
		label: localizationConstants.calcWidgetWonLostTitle,
		icon: Trophy,
	},
	{
		id: "calcAiQuick",
		label: localizationConstants.calcWidgetAiTitle,
		icon: Bot,
	},
	{
		id: "calcStatistics",
		label: localizationConstants.calcWidgetStatsTitle,
		icon: BarChart3,
	},
	{
		id: "calcNews",
		label: localizationConstants.calcWidgetNewsTitle,
		icon: Newspaper,
	},
	{
		id: "image",
		label: localizationConstants.calcWidgetImageTitle,
		icon: ImageIcon,
	},
];
