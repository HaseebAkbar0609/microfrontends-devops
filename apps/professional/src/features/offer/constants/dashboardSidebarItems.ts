// ─── Offer Dashboard Sidebar Items ────────────────────────────────────────────

import localizationConstants from "@/utils/translation/constants";
import { WidgetItem } from "@/features/widgetdashboard/components/DraggableSidebarItem";
import {
	BarChart3,
	Bot,
	CalendarDays,
	CheckCircle2,
	CircleDollarSign,
	ClipboardList,
	Globe,
	History,
	ImageIcon,
	Inbox,
	Layers,
	Newspaper,
	Send,
	Zap,
} from "lucide-react";

export const OFFER_SIDEBAR_ITEMS: WidgetItem[] = [
	{
		id: "emptyPage",
		label: localizationConstants.emptyPageLabel,
		icon: Layers,
	},
	{
		id: "offerOverview",
		label: localizationConstants.offerWidgetOverviewTitle,
		icon: ClipboardList,
	},
	{
		id: "offerRequests",
		label: localizationConstants.offerWidgetRequestsTitle,
		icon: Inbox,
	},
	{
		id: "offerAvailableProjects",
		label: localizationConstants.offerWidgetProjectsTitle,
		icon: Globe,
	},
	{
		id: "offerSent",
		label: localizationConstants.offerWidgetSentTitle,
		icon: Send,
	},
	{
		id: "offerAccepted",
		label: localizationConstants.offerWidgetAcceptedTitle,
		icon: CheckCircle2,
	},
	{
		id: "offerCalendar",
		label: localizationConstants.offerWidgetCalendarTitle,
		icon: CalendarDays,
	},
	{
		id: "offerActivity",
		label: localizationConstants.offerWidgetActivityTitle,
		icon: Zap,
	},
	{
		id: "offerAiCalc",
		label: localizationConstants.offerWidgetAiCalcTitle,
		icon: Bot,
	},
	{
		id: "offerValue",
		label: localizationConstants.offerWidgetValueTitle,
		icon: CircleDollarSign,
	},
	{
		id: "offerStatistics",
		label: localizationConstants.offerWidgetStatsTitle,
		icon: BarChart3,
	},
	{
		id: "offerHistory",
		label: localizationConstants.offerWidgetHistoryTitle,
		icon: History,
	},
	{
		id: "offerNews",
		label: localizationConstants.offerWidgetNewsTitle,
		icon: Newspaper,
	},
	{
		id: "image",
		label: localizationConstants.offerWidgetImageTitle,
		icon: ImageIcon,
	},
];
