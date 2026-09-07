"use client";

import React, { useMemo, useState } from "react";
import { ModuleWidgetDashboard } from "@/features/widgetdashboard/components/ModuleWidgetDashboard";
import { DashboardRearrangeRail } from "@/features/widgetdashboard/components/rail/DashboardRearrangeRail";
import { useEconomyDashboard } from "../../hooks/useEconomyDashboard";
import {
	buildEconomyInitialWidgets,
	buildEconomyWidgetMap,
	ECONOMY_SIDEBAR_ITEMS,
} from "./EconomyDashboardConfig";
import { ECONOMY_DASHBOARD_STORAGE_KEY } from "../../constants/economyDashboard.constants";

export function EconomyDashboard() {
	const { state, activeAiQuestion, handleSelectAiQuestion } = useEconomyDashboard();
	const [isRearranging, setIsRearranging] = useState(false);

	const widgetMap = useMemo(
		() =>
			buildEconomyWidgetMap(state, {
				activeAiQuestion,
				onSelectAiQuestion: handleSelectAiQuestion,
			}),
		[state, activeAiQuestion, handleSelectAiQuestion],
	);

	const initialWidgets = useMemo(
		() => buildEconomyInitialWidgets(widgetMap),
		[widgetMap],
	);

	return (
		<ModuleWidgetDashboard
			widgetMap={widgetMap}
			initialWidgets={initialWidgets}
			sidebarItems={ECONOMY_SIDEBAR_ITEMS}
			storageKey={ECONOMY_DASHBOARD_STORAGE_KEY}
			isRearranging={isRearranging}
			rail={({ selectedItem, onSelectItem, placedItemIds, saveLayout, discardLayout }) => (
				<DashboardRearrangeRail
					items={ECONOMY_SIDEBAR_ITEMS}
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

export default EconomyDashboard;
