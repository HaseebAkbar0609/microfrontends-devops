import {
	BarChart3,
	Bell,
	Bot,
	CalendarDays,
	CalendarClock,
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
import localizationConstants from "@/utils/translation/constants";
import {
	PlacedWidgetEntry,
	WidgetProps,
} from "@/features/widgetdashboard/types/dashboard";

export const ORDER_SIDEBAR_WIDGET_MAP: Record<string, WidgetProps> = {
	emptyPage: { title: localizationConstants.emptyPageLabel, icon: Layers },

	orderOverview: {
		title: localizationConstants.orderWidgetOverviewTitle,
		icon: PieChart,
	},

	orderStatus: {
		title: localizationConstants.orderWidgetStatusTitle,
		icon: TrafficCone,
	},

	orderDirect: {
		title: localizationConstants.orderWidgetDirectTitle,
		icon: Bell,
	},

	orderToday: {
		title: localizationConstants.orderWidgetTodayTitle,
		icon: CalendarDays,
	},

	orderCalendar: {
		title: localizationConstants.orderWidgetCalendarTitle,
		icon: CalendarClock,
	},

	orderValue: {
		title: localizationConstants.orderWidgetValueTitle,
		icon: CircleDollarSign,
	},

	orderResources: {
		title: localizationConstants.orderWidgetResourcesTitle,
		icon: HardHat,
	},

	orderTimeReporting: {
		title: localizationConstants.orderWidgetTimeTitle,
		icon: Timer,
	},

	orderAta: {
		title: localizationConstants.orderWidgetAtaTitle,
		icon: Plus,
	},

	orderKma: {
		title: localizationConstants.orderWidgetKmaTitle,
		icon: ShieldCheck,
	},

	orderRequiresAction: {
		title: localizationConstants.orderWidgetActionTitle,
		icon: Bell,
	},

	orderAiAssistant: {
		title: localizationConstants.orderWidgetAiTitle,
		icon: Bot,
	},

	orderActivity: {
		title: localizationConstants.orderWidgetActivityTitle,
		icon: Zap,
	},

	orderStatistics: {
		title: localizationConstants.orderWidgetStatsTitle,
		icon: BarChart3,
	},

	orderNews: {
		title: localizationConstants.orderWidgetNewsTitle,
		icon: Newspaper,
	},

	image: {
		title: localizationConstants.orderWidgetImageTitle,
		icon: ImageIcon,
	},
};

export const ORDER_WIDGET_ORDER = [
	"orderOverview",
	"orderStatus",
	"orderDirect",
	"orderToday",
	"orderCalendar",
	"orderValue",
	"orderResources",
	"orderTimeReporting",
	"orderAta",
	"orderKma",
	"orderRequiresAction",
	"orderAiAssistant",
	"orderActivity",
	"orderStatistics",
	"orderNews",
	"image",
] as const;

export const ORDER_INITIAL_WIDGETS: PlacedWidgetEntry[] =
	ORDER_WIDGET_ORDER.map((id) => ({
		uid: `order-${id}`,
		sidebarId: id,
		colSpanClass: "col-span-12 md:col-span-6 xl:col-span-4",
		widgetProps: ORDER_SIDEBAR_WIDGET_MAP[id],
	}));
