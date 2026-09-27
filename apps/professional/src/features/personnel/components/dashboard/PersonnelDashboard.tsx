"use client";

import React, { useMemo } from "react";
import { ModuleWidgetDashboard } from "@/features/widgetdashboard/components/ModuleWidgetDashboard";
import { DashboardRearrangeRail } from "@/features/widgetdashboard/components/rail/DashboardRearrangeRail";
import { usePersonnelDashboard } from "../../hooks/usePersonnelDashboard";
import {
	buildPersonnelInitialWidgets,
	buildPersonnelWidgetMap,
	PERSONNEL_SIDEBAR_ITEMS,
} from "./PersonnelDashboardConfig";
import { PERSONNEL_DASHBOARD_STORAGE_KEY } from "../../constants/personnelDashboard.constants";

export function PersonnelDashboard() {
	const { state, isRearranging, setIsRearranging } = usePersonnelDashboard();

	const widgetMap = useMemo(
		() => buildPersonnelWidgetMap(state),
		[state],
	);

	const initialWidgets = useMemo(
		() => buildPersonnelInitialWidgets(widgetMap),
		[widgetMap],
	);

	return (
		<ModuleWidgetDashboard
			sourceLocation="personnel_dashboard"
			widgetMap={widgetMap}
			initialWidgets={initialWidgets}
			sidebarItems={PERSONNEL_SIDEBAR_ITEMS}
			storageKey={PERSONNEL_DASHBOARD_STORAGE_KEY}
			isRearranging={isRearranging}
			rail={({ selectedItem, onSelectItem, placedItemIds, saveLayout, discardLayout }) => (
				<DashboardRearrangeRail
					items={PERSONNEL_SIDEBAR_ITEMS}
					selectedItem={selectedItem}
					onSelectItem={onSelectItem}
					placedItemIds={placedItemIds}
					isRearranging={isRearranging}
					onToggleRearrange={() =>
						setIsRearranging((prev) => !prev)
					}
					onSave={() => {
						saveLayout?.();
						setIsRearranging(false);
					}}
					onDiscard={() => {
						discardLayout?.();
						setIsRearranging(false);
					}}
				/>
			)}
		/>
	);
}
