"use client";

import {
	BarChart3,
	Bot,
	CalendarDays,
	CheckCircle2,
	ClipboardList,
	CircleDollarSign,
	Globe,
	History,
	Image as ImageIcon,
	Inbox,
	Layers,
	Newspaper,
	Send,
	Zap,
} from "lucide-react";
import { useOfferDashboardCounts } from "../hooks/useOfferDashboardCounts";
import type { OfferCountKey } from "../services/offerDashboardCounts";
import localizationConstants from "@/utils/translation/constants";
import type { WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import {
	WidgetContent as Content,
	WidgetErrorState,
	WidgetRow as Row,
} from "@/features/widgetdashboard/components/WidgetContent";

const LiveOfferWidget = ({ focus }: { focus: OfferCountKey }) => {
	const { counts, loading } = useOfferDashboardCounts();
	if (loading) return <div className="my-4 h-20 animate-pulse rounded-lg bg-white/70" />;
	if (!counts || counts[focus] === null) {
		return <WidgetErrorState message={localizationConstants.widgetDataLoadError} />;
	}

	return (
		<Content>
			<Row label={localizationConstants.offerWidgetOverviewTotal} value={String(counts[focus])} />
		</Content>
	);
};

export const OFFER_SIDEBAR_WIDGET_MAP: Record<string, WidgetProps> = {
	emptyPage: { title: localizationConstants.emptyPageLabel, icon: Layers },
	offerOverview: { title: localizationConstants.offerWidgetOverviewTitle, icon: ClipboardList },
	offerRequests: { title: localizationConstants.offerWidgetRequestsTitle, icon: Inbox, content: <LiveOfferWidget focus="requested" /> },
	offerAvailableProjects: { title: localizationConstants.offerWidgetProjectsTitle, icon: Globe, content: <LiveOfferWidget focus="available" /> },
	offerSent: { title: localizationConstants.offerWidgetSentTitle, icon: Send, content: <LiveOfferWidget focus="offered" /> },
	offerAccepted: { title: localizationConstants.offerWidgetAcceptedTitle, icon: CheckCircle2, content: <LiveOfferWidget focus="accepted" /> },
	offerCalendar: { title: localizationConstants.offerWidgetCalendarTitle, icon: CalendarDays },
	offerActivity: { title: localizationConstants.offerWidgetActivityTitle, icon: Zap },
	offerAiCalc: { title: localizationConstants.offerWidgetAiCalcTitle, icon: Bot },
	offerValue: { title: localizationConstants.offerWidgetValueTitle, icon: CircleDollarSign },
	offerStatistics: { title: localizationConstants.offerWidgetStatsTitle, icon: BarChart3 },
	offerHistory: { title: localizationConstants.offerWidgetHistoryTitle, icon: History, content: <LiveOfferWidget focus="archived" /> },
	offerNews: { title: localizationConstants.offerWidgetNewsTitle, icon: Newspaper },
	image: { title: localizationConstants.offerWidgetImageTitle, icon: ImageIcon },
};

export const OFFER_WIDGET_ORDER = [
	"offerOverview",
	"offerRequests",
	"offerAvailableProjects",
	"offerSent",
	"offerAccepted",
	"offerCalendar",
	"offerActivity",
	"offerAiCalc",
	"offerValue",
	"offerStatistics",
	"offerHistory",
	"offerNews",
	"image",
] as const;
