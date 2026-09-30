"use client";

import React, { useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ModuleWidgetDashboard } from "@/features/widgetdashboard/components/ModuleWidgetDashboard";
import { DashboardRearrangeRail } from "@/features/widgetdashboard/components/rail/DashboardRearrangeRail";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { useVehicleDashboard } from "../hooks/useVehicleDashboard";
import { VEHICLE_DASHBOARD_STORAGE_KEY } from "../constants/vehicleDashboard.constants";
import { vehicleDashboardBreadcrumbs } from "../data/vehicleNav.config";
import {
	getVehicleInitialWidgets,
	getVehicleWidgetMap,
	VEHICLE_SIDEBAR_ITEMS,
} from "./VehicleDashboardConfig";
import { VehicleDashboardModals } from "./modals/VehicleDashboardModals";
import type { VehicleServiceItem } from "../types/vehicleDashboard.types";

export const VehicleDashboard: React.FC = () => {
	const t = useTranslate();
	const {
		data,
		isLoading,
		activeModal,
		isRearranging,
		setIsRearranging,
		handleOpenModal,
		handleCloseModal,
		handleAddVehicle,
		handleRegisterService,
		handleAssignKey,
		handleApproveLogbooks,
		refreshData,
	} = useVehicleDashboard();

	const [_selectedService, setSelectedService] =
		useState<VehicleServiceItem | null>(null);

	const widgetMap = useMemo(
		() =>
			getVehicleWidgetMap(
				data,
				{
					onOpenModal: handleOpenModal,
					onSelectService: setSelectedService,
					onApproveLogbooks: handleApproveLogbooks,
					onRefresh: refreshData,
				},
				isLoading,
			),
		[data, handleOpenModal, handleApproveLogbooks, refreshData, isLoading],
	);

	const initialWidgets = useMemo(
		() => getVehicleInitialWidgets(widgetMap),
		[widgetMap],
	);

	return (
		<div className="relative flex flex-1 flex-col min-h-0 bg-blue-gray-50/50">
			{/* Page Header under the Module Tabs Row */}
			<PageHeader
				title={localizationConstants.vehicleDashboardTitle}
				breadcrumbs={vehicleDashboardBreadcrumbs()}
				className="border-b-0 px-6 pt-5 pb-2"
			/>

			{/* Main Widgets Grid & Rearrange Rail */}
			<ModuleWidgetDashboard
				sourceLocation="vehicle_dashboard"
				className="px-6 pb-6 pt-2"
				widgetMap={widgetMap}
				initialWidgets={initialWidgets}
				sidebarItems={VEHICLE_SIDEBAR_ITEMS}
				storageKey={VEHICLE_DASHBOARD_STORAGE_KEY}
				isRearranging={isRearranging}
				cardVariant="muted"
				rail={({
					selectedItem,
					onSelectItem,
					placedItemIds,
					saveLayout,
					discardLayout,
				}) => (
					<DashboardRearrangeRail
						items={VEHICLE_SIDEBAR_ITEMS}
						selectedItem={selectedItem}
						onSelectItem={onSelectItem}
						placedItemIds={placedItemIds}
						isRearranging={isRearranging}
						onToggleRearrange={() =>
							setIsRearranging((previous) => !previous)
						}
						onSave={() => {
							saveLayout?.();
							setIsRearranging(false);
							showToast(
								"success",
								t(localizationConstants.widgetBoardLayoutSaved),
							);
						}}
						onDiscard={() => {
							discardLayout?.();
							setIsRearranging(false);
							showToast(
								"info",
								t(localizationConstants.widgetRailDiscard),
							);
						}}
					/>
				)}
			/>

			{/* Interactive Modals */}
			<VehicleDashboardModals
				activeModal={activeModal}
				data={data}
				onClose={handleCloseModal}
				onAddVehicle={handleAddVehicle}
				onRegisterService={handleRegisterService}
				onAssignKey={handleAssignKey}
				onApproveLogbooks={handleApproveLogbooks}
			/>
		</div>
	);
};

export default VehicleDashboard;
