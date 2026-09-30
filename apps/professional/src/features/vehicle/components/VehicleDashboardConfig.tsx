import React from "react";
import {
	Folder,
	Table2,
	ShieldCheck,
	Focus,
	Layers,
} from "lucide-react";
import { WidgetItem } from "@/features/widgetdashboard/components/DraggableSidebarItem";
import {
	PlacedWidgetEntry,
	WidgetProps,
} from "@/features/widgetdashboard/types/dashboard";
import localizationConstants from "@/utils/translation/constants";
import type {
	VehicleDashboardData,
	VehicleModalType,
	VehicleServiceItem,
} from "../types/vehicleDashboard.types";
import {
	VEHICLE_WIDGET_COL_SPAN,
	VEHICLE_WIDGET_ORDER,
	VEHICLE_WIDGET_SPANS,
	type VehicleWidgetId,
} from "../constants/vehicleDashboard.constants";
import { VehicleKpiWidgetContent } from "./widgets/VehicleKpiWidget";
import { VehicleServiceWidgetContent } from "./widgets/VehicleServiceWidget";
import { VehicleDriveWidgetContent } from "./widgets/VehicleDriveWidget";
import { VehicleQuickActionsWidgetContent } from "./widgets/VehicleQuickActionsWidget";

export function getVehicleWidgetMap(
	data: VehicleDashboardData,
	handlers: {
		onOpenModal: (type: VehicleModalType) => void;
		onSelectService: (service: VehicleServiceItem) => void;
		onApproveLogbooks: () => void;
		onRefresh: () => void;
	},
	isLoading = false,
): Record<string, WidgetProps> {
	return {
		emptyPage: {
			title: localizationConstants.emptyPageLabel,
			icon: Layers,
		},
		vehicleKpiOverview: {
			title: localizationConstants.vehicleKpiOverviewTitle,
			icon: Folder,
			isLoading,
			content: (
				<VehicleKpiWidgetContent
					data={data.kpis}
					onDrillDown={() => handlers.onOpenModal("kpi_details")}
				/>
			),
			onRefresh: handlers.onRefresh,
		},
		vehicleUpcomingService: {
			title: localizationConstants.vehicleUpcomingServiceTitle,
			icon: Table2,
			isLoading,
			content: (
				<VehicleServiceWidgetContent
					services={data.services}
					maxItems={3}
					onSelectService={(service) => {
						handlers.onSelectService(service);
						handlers.onOpenModal("service_details");
					}}
				/>
			),
			onRefresh: handlers.onRefresh,
		},
		vehicleDriveOverview: {
			title: localizationConstants.vehicleDriveOverviewTitle,
			icon: ShieldCheck,
			isLoading,
			content: (
				<VehicleDriveWidgetContent
					data={data.drive}
					onOpenMap={() => handlers.onOpenModal("vehicle_map")}
					onApproveLogbooks={handlers.onApproveLogbooks}
				/>
			),
			onRefresh: handlers.onRefresh,
		},
		vehicleQuickActions: {
			title: localizationConstants.vehicleQuickActionsTitle,
			icon: Focus,
			isLoading,
			content: <VehicleQuickActionsWidgetContent />,
			onRefresh: handlers.onRefresh,
		},
	};
}

export function getVehicleInitialWidgets(
	widgetMap: Record<string, WidgetProps>,
): PlacedWidgetEntry[] {
	return VEHICLE_WIDGET_ORDER.map((id: VehicleWidgetId) => ({
		uid: `vehicle-${id}`,
		sidebarId: id,
		colSpanClass: VEHICLE_WIDGET_SPANS[id] || VEHICLE_WIDGET_COL_SPAN,
		widgetProps: widgetMap[id],
	}));
}

export const VEHICLE_SIDEBAR_ITEMS: WidgetItem[] = [
	{
		id: "emptyPage",
		label: localizationConstants.emptyPageLabel,
		icon: Layers,
	},
	{
		id: "vehicleKpiOverview",
		label: localizationConstants.vehicleKpiOverviewTitle,
		icon: Layers,
	},
	{
		id: "vehicleUpcomingService",
		label: localizationConstants.vehicleUpcomingServiceTop5Title,
		icon: Layers,
	},
	{
		id: "vehicleDriveOverview",
		label: localizationConstants.vehicleDriveOverviewTitle,
		icon: Layers,
	},
	{
		id: "vehicleQuickActions",
		label: localizationConstants.vehicleQuickActionsTitle,
		icon: Layers,
	},
];
