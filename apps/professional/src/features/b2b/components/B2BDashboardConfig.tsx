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
import { B2BDashboardKpis, EMPTY_B2B_KPIS } from "@/api-actions/b2b/b2b";

export function KpiStatusWidgetContent({ kpiStatus }: { kpiStatus: B2BDashboardKpis["kpiStatus"] }) {
	return (
		<div className="space-y-0.5 text-sm text-slate-500 font-normal leading-tight">
			<div><Translate text={localizationConstants.activeProjects} />: {kpiStatus.activeProjects}</div>
			<div><Translate text={localizationConstants.b2bOngoingBilling} />: {kpiStatus.ongoingBilling}</div>
			<div><Translate text={localizationConstants.b2bDelayedMilestones} />: {kpiStatus.delayedMilestones}</div>
		</div>
	);
}

export function OngoingProjectsWidgetContent({ projects }: { projects: B2BDashboardKpis["ongoingProjects"] }) {
	return (
		<div className="space-y-0.5 text-sm text-slate-500 font-normal leading-tight">
			{projects.length === 0 ? (
				<div>-</div>
			) : (
				projects.map((p) => <div key={p.id}>{p.name}</div>)
			)}
		</div>
	);
}

export function UpcomingActivitiesWidgetContent({ activities }: { activities: B2BDashboardKpis["upcomingActivities"] }) {
	return (
		<div className="space-y-0.5 text-sm text-slate-500 font-normal leading-tight">
			{activities.length === 0 ? (
				<div>-</div>
			) : (
				activities.map((a) => <div key={a.id}>{a.title}</div>)
			)}
		</div>
	);
}

export function FinancialOverviewWidgetContent({ financial }: { financial: B2BDashboardKpis["financialOverview"] }) {
	return (
		<div className="space-y-0.5 text-sm text-slate-500 font-normal leading-tight">
			<div><Translate text={localizationConstants.activeProjects} />: {financial.activeProjects}</div>
			<div><Translate text={localizationConstants.activeOrders} />: {financial.activeOrders}</div>
			<div><Translate text={localizationConstants.completedChecks} />: {financial.completedChecks}</div>
		</div>
	);
}

export function GuaranteeCommitmentsWidgetContent({ guarantee }: { guarantee: B2BDashboardKpis["guaranteeCommitments"] }) {
	return (
		<div className="space-y-0.5 text-sm text-slate-500 font-normal leading-tight">
			<div>{guarantee.guaranteedPointsOpen} <Translate text={localizationConstants.guaranteedPointsOpen} /></div>
			<div>{guarantee.jobsInPlanningPhase} <Translate text={localizationConstants.jobsInPlanningPhase} /></div>
			<div>{guarantee.awaitingCustomerResponse} <Translate text={localizationConstants.awaitingCustomerResponse} /></div>
		</div>
	);
}

export function EventsWidgetContent({ events }: { events: B2BDashboardKpis["events"] }) {
	return (
		<div className="space-y-0.5 text-sm text-slate-500 font-normal leading-tight">
			<div><Translate text={localizationConstants.b2bNumberOfQuotes} />: {events.numberOfQuotes}</div>
			<div>{events.totalKronor}</div>
		</div>
	);
}

export function QuickActionsWidgetContent({ quickActions }: { quickActions: B2BDashboardKpis["quickActions"] }) {
	return (
		<div className="space-y-0.5 text-sm text-slate-500 font-normal leading-tight">
			<div><Translate text={localizationConstants.number} />: {quickActions.count}</div>
		</div>
	);
}

export function buildB2BWidgetMap(kpis: B2BDashboardKpis = EMPTY_B2B_KPIS): Record<string, WidgetProps> {
	return {
		emptyPage: { title: localizationConstants.emptyPageLabel, icon: Folder },
		kpiStatus: {
			title: localizationConstants.b2bWidgetKpiStatus,
			icon: Folder,
			content: <KpiStatusWidgetContent kpiStatus={kpis.kpiStatus} />,
		},
		ongoingProjects: {
			title: localizationConstants.b2bWidgetOngoingProjects,
			icon: Table2,
			content: <OngoingProjectsWidgetContent projects={kpis.ongoingProjects} />,
		},
		upcomingActivities: {
			title: localizationConstants.b2bWidgetUpcomingActivities,
			icon: DollarSign,
			content: <UpcomingActivitiesWidgetContent activities={kpis.upcomingActivities} />,
		},
		financialOverview: {
			title: localizationConstants.b2bWidgetFinancialOverview,
			icon: ShieldCheck,
			content: <FinancialOverviewWidgetContent financial={kpis.financialOverview} />,
		},
		guaranteeCommitments: {
			title: localizationConstants.b2bWidgetGuaranteeCommitments,
			icon: User,
			content: <GuaranteeCommitmentsWidgetContent guarantee={kpis.guaranteeCommitments} />,
		},
		events: {
			title: localizationConstants.b2bWidgetEvents,
			icon: CircleDollarSign,
			content: <EventsWidgetContent events={kpis.events} />,
		},
		quickActions: {
			title: localizationConstants.b2bWidgetQuickActions,
			icon: Focus,
			content: <QuickActionsWidgetContent quickActions={kpis.quickActions} />,
		},
	};
}

export const B2B_SIDEBAR_WIDGET_MAP: Record<string, WidgetProps> = buildB2BWidgetMap(EMPTY_B2B_KPIS);

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
