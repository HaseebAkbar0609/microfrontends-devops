"use client";

import { useMemo } from "react";

import { ModuleWidgetDashboard } from "@/features/widgetdashboard/components/ModuleWidgetDashboard";
import { DashboardRearrangeRail } from "@/features/widgetdashboard/components/rail/DashboardRearrangeRail";
import localizationConstants from "@/utils/translation/constants";
import {
	FORECAST_ANALYSIS_SOURCE_LOCATION,
	FORECAST_ANALYSIS_STORAGE_KEY,
} from "../../../constants/forecastAnalysis.constants";
import {
	ANALYSIS_SIDEBAR_ITEMS,
	buildAnalysisInitialWidgets,
	buildAnalysisWidgetMap,
	type AnalysisWidgetData,
} from "./AnalysisDashboardConfig";

export interface AnalysisDashboardProps {
	data: AnalysisWidgetData;
	isRearranging: boolean;
	onToggleRearrange: () => void;
}

/**
 * Analys's cards. The rail appears only while rearranging, as the frames draw
 * it — the page keeps the Ordna om button itself — but the engine's rail slot
 * stays mounted either way, so a card dragged onto it is still removed.
 */
export function AnalysisDashboard({ data, isRearranging, onToggleRearrange }: AnalysisDashboardProps) {
	const widgetMap = useMemo(() => buildAnalysisWidgetMap(data), [data]);
	const initialWidgets = useMemo(() => buildAnalysisInitialWidgets(widgetMap), [widgetMap]);

	return (
		<ModuleWidgetDashboard
			sourceLocation={FORECAST_ANALYSIS_SOURCE_LOCATION}
			widgetMap={widgetMap}
			initialWidgets={initialWidgets}
			sidebarItems={ANALYSIS_SIDEBAR_ITEMS}
			storageKey={FORECAST_ANALYSIS_STORAGE_KEY}
			isRearranging={isRearranging}
			rail={({ selectedItem, onSelectItem, placedItemIds, saveLayout, discardLayout }) =>
				isRearranging ? (
					<DashboardRearrangeRail
						items={ANALYSIS_SIDEBAR_ITEMS}
						selectedItem={selectedItem}
						onSelectItem={onSelectItem}
						placedItemIds={placedItemIds}
						isRearranging={isRearranging}
						showToggle={false}
						onToggleRearrange={onToggleRearrange}
						onSave={() => {
							saveLayout?.();
							onToggleRearrange();
						}}
						onDiscard={() => {
							discardLayout?.();
							onToggleRearrange();
						}}
						discardLabel={localizationConstants.forecastRailDiscard}
					/>
				) : null
			}
		/>
	);
}

export default AnalysisDashboard;
