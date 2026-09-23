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
export const B2B_SIDEBAR_WIDGET_MAP: Record<string, WidgetProps> = {
	emptyPage: { title: localizationConstants.emptyPageLabel, icon: Folder },
	kpiStatus: { title: localizationConstants.b2bWidgetKpiStatus, icon: Folder },
	ongoingProjects: { title: localizationConstants.b2bWidgetOngoingProjects, icon: Table2 },
	upcomingActivities: { title: localizationConstants.b2bWidgetUpcomingActivities, icon: DollarSign },
	financialOverview: { title: localizationConstants.b2bWidgetFinancialOverview, icon: ShieldCheck },
	guaranteeCommitments: { title: localizationConstants.b2bWidgetGuaranteeCommitments, icon: User },
	events: { title: localizationConstants.b2bWidgetEvents, icon: CircleDollarSign },
	quickActions: { title: localizationConstants.b2bWidgetQuickActions, icon: Focus },
};

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
