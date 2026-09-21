import {
	BarChart3,
	Bell,
	Bot,
	CalendarDays,
	CircleDollarSign,
	Clock,
	Image as ImageIcon,
	Layers,
	Newspaper,
	PieChart,
	Receipt,
	TrafficCone,
	Trophy,
} from "lucide-react";
import { RouteTabItem } from "@/types/navigation";
import { WidgetItem } from "@/features/widgetdashboard/components/DraggableSidebarItem";
import localizationConstants from "@/utils/translation/constants";

export const calculationNavItems: RouteTabItem[] = [
	{
		id: "overview",
		labelKey: localizationConstants.calcOverview,
		href: "/module/business/calculation/dashboard",
		exact: true,
	},
	{
		id: "calc-overview",
		labelKey: localizationConstants.calcOverviewPage,
		href: "/module/business/calculation/overview",
	},
	{
		id: "kalkyl",
		labelKey: localizationConstants.calcKalkyl,
		href: "/module/business/calculation/kalkyl",
	},
	{
		id: "statistics",
		labelKey: localizationConstants.calcStatistics,
		href: "/module/business/calculation/statistics",
	},
	{
		id: "archive",
		labelKey: localizationConstants.archive,
		href: "/module/business/calculation/archive",
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
