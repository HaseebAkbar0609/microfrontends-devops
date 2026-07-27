// ─── Sidebar Items ────────────────────────────────────────────────────────────

import localizationConstants from "@/utils/translation/constants";
import { WidgetItem } from "../components/DraggableSidebarItem";
import {
	Bot,
	Building2,
	CalendarDays,
	CircleDollarSign,
	ClipboardList,
	Globe,
	HardHat,
	ImageIcon,
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

export const SIDEBAR_ITEMS: WidgetItem[] = [
	{
		id: "emptyPage",
		label: localizationConstants.emptyPageLabel,
		icon: Layers,
	},
	{
		id: "kpiDashboard",
		label: localizationConstants.homeKpiTitle,
		icon: Star,
	},
	{ id: "aiAssistant", label: localizationConstants.homeAiTitle, icon: Bot },
	{
		id: "messagesNews",
		label: localizationConstants.homeMessagesTitle,
		icon: Megaphone,
	},
	{
		id: "newsFeed",
		label: localizationConstants.homeNewsFeedTitle,
		icon: Newspaper,
	},
	{
		id: "calendar",
		label: localizationConstants.homeCalendarTitle,
		icon: CalendarDays,
	},
	{ id: "staff", label: localizationConstants.homeStaffTitle, icon: HardHat },
	{
		id: "quotes",
		label: localizationConstants.homeQuotesTitle,
		icon: CircleDollarSign,
	},
	{
		id: "orders",
		label: localizationConstants.homeOrdersTitle,
		icon: ClipboardList,
	},
	{
		id: "projects",
		label: localizationConstants.homeProjectsTitle,
		icon: PanelsTopLeft,
	},
	{
		id: "marketplace",
		label: localizationConstants.homeMarketplaceTitle,
		icon: Globe,
	},
	{
		id: "timeReporting",
		label: localizationConstants.homeTimeReportTitle,
		icon: Timer,
	},
	{
		id: "kmaSecureCheck",
		label: localizationConstants.homeKmaTitle,
		icon: ShieldCheck,
	},
	{
		id: "purchasing",
		label: localizationConstants.homePurchaseTitle,
		icon: Package,
	},
	{
		id: "vehicles",
		label: localizationConstants.homeVehiclesTitle,
		icon: Truck,
	},
	{
		id: "economyForecast",
		label: localizationConstants.homeEconomyTitle,
		icon: TrendingUp,
	},
	{
		id: "companyPresentation",
		label: localizationConstants.homeCompanyTitle,
		icon: Building2,
	},
	{
		id: "image",
		label: localizationConstants.homeImageTitle,
		icon: ImageIcon,
	},
];
