import {
	Bot,
	Building2,
	CalendarDays,
	ClipboardList,
	CircleDollarSign,
	Globe,
	HardHat,
	Image as ImageIcon,
	Layers,
	Megaphone,
	Newspaper,
	Package,
	PanelsTopLeft,
	ShieldCheck,
	Star,
	Timer,
	TrendingUp,
	Truck,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { PlacedWidgetEntry, WidgetProps } from "../types/dashboard";
import { HomeQuotesWidget } from "./HomeQuotesWidget";

export const SIDEBAR_WIDGET_MAP: Record<string, WidgetProps> = {
	emptyPage: { title: localizationConstants.emptyPageLabel, icon: Layers },

	kpiDashboard: {
		title: localizationConstants.homeKpiTitle,
		icon: Star,
	},

	aiAssistant: {
		title: localizationConstants.homeAiTitle,
		icon: Bot,
	},

	messagesNews: {
		title: localizationConstants.homeMessagesTitle,
		icon: Megaphone,
	},

	newsFeed: {
		title: localizationConstants.homeNewsFeedTitle,
		icon: Newspaper,
	},

	calendar: {
		title: localizationConstants.homeCalendarTitle,
		icon: CalendarDays,
	},

	staff: {
		title: localizationConstants.homeStaffTitle,
		icon: HardHat,
	},

	quotes: {
		title: localizationConstants.homeQuotesTitle,
		icon: CircleDollarSign,
		content: <HomeQuotesWidget />,
	},

	orders: {
		title: localizationConstants.homeOrdersTitle,
		icon: ClipboardList,
	},

	projects: {
		title: localizationConstants.homeProjectsTitle,
		icon: PanelsTopLeft,
	},

	marketplace: {
		title: localizationConstants.homeMarketplaceTitle,
		icon: Globe,
	},

	timeReporting: {
		title: localizationConstants.homeTimeReportTitle,
		icon: Timer,
	},

	kmaSecureCheck: {
		title: localizationConstants.homeKmaTitle,
		icon: ShieldCheck,
	},

	purchasing: {
		title: localizationConstants.homePurchaseTitle,
		icon: Package,
	},

	vehicles: {
		title: localizationConstants.homeVehiclesTitle,
		icon: Truck,
	},

	economyForecast: {
		title: localizationConstants.homeEconomyTitle,
		icon: TrendingUp,
	},

	companyPresentation: {
		title: localizationConstants.homeCompanyTitle,
		icon: Building2,
	},

	image: {
		title: localizationConstants.homeImageTitle,
		icon: ImageIcon,
	},
};

export const HOME_WIDGET_ORDER = [
	"kpiDashboard",
	"aiAssistant",
	"messagesNews",
	"newsFeed",
	"calendar",
	"staff",
	"quotes",
	"orders",
	"projects",
	"marketplace",
	"timeReporting",
	"kmaSecureCheck",
	"purchasing",
	"vehicles",
	"economyForecast",
	"companyPresentation",
	"image",
] as const;

export const INITIAL_WIDGETS: PlacedWidgetEntry[] = HOME_WIDGET_ORDER.map(
	(id) => ({
		uid: `home-${id}`,
		sidebarId: id,
		colSpanClass: "col-span-12 md:col-span-6 xl:col-span-4",
		widgetProps: SIDEBAR_WIDGET_MAP[id],
	}),
);
