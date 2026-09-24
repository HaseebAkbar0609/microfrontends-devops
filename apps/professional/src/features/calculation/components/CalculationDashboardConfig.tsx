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
import localizationConstants from "@/utils/translation/constants";
import {
	PlacedWidgetEntry,
	WidgetProps,
} from "@/features/widgetdashboard/types/dashboard";

/**
 * Maps a sidebar item id → widget render props for the Calculation dashboard.
 * Mock content only — replace with API data when available.
 */
export const CALCULATION_SIDEBAR_WIDGET_MAP: Record<string, WidgetProps> = {
	emptyPage: { title: localizationConstants.emptyPageLabel, icon: Layers },

	// 1. Kalkylöversikt
	calcOverview: {
		title: localizationConstants.calcWidgetOverviewTitle,
		icon: PieChart,
	},

	// 2. Kalkylstatus
	calcStatus: {
		title: localizationConstants.calcWidgetStatusTitle,
		icon: TrafficCone,
	},

	// 3. Kalkylvärde
	calcValue: {
		title: localizationConstants.calcWidgetValueTitle,
		icon: CircleDollarSign,
	},

	// 4. Kostnadsfördelning
	calcCostDistribution: {
		title: localizationConstants.calcWidgetCostTitle,
		icon: Receipt,
	},

	// 5. Kalkylkalender
	calcCalendar: {
		title: localizationConstants.calcWidgetCalendarTitle,
		icon: CalendarDays,
	},

	// 6. Senaste Kalkyler
	calcLatest: {
		title: localizationConstants.calcWidgetLatestTitle,
		icon: Clock,
	},

	// 7. Kalkyler som kräver åtgärd
	calcRequiresAction: {
		title: localizationConstants.calcWidgetActionTitle,
		icon: Bell,
	},

	// 8. Vunna & Förlorade Kalkyler
	calcWonLost: {
		title: localizationConstants.calcWidgetWonLostTitle,
		icon: Trophy,
	},

	// 9. AI Quick Calc
	calcAiQuick: {
		title: localizationConstants.calcWidgetAiTitle,
		icon: Bot,
	},

	// 10. Kalkylstatistik
	calcStatistics: {
		title: localizationConstants.calcWidgetStatsTitle,
		icon: BarChart3,
	},

	// 11. Nyheter
	calcNews: {
		title: localizationConstants.calcWidgetNewsTitle,
		icon: Newspaper,
	},

	// 12. Bild
	image: {
		title: localizationConstants.calcWidgetImageTitle,
		icon: ImageIcon,
	},
};

/** Widget order defined by the calculation module widget structure ticket. */
export const CALCULATION_WIDGET_ORDER = [
	"calcOverview",
	"calcStatus",
	"calcValue",
	"calcCostDistribution",
	"calcCalendar",
	"calcLatest",
	"calcRequiresAction",
	"calcWonLost",
	"calcAiQuick",
	"calcStatistics",
	"calcNews",
	"image",
] as const;

/** The 12 widgets shown on first load, in ticket order. */
export const CALCULATION_INITIAL_WIDGETS: PlacedWidgetEntry[] =
	CALCULATION_WIDGET_ORDER.map((id) => ({
		uid: `calc-${id}`,
		sidebarId: id,
		colSpanClass: "col-span-12 md:col-span-6 xl:col-span-4",
		widgetProps: CALCULATION_SIDEBAR_WIDGET_MAP[id],
	}));
