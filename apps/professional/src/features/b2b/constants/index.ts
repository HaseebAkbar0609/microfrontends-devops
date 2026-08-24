import {
	Archive,
	FileText,
	Handshake,
	Layers,
	ScrollText,
	Store,
} from "lucide-react";
import { BreadcrumbItem } from "@/types/common";
import { DynamicSubSidebarItem } from "@/components/layout/sidebar/DynamicSubSidebar";
import { WidgetItem } from "@/features/widgetdashboard/components/DraggableSidebarItem";
import localizationConstants from "@/utils/translation/constants";

export const B2B_DASHBOARD_BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.home, href: "/home" },
	{ label: localizationConstants.businessCategory, href: "/module/business" },
	{ label: localizationConstants.b2b, href: "/module/business/b2b" },
	{ label: localizationConstants.b2bDashboard },
];

export const b2bSidebarItems: DynamicSubSidebarItem[] = [
	{
		id: "overview",
		labelKey: localizationConstants.b2bOverview,
		href: "/module/business/b2b",
		icon: FileText,
		exact: true,
	},
	{
		id: "project-market",
		labelKey: localizationConstants.b2bProjectMarket,
		href: "/module/business/b2b/project-market",
		icon: Store,
	},
	{
		id: "deals",
		labelKey: localizationConstants.b2bDeals,
		href: "/module/business/b2b/deals",
		icon: Handshake,
	},
	{
		id: "avtal",
		labelKey: localizationConstants.b2bAvtal,
		href: "/module/business/b2b/agreements",
		icon: ScrollText,
	},
	{
		id: "archive",
		labelKey: localizationConstants.archive,
		href: "/module/business/b2b/archive",
		icon: Archive,
	},
];

/** Same 11 widgets as the B2B grid, in ticket order (plus the empty slot). */
export const B2B_SIDEBAR_ITEMS: WidgetItem[] = [
	{
		id: "emptyPage",
		label: localizationConstants.emptyPageLabel,
		icon: Layers,
	},
	{
		id: "kpiStatus",
		label: localizationConstants.b2bWidgetKpiStatus,
		icon: Layers,
	},
	{
		id: "ongoingProjects",
		label: localizationConstants.b2bWidgetOngoingProjects,
		icon: Layers,
	},
	{
		id: "upcomingActivities",
		label: localizationConstants.b2bWidgetUpcomingActivities,
		icon: Layers,
	},
	{
		id: "financialOverview",
		label: localizationConstants.b2bWidgetFinancialOverview,
		icon: Layers,
	},
	{
		id: "guaranteeCommitments",
		label: localizationConstants.b2bWidgetGuaranteeCommitments,
		icon: Layers,
	},
	{
		id: "events",
		label: localizationConstants.b2bWidgetEvents,
		icon: Layers,
	},
	{
		id: "quickActions",
		label: localizationConstants.b2bWidgetQuickActions,
		icon: Layers,
	},
];
