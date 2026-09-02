import { Layers } from "lucide-react";
import { BreadcrumbItem } from "@/types/common";
import type { ModuleTabItem } from "@/components/layout/navigation";
import { RouteTabItem } from "@/types/navigation";
import { WidgetItem } from "@/features/widgetdashboard/components/DraggableSidebarItem";
import localizationConstants from "@/utils/translation/constants";

export const B2B_DASHBOARD_BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.home, href: "/home" },
	{ label: localizationConstants.businessCategory, href: "/module/business" },
	{ label: localizationConstants.b2b, href: "/module/business/b2b" },
	{ label: localizationConstants.b2bDashboard },
];

export const B2B_ARCHIVE_BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.home, href: "/home" },
	{ label: localizationConstants.moduleItem, href: "/module" },
	{ label: localizationConstants.businessCategory, href: "/module/business" },
	{ label: localizationConstants.b2b, href: "/module/business/b2b" },
	{ label: localizationConstants.archive },
];

export const B2B_MODULE_TABS: ModuleTabItem[] = [
	{
		id: "b2b-dashboard",
		label: "B2B Dashboard",
		labelKey: localizationConstants.b2bDashboard,
		href: "/module/business/b2b",
		exact: true,
	},
	{
		id: "b2b-overview",
		label: "B2B Overview",
		labelKey: localizationConstants.b2bOverview,
		href: "/module/business/b2b/overview",
	},
	{
		id: "b2b-archive",
		label: "Archive",
		labelKey: localizationConstants.archive,
		href: "/module/business/b2b/archive",
	},
];

export const b2bNavItems: RouteTabItem[] = [
	{
		id: "dashboard",
		labelKey: localizationConstants.b2bDashboard,
		href: "/module/business/b2b",
		exact: true,
	},
	{
		id: "overview",
		labelKey: localizationConstants.b2bOverview,
		href: "/module/business/b2b/project-market",
		matchSubPaths: [
			"/module/business/b2b/overview",
			"/module/business/b2b/project-market",
			"/module/business/b2b/agreements",
		],
	},
	{
		id: "archive",
		labelKey: localizationConstants.archive,
		href: "/module/business/b2b/archive",
	},
];

export const b2bSidebarItems = b2bNavItems;

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
