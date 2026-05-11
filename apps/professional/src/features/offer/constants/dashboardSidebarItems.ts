// ─── Offer Dashboard Sidebar Items ────────────────────────────────────────────

import localizationConstants from "@/utils/translation/constants";
import { WidgetItem } from "@/features/widgetdashboard/components/DraggableSidebarItem";
import {
	Layers,
	FileText,
	BarChart3,
	TrendingUp,
	ClipboardList,
	Clock,
	CheckCircle2,
	CircleDollarSign,
} from "lucide-react";

export const OFFER_SIDEBAR_ITEMS: WidgetItem[] = [
	{ id: "emptyPage", label: localizationConstants.emptyPageLabel, icon: Layers },
	{ id: "openQuotes", label: localizationConstants.openQuotes, icon: FileText },
	{ id: "quickActions", label: localizationConstants.quickActions, icon: BarChart3 },
	{ id: "kpiStatus", label: localizationConstants.kpiStatus, icon: TrendingUp },
	{ id: "ongoingQuotes", label: localizationConstants.ongoingQuotes, icon: ClipboardList },
	{ id: "deadlinesReminders", label: localizationConstants.deadlinesReminders, icon: Clock },
	{ id: "quoteFlowPipeline", label: localizationConstants.quoteFlowPipeline, icon: CheckCircle2 },
	{ id: "quickStatistics", label: localizationConstants.quickStatistics, icon: CircleDollarSign },
];
