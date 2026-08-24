import React from "react";
import {
	Folder,
	Table2,
	DollarSign,
	ShieldCheck,
	User,
	CircleDollarSign,
	Focus,
	Layers,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import {
	PlacedWidgetEntry,
	WidgetProps,
} from "@/features/widgetdashboard/types/dashboard";
import { WidgetItem } from "@/features/widgetdashboard/components/DraggableSidebarItem";
import { Translate } from "@/utils/translation/translate";
import { B2BDashboardKpis, DEFAULT_B2B_KPIS } from "@/api-actions/b2b/b2b";

export function buildB2BWidgetMap(kpis: B2BDashboardKpis = DEFAULT_B2B_KPIS): Record<string, WidgetProps> {
	return {
		emptyPage: { title: localizationConstants.emptyPageLabel, icon: Folder },

		kpiStatus: {
			title: localizationConstants.b2bWidgetKpiStatus,
			icon: Folder,
			content: (
				<div className="space-y-0.5 text-sm text-slate-500 font-normal leading-tight">
					<div><Translate text={localizationConstants.activeProjects} />: {kpis.kpiStatus.activeProjects}</div>
					<div><Translate text={localizationConstants.b2bOngoingBilling} />: {kpis.kpiStatus.ongoingBilling}</div>
					<div><Translate text={localizationConstants.b2bDelayedMilestones} />: {kpis.kpiStatus.delayedMilestones}</div>
				</div>
			),
		},

		ongoingProjects: {
			title: localizationConstants.b2bWidgetOngoingProjects,
			icon: Table2,
			content: (
				<div className="space-y-0.5 text-sm text-slate-500 font-normal leading-tight">
					{kpis.ongoingProjects.map((p) => (
						<div key={p.id}>{p.name}</div>
					))}
				</div>
			),
		},

		upcomingActivities: {
			title: localizationConstants.b2bWidgetUpcomingActivities,
			icon: DollarSign,
			content: (
				<div className="space-y-0.5 text-sm text-slate-500 font-normal leading-tight">
					{kpis.upcomingActivities.map((a) => (
						<div key={a.id}>{a.title}</div>
					))}
				</div>
			),
		},

		financialOverview: {
			title: localizationConstants.b2bWidgetFinancialOverview,
			icon: ShieldCheck,
			content: (
				<div className="space-y-0.5 text-sm text-slate-500 font-normal leading-tight">
					<div><Translate text={localizationConstants.activeProjects} />: {kpis.financialOverview.activeProjects}</div>
					<div><Translate text={localizationConstants.activeOrders} />: {kpis.financialOverview.activeOrders}</div>
					<div><Translate text={localizationConstants.completedChecks} />: {kpis.financialOverview.completedChecks}</div>
				</div>
			),
		},

		guaranteeCommitments: {
			title: localizationConstants.b2bWidgetGuaranteeCommitments,
			icon: User,
			content: (
				<div className="space-y-0.5 text-sm text-slate-500 font-normal leading-tight">
					<div>{kpis.guaranteeCommitments.guaranteedPointsOpen} <Translate text={localizationConstants.guaranteedPointsOpen} /></div>
					<div>{kpis.guaranteeCommitments.jobsInPlanningPhase} <Translate text={localizationConstants.jobsInPlanningPhase} /></div>
					<div>{kpis.guaranteeCommitments.awaitingCustomerResponse} <Translate text={localizationConstants.awaitingCustomerResponse} /></div>
				</div>
			),
		},

		events: {
			title: localizationConstants.b2bWidgetEvents,
			icon: CircleDollarSign,
			content: (
				<div className="space-y-0.5 text-sm text-slate-500 font-normal leading-tight">
					<div><Translate text={localizationConstants.b2bNumberOfQuotes} />: {kpis.events.numberOfQuotes}</div>
					<div>{kpis.events.totalKronor}</div>
				</div>
			),
		},

		quickActions: {
			title: localizationConstants.b2bWidgetQuickActions,
			icon: Focus,
			content: (
				<div className="space-y-0.5 text-sm text-slate-500 font-normal leading-tight">
					<div><Translate text={localizationConstants.number} />: {kpis.quickActions.count}</div>
				</div>
			),
		},
	};
}

export const B2B_SIDEBAR_WIDGET_MAP: Record<string, WidgetProps> = buildB2BWidgetMap(DEFAULT_B2B_KPIS);

export const B2B_WIDGET_ORDER = [
	"kpiStatus",
	"ongoingProjects",
	"upcomingActivities",
	"financialOverview",
	"guaranteeCommitments",
	"events",
	"quickActions",
] as const;

export const B2B_INITIAL_WIDGETS: PlacedWidgetEntry[] = [
	{
		uid: "b2b-kpi-status",
		sidebarId: "kpiStatus",
		colSpanClass: "col-span-12 lg:col-span-4 min-h-[185px]",
		widgetProps: B2B_SIDEBAR_WIDGET_MAP.kpiStatus,
	},
	{
		uid: "b2b-ongoing-projects",
		sidebarId: "ongoingProjects",
		colSpanClass: "col-span-12 lg:col-span-8 min-h-[185px]",
		widgetProps: B2B_SIDEBAR_WIDGET_MAP.ongoingProjects,
	},
	{
		uid: "b2b-upcoming-activities",
		sidebarId: "upcomingActivities",
		colSpanClass: "col-span-12 sm:col-span-6 lg:col-span-4 min-h-[185px]",
		widgetProps: B2B_SIDEBAR_WIDGET_MAP.upcomingActivities,
	},
	{
		uid: "b2b-financial-overview",
		sidebarId: "financialOverview",
		colSpanClass: "col-span-12 sm:col-span-6 lg:col-span-4 min-h-[185px]",
		widgetProps: B2B_SIDEBAR_WIDGET_MAP.financialOverview,
	},
	{
		uid: "b2b-guarantee-commitments",
		sidebarId: "guaranteeCommitments",
		colSpanClass: "col-span-12 sm:col-span-12 lg:col-span-4 min-h-[185px]",
		widgetProps: B2B_SIDEBAR_WIDGET_MAP.guaranteeCommitments,
	},
	{
		uid: "b2b-events",
		sidebarId: "events",
		colSpanClass: "col-span-12 lg:col-span-8 min-h-[185px]",
		widgetProps: B2B_SIDEBAR_WIDGET_MAP.events,
	},
	{
		uid: "b2b-quick-actions",
		sidebarId: "quickActions",
		colSpanClass: "col-span-12 lg:col-span-4 min-h-[185px]",
		widgetProps: B2B_SIDEBAR_WIDGET_MAP.quickActions,
	},
];

export const B2B_DASHBOARD_SIDEBAR_ITEMS: WidgetItem[] = [
	{ id: "kpiStatus", label: localizationConstants.b2bWidgetKpiStatus, icon: Layers },
	{ id: "ongoingProjects", label: localizationConstants.b2bWidgetOngoingProjects, icon: Layers },
	{ id: "upcomingActivities", label: localizationConstants.b2bWidgetUpcomingActivities, icon: Layers },
	{ id: "financialOverview", label: localizationConstants.b2bWidgetFinancialOverview, icon: Layers },
	{ id: "guaranteeCommitments", label: localizationConstants.b2bWidgetGuaranteeCommitments, icon: Layers },
	{ id: "events", label: localizationConstants.b2bWidgetEvents, icon: Layers },
	{ id: "quickActions", label: localizationConstants.b2bWidgetQuickActions, icon: Layers },
];
