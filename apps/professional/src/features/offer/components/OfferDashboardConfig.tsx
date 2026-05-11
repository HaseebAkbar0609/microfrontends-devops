import {
  CircleDollarSign,
  Layers,
  FileText,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ClipboardList,
  TrendingUp,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import {
  PlacedWidgetEntry,
  WidgetProps,
} from "@/features/widgetdashboard/types/dashboard";
import React from "react";
import { Translate } from "@/utils/translation/translate";

/**
 * Maps a sidebar item id → widget render props for Offer Dashboard
 */
export const OFFER_SIDEBAR_WIDGET_MAP: Record<string, WidgetProps> = {
  emptyPage: { title: localizationConstants.emptyPageLabel, icon: Layers },

  openQuotes: {
    title: localizationConstants.openQuotes,
    icon: FileText,
    content: (
      <div className="space-y-2 text-sm text-slate-500">
        <div>
          Offert #1004 - Teknik AB -{" "}
          <Translate text={localizationConstants.offertSent} /> -{" "}
          <Translate text={localizationConstants.offertAwaitingResponse} />
        </div>
        <div>
          Offert #1003 - ByggFix -{" "}
          <Translate text={localizationConstants.completionRequired} />
        </div>
      </div>
    ),
  },

  quickActions: {
    title: localizationConstants.quickActions,
    icon: BarChart3,
    content: (
      <div className="text-sm text-slate-500">
        <Translate text={localizationConstants.number} />: 20{" "}
        <Translate text={localizationConstants.itemsLabel} />
      </div>
    ),
  },

  kpiStatus: {
    title: localizationConstants.kpiStatus,
    icon: TrendingUp,
    content: (
      <div className="space-y-1 text-sm text-slate-500">
        <div>
          <Translate text={localizationConstants.activeQuotes} />: 17
        </div>
        <div>
          <Translate text={localizationConstants.sentQuotes} />: 9
        </div>
        <div>
          <Translate text={localizationConstants.accepted} />: 3
        </div>
        <div>
          <Translate text={localizationConstants.inquiries} />: 6
        </div>
        <div>
          <Translate text={localizationConstants.expiredQuotes} />: 1
        </div>
        <div className="flex items-center gap-1">
          <AlertTriangle size={14} className="text-amber-500" />
          <Translate text={localizationConstants.renegotiation} />: 2
        </div>
      </div>
    ),
  },

  ongoingQuotes: {
    title: localizationConstants.ongoingQuotes,
    icon: ClipboardList,
    content: (
      <div className="space-y-2 text-sm text-slate-500">
        <div>
          Quote #1004 - Teknik AB -{" "}
          <Translate text={localizationConstants.offertSent} /> -{" "}
          <Translate text={localizationConstants.awaitingResponse} />
        </div>
        <div className="flex items-center gap-1">
          Quote #1003 - ByggFix -{" "}
          <Translate text={localizationConstants.completionRequired} />
          <AlertTriangle size={14} className="text-amber-500" />
        </div>
        <div>
          Quote #1001 - EntreprenadPro -{" "}
          <Translate text={localizationConstants.createContract} />
        </div>
        <div>
          Quote #999 - IndustriPartner -{" "}
          <Translate text={localizationConstants.quoteDraftReady} />
        </div>
        <div>
          Quote #998 - FastighetCo -{" "}
          <Translate text={localizationConstants.priorityHigh} />
        </div>
      </div>
    ),
  },

  deadlinesReminders: {
    title: localizationConstants.deadlinesReminders,
    icon: Clock,
    content: (
      <div className="space-y-1 text-sm text-slate-500">
        <div>
          <Translate text={localizationConstants.finalInspection} /> 2025-002
        </div>
        <div>
          <Translate text={localizationConstants.productionStart} /> 2025-003
        </div>
      </div>
    ),
  },

  quoteFlowPipeline: {
    title: localizationConstants.quoteFlowPipeline,
    icon: CheckCircle2,
    content: (
      <div className="space-y-1 text-sm text-slate-500">
        <div>
          <Translate text={localizationConstants.activeProjects} />: 5
        </div>
        <div>
          <Translate text={localizationConstants.activeOrders} />: 15
        </div>
        <div>
          <Translate text={localizationConstants.completedChecks} />: 45
        </div>
      </div>
    ),
  },

  quickStatistics: {
    title: localizationConstants.quickStatistics,
    icon: CircleDollarSign,
    content: (
      <div className="space-y-1 text-sm text-slate-500">
        <div>
          5 <Translate text={localizationConstants.guaranteedPointsOpen} />
        </div>
        <div>
          2 <Translate text={localizationConstants.jobsInPlanningPhase} />
        </div>
        <div>
          1 <Translate text={localizationConstants.awaitingCustomerResponse} />
        </div>
      </div>
    ),
  },
};

/**
 * Initial widgets for Offer Dashboard based on the image
 */
export const OFFER_INITIAL_WIDGETS: PlacedWidgetEntry[] = [
  {
    uid: "offer-open-quotes",
    sidebarId: "openQuotes",
    colSpanClass: "col-span-12 md:col-span-4",
    widgetProps: OFFER_SIDEBAR_WIDGET_MAP.openQuotes,
  },
  {
    uid: "offer-quick-actions",
    sidebarId: "quickActions",
    colSpanClass: "col-span-12 md:col-span-4",
    widgetProps: OFFER_SIDEBAR_WIDGET_MAP.quickActions,
  },
  {
    uid: "offer-kpi-status",
    sidebarId: "kpiStatus",
    colSpanClass: "col-span-12 md:col-span-4",
    widgetProps: OFFER_SIDEBAR_WIDGET_MAP.kpiStatus,
  },
  {
    uid: "offer-ongoing-quotes",
    sidebarId: "ongoingQuotes",
    colSpanClass: "col-span-12 md:col-span-4",
    widgetProps: OFFER_SIDEBAR_WIDGET_MAP.ongoingQuotes,
  },
  {
    uid: "offer-deadlines",
    sidebarId: "deadlinesReminders",
    colSpanClass: "col-span-12 md:col-span-4",
    widgetProps: OFFER_SIDEBAR_WIDGET_MAP.deadlinesReminders,
  },
  {
    uid: "offer-quote-flow",
    sidebarId: "quoteFlowPipeline",
    colSpanClass: "col-span-12 md:col-span-4",
    widgetProps: OFFER_SIDEBAR_WIDGET_MAP.quoteFlowPipeline,
  },
  {
    uid: "offer-quick-stats",
    sidebarId: "quickStatistics",
    colSpanClass: "col-span-12 md:col-span-4",
    widgetProps: OFFER_SIDEBAR_WIDGET_MAP.quickStatistics,
  },
  {
    uid: "offer-empty-1",
    sidebarId: "emptyPage",
    colSpanClass: "col-span-12 md:col-span-4",
    widgetProps: OFFER_SIDEBAR_WIDGET_MAP.emptyPage,
  },
  {
    uid: "offer-empty-2",
    sidebarId: "emptyPage",
    colSpanClass: "col-span-12 md:col-span-8",
    widgetProps: OFFER_SIDEBAR_WIDGET_MAP.emptyPage,
  },
];
