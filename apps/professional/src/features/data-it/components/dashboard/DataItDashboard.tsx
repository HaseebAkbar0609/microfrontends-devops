"use client";

import React, { useMemo } from "react";
import { ModuleWidgetDashboard } from "@/features/widgetdashboard/components/ModuleWidgetDashboard";
import { DashboardRearrangeRail } from "@/features/widgetdashboard/components/rail/DashboardRearrangeRail";
import localizationConstants from "@/utils/translation/constants";
import { useDataItDashboard } from "../../hooks/useDataItDashboard";
import {
	buildDataItInitialWidgets,
	buildDataItWidgetMap,
	DATA_IT_SIDEBAR_ITEMS,
} from "./DataItDashboardConfig";
import {
	DATA_IT_DASHBOARD_STORAGE_KEY,
	DATA_IT_SOURCE_LOCATION,
} from "../../constants/dataItDashboard.constants";

export function DataItDashboard() {
	const { state, isRearranging, setIsRearranging, handleRefresh } =
		useDataItDashboard();

	const widgetMap = useMemo(
		() => buildDataItWidgetMap(state, handleRefresh),
		[state, handleRefresh],
	);

	const initialWidgets = useMemo(
		() => buildDataItInitialWidgets(widgetMap),
		[widgetMap],
	);

	return (
		<ModuleWidgetDashboard
			sourceLocation={DATA_IT_SOURCE_LOCATION}
			widgetMap={widgetMap}
			initialWidgets={initialWidgets}
			sidebarItems={DATA_IT_SIDEBAR_ITEMS}
			storageKey={DATA_IT_DASHBOARD_STORAGE_KEY}
			cardVariant="default"
			isRearranging={isRearranging}
			rail={({
				selectedItem,
				onSelectItem,
				placedItemIds,
				saveLayout,
				discardLayout,
			}) => (
				<DashboardRearrangeRail
					items={DATA_IT_SIDEBAR_ITEMS}
					selectedItem={selectedItem}
					onSelectItem={onSelectItem}
					placedItemIds={placedItemIds}
					isRearranging={isRearranging}
					showToggle={true}
					discardLabel={localizationConstants.dataItDiscard}
					onToggleRearrange={() => setIsRearranging((prev) => !prev)}
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

export default DataItDashboard;
