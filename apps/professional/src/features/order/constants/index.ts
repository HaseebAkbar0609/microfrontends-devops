import {
	BarChart3,
	Bell,
	Bot,
	CalendarClock,
	CalendarDays,
	CircleDollarSign,
	HardHat,
	Image as ImageIcon,
	Layers,
	Newspaper,
	PieChart,
	Plus,
	ShieldCheck,
	Timer,
	TrafficCone,
	Zap,
} from "lucide-react";
import { WidgetItem } from "@/features/widgetdashboard/components/DraggableSidebarItem";
import localizationConstants from "@/utils/translation/constants";

export const ORDER_SIDEBAR_ITEMS: WidgetItem[] = [
	{
		id: "emptyPage",
		label: localizationConstants.emptyPageLabel,
		icon: Layers,
	},
	{
		id: "orderOverview",
		label: localizationConstants.orderWidgetOverviewTitle,
		icon: PieChart,
	},
	{
		id: "orderStatus",
		label: localizationConstants.orderWidgetStatusTitle,
		icon: TrafficCone,
	},
	{
		id: "orderDirect",
		label: localizationConstants.orderWidgetDirectTitle,
		icon: Bell,
	},
	{
		id: "orderToday",
		label: localizationConstants.orderWidgetTodayTitle,
		icon: CalendarDays,
	},
	{
		id: "orderCalendar",
		label: localizationConstants.orderWidgetCalendarTitle,
		icon: CalendarClock,
	},
	{
		id: "orderValue",
		label: localizationConstants.orderWidgetValueTitle,
		icon: CircleDollarSign,
	},
	{
		id: "orderResources",
		label: localizationConstants.orderWidgetResourcesTitle,
		icon: HardHat,
	},
	{
		id: "orderTimeReporting",
		label: localizationConstants.orderWidgetTimeTitle,
		icon: Timer,
	},
	{
		id: "orderAta",
		label: localizationConstants.orderWidgetAtaTitle,
		icon: Plus,
	},
	{
		id: "orderKma",
		label: localizationConstants.orderWidgetKmaTitle,
		icon: ShieldCheck,
	},
	{
		id: "orderRequiresAction",
		label: localizationConstants.orderWidgetActionTitle,
		icon: Bell,
	},
	{
		id: "orderAiAssistant",
		label: localizationConstants.orderWidgetAiTitle,
		icon: Bot,
	},
	{
		id: "orderActivity",
		label: localizationConstants.orderWidgetActivityTitle,
		icon: Zap,
	},
	{
		id: "orderStatistics",
		label: localizationConstants.orderWidgetStatsTitle,
		icon: BarChart3,
	},
	{
		id: "orderNews",
		label: localizationConstants.orderWidgetNewsTitle,
		icon: Newspaper,
	},
	{
		id: "image",
		label: localizationConstants.orderWidgetImageTitle,
		icon: ImageIcon,
	},
];
