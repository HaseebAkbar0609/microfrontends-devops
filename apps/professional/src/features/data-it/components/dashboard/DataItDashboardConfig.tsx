import React from "react";
import {
	Folder,
	LayoutGrid,
	Coins,
	Shield,
	User,
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
		icon: Coins,
	},
	{
		id: "purchases",
		label: localizationConstants.wDataItUpcomingPurchasesTitle,
		icon: Shield,
	},
	{
		id: "support",
		label: localizationConstants.wDataItActiveSupportTitle,
		icon: User,
	},
	{
		id: "actions",
		label: localizationConstants.wDataItQuickActionsTitle,
		icon: Coins,
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
	onRefresh?: () => Promise<void>,
): Record<string, WidgetProps> {
	return {
		emptyPage: {
			title: localizationConstants.emptyPageLabel,
			icon: Layers,
			variant: "muted",
		},
		kpi: {
			title: localizationConstants.wDataItKpiTitle,
			icon: Folder,
			variant: "muted",
			content: <KpiDataItWidget kpi={state.kpi} />,
			expandedContent: <KpiDataItWidget kpi={state.kpi} />,
			onRefresh,
		},
		categories: {
			title: localizationConstants.wDataItDevicesByCategoryTitle,
			icon: LayoutGrid,
			variant: "muted",
			content: <DevicesByCategoryWidget categories={state.categories} />,
			expandedContent: <DevicesByCategoryWidget categories={state.categories} />,
			onRefresh,
		},
		warranty: {
			title: localizationConstants.wDataItWarrantyExpiryTitle,
			icon: Coins,
			variant: "muted",
			content: <WarrantyExpiryWidget devices={state.warrantyDevices} />,
			expandedContent: <WarrantyExpiryWidget devices={state.warrantyDevices} />,
			emptyTitle: localizationConstants.dataItEmptyWarrantyTitle,
			emptyDescription: localizationConstants.dataItEmptyWarrantyDesc,
			isEmpty: state.warrantyDevices.length === 0,
			onRefresh,
		},
		purchases: {
			title: localizationConstants.wDataItUpcomingPurchasesTitle,
			icon: Shield,
			variant: "muted",
			content: <UpcomingPurchasesWidget purchases={state.upcomingPurchases} />,
			expandedContent: <UpcomingPurchasesWidget purchases={state.upcomingPurchases} />,
			onRefresh,
		},
		support: {
			title: localizationConstants.wDataItActiveSupportTitle,
			icon: User,
			variant: "muted",
			content: <ActiveSupportWidget tickets={state.supportTickets} />,
			expandedContent: <ActiveSupportWidget tickets={state.supportTickets} />,
			emptyTitle: localizationConstants.dataItEmptySupportTitle,
			emptyDescription: localizationConstants.dataItEmptySupportDesc,
			isEmpty: state.supportTickets.length === 0,
			onRefresh,
		},
		actions: {
			title: localizationConstants.wDataItQuickActionsTitle,
			icon: Coins,
			variant: "muted",
			content: <QuickActionsWidget />,
			expandedContent: <QuickActionsWidget />,
			onRefresh,
		},
		security: {
			title: localizationConstants.wDataItSecurityStatusTitle,
			icon: ShieldCheck,
			variant: "muted",
			content: <SecurityStatusWidget />,
			expandedContent: <SecurityStatusWidget />,
			onRefresh,
		},
		system: {
			title: localizationConstants.wDataItSystemStatusTitle,
			icon: Server,
			variant: "muted",
			content: <SystemStatusWidget />,
			expandedContent: <SystemStatusWidget />,
			onRefresh,
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
