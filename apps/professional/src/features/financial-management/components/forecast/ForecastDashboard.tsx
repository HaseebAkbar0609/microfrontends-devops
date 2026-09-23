"use client";

import { useMemo } from "react";

import { DashboardRearrangeRail } from "@/features/widgetdashboard/components/rail/DashboardRearrangeRail";
import { ModuleWidgetDashboard } from "@/features/widgetdashboard/components/ModuleWidgetDashboard";
import localizationConstants from "@/utils/translation/constants";
import { FORECAST_DASHBOARD_STORAGE_KEY } from "../../constants/forecastDashboard.constants";
import { useForecastDashboard } from "../../hooks/useForecastDashboard";
import {
	buildForecastInitialWidgets,
	buildForecastWidgetMap,
	FORECAST_SIDEBAR_ITEMS,
} from "./ForecastDashboardConfig";

/**
 * The Prognos dashboard: the frame's grey cards on the shared widget grid,
 * with the Ordna om rail beside it. Spara keeps the arrangement in this
 * browser and Kasta bort returns to the last one kept; both leave rearranging.
 */
export function ForecastDashboard() {
	const { state, isRearranging, setIsRearranging } = useForecastDashboard();
	const widgetMap = useMemo(() => buildForecastWidgetMap(state), [state]);
	const initialWidgets = useMemo(() => buildForecastInitialWidgets(widgetMap), [widgetMap]);

	return (
		<ModuleWidgetDashboard
			widgetMap={widgetMap}
			initialWidgets={initialWidgets}
			sidebarItems={FORECAST_SIDEBAR_ITEMS}
			storageKey={FORECAST_DASHBOARD_STORAGE_KEY}
			isRearranging={isRearranging}
			cardVariant="muted"
			rail={({ selectedItem, onSelectItem, placedItemIds, saveLayout, discardLayout }) => (
				<DashboardRearrangeRail
					items={FORECAST_SIDEBAR_ITEMS}
					selectedItem={selectedItem}
					onSelectItem={onSelectItem}
					placedItemIds={placedItemIds}
					isRearranging={isRearranging}
					onToggleRearrange={() => setIsRearranging((prev) => !prev)}
					onSave={() => {
						saveLayout?.();
						setIsRearranging(false);
					}}
					onDiscard={() => {
						discardLayout?.();
						setIsRearranging(false);
					}}
					discardLabel={localizationConstants.forecastRailDiscard}
				/>
			)}
		/>
	);
}

export default ForecastDashboard;
