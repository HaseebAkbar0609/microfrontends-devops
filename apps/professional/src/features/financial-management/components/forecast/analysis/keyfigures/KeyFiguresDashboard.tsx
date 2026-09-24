"use client";

import { useMemo } from "react";

import { ModuleWidgetDashboard } from "@/features/widgetdashboard/components/ModuleWidgetDashboard";
import { DashboardRearrangeRail } from "@/features/widgetdashboard/components/rail/DashboardRearrangeRail";
import localizationConstants from "@/utils/translation/constants";
import {
	FORECAST_KEY_FIGURES_SOURCE_LOCATION,
	FORECAST_KEY_FIGURES_STORAGE_KEY,
} from "../../../../constants/forecastAnalysis.constants";
import {
	buildKeyFiguresInitialWidgets,
	buildKeyFiguresWidgetMap,
	KEY_FIGURES_SIDEBAR_ITEMS,
	type KeyFiguresWidgetData,
} from "./KeyFiguresDashboardConfig";

export interface KeyFiguresDashboardProps {
	data: KeyFiguresWidgetData;
	isRearranging: boolean;
	onToggleRearrange: () => void;
}

/**
 * Nyckeltal's cards: its own board beside Analys's, with its own layout and its
 * own data source, reading the same selection so both tabs agree.
 */
export function KeyFiguresDashboard({ data, isRearranging, onToggleRearrange }: KeyFiguresDashboardProps) {
	const widgetMap = useMemo(() => buildKeyFiguresWidgetMap(data), [data]);
	const initialWidgets = useMemo(() => buildKeyFiguresInitialWidgets(widgetMap), [widgetMap]);

	return (
		<ModuleWidgetDashboard
			sourceLocation={FORECAST_KEY_FIGURES_SOURCE_LOCATION}
			widgetMap={widgetMap}
			initialWidgets={initialWidgets}
			sidebarItems={KEY_FIGURES_SIDEBAR_ITEMS}
			storageKey={FORECAST_KEY_FIGURES_STORAGE_KEY}
			isRearranging={isRearranging}
			rail={({ selectedItem, onSelectItem, placedItemIds, saveLayout, discardLayout }) =>
				isRearranging ? (
					<DashboardRearrangeRail
						items={KEY_FIGURES_SIDEBAR_ITEMS}
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

export default KeyFiguresDashboard;
