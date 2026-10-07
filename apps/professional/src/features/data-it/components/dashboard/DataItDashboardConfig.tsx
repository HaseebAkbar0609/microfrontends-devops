import React from "react";
import {
	Folder,
	LayoutGrid,
	Clock,
	ShoppingCart,
	User,
	Zap,
	ShieldCheck,
	Server,
	Layers,
} from "lucide-react";

import { WidgetItem } from "@/features/widgetdashboard/components/DraggableSidebarItem";
import {
	PlacedWidgetEntry,
	WidgetProps,
} from "@/features/widgetdashboard/types/dashboard";
import localizationConstants from "@/utils/translation/constants";
import type { DataItDashboardState } from "../../types/dataIt.types";
import { KpiDataItWidget } from "../widgets/KpiDataItWidget";
import { DevicesByCategoryWidget } from "../widgets/DevicesByCategoryWidget";
import { WarrantyExpiryWidget } from "../widgets/WarrantyExpiryWidget";
import { UpcomingPurchasesWidget } from "../widgets/UpcomingPurchasesWidget";
import { ActiveSupportWidget } from "../widgets/ActiveSupportWidget";
import { QuickActionsWidget } from "../widgets/QuickActionsWidget";
import { SecurityStatusWidget } from "../widgets/SecurityStatusWidget";
import { SystemStatusWidget } from "../widgets/SystemStatusWidget";

export const DATA_IT_SIDEBAR_ITEMS: WidgetItem[] = [
	{
		id: "emptyPage",
		label: localizationConstants.emptyPageLabel,
		icon: Layers,
	},
	{
		id: "kpi",
		label: localizationConstants.wDataItKpiTitle,
		icon: Folder,
	},
	{
		id: "categories",
		label: localizationConstants.wDataItDevicesByCategoryTitle,
		icon: LayoutGrid,
	},
	{
		id: "warranty",
		label: localizationConstants.wDataItWarrantyExpiryTitle,
		icon: Clock,
	},
	{
		id: "purchases",
		label: localizationConstants.wDataItUpcomingPurchasesTitle,
		icon: ShoppingCart,
	},
	{
		id: "support",
		label: localizationConstants.wDataItActiveSupportTitle,
		icon: User,
	},
	{
		id: "actions",
		label: localizationConstants.wDataItQuickActionsTitle,
		icon: Zap,
	},
	{
		id: "security",
		label: localizationConstants.wDataItSecurityStatusTitle,
		icon: ShieldCheck,
	},
	{
		id: "system",
		label: localizationConstants.wDataItSystemStatusTitle,
		icon: Server,
	},
];

export function buildDataItWidgetMap(
	state: DataItDashboardState,
): Record<string, WidgetProps> {
	return {
		emptyPage: {
			title: localizationConstants.emptyPageLabel,
			icon: Layers,
		},
		kpi: {
			title: localizationConstants.wDataItKpiTitle,
			icon: Folder,
			content: <KpiDataItWidget kpi={state.kpi} />,
			expandedContent: <KpiDataItWidget kpi={state.kpi} />,
		},
		categories: {
			title: localizationConstants.wDataItDevicesByCategoryTitle,
			icon: LayoutGrid,
			content: <DevicesByCategoryWidget categories={state.categories} />,
			expandedContent: <DevicesByCategoryWidget categories={state.categories} />,
		},
		warranty: {
			title: localizationConstants.wDataItWarrantyExpiryTitle,
			icon: Clock,
			content: <WarrantyExpiryWidget devices={state.warrantyDevices} />,
			expandedContent: <WarrantyExpiryWidget devices={state.warrantyDevices} />,
		},
		purchases: {
			title: localizationConstants.wDataItUpcomingPurchasesTitle,
			icon: ShoppingCart,
			content: <UpcomingPurchasesWidget purchases={state.upcomingPurchases} />,
			expandedContent: <UpcomingPurchasesWidget purchases={state.upcomingPurchases} />,
		},
		support: {
			title: localizationConstants.wDataItActiveSupportTitle,
			icon: User,
			content: <ActiveSupportWidget tickets={state.supportTickets} />,
			expandedContent: <ActiveSupportWidget tickets={state.supportTickets} />,
		},
		actions: {
			title: localizationConstants.wDataItQuickActionsTitle,
			icon: Zap,
			content: <QuickActionsWidget />,
			expandedContent: <QuickActionsWidget />,
		},
		security: {
			title: localizationConstants.wDataItSecurityStatusTitle,
			icon: ShieldCheck,
			content: <SecurityStatusWidget items={state.securityItems} />,
			expandedContent: <SecurityStatusWidget items={state.securityItems} />,
		},
		system: {
			title: localizationConstants.wDataItSystemStatusTitle,
			icon: Server,
			content: <SystemStatusWidget items={state.systemStatusItems} />,
			expandedContent: <SystemStatusWidget items={state.systemStatusItems} />,
		},
	};
}


export function buildDataItInitialWidgets(
	widgetMap: Record<string, WidgetProps>,
): PlacedWidgetEntry[] {
	return [
		{
			uid: "data-it-kpi",
			sidebarId: "kpi",
			colSpanClass: "col-span-12 lg:col-span-6",
			widgetProps: widgetMap.kpi,
		},
		{
			uid: "data-it-categories",
			sidebarId: "categories",
			colSpanClass: "col-span-12 lg:col-span-6",
			widgetProps: widgetMap.categories,
		},
		{
			uid: "data-it-warranty",
			sidebarId: "warranty",
			colSpanClass: "col-span-12 sm:col-span-6 lg:col-span-4",
			widgetProps: widgetMap.warranty,
		},
		{
			uid: "data-it-purchases",
			sidebarId: "purchases",
			colSpanClass: "col-span-12 sm:col-span-6 lg:col-span-4",
			widgetProps: widgetMap.purchases,
		},
		{
			uid: "data-it-support",
			sidebarId: "support",
			colSpanClass: "col-span-12 sm:col-span-6 lg:col-span-4",
			widgetProps: widgetMap.support,
		},
		{
			uid: "data-it-actions",
			sidebarId: "actions",
			colSpanClass: "col-span-12",
			widgetProps: widgetMap.actions,
		},
	];
}
