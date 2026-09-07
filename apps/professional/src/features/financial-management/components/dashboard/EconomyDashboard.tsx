"use client";

import React, { useMemo, useState } from "react";
import { ModuleWidgetDashboard } from "@/features/widgetdashboard/components/ModuleWidgetDashboard";
import { DashboardRearrangeRail } from "@/features/widgetdashboard/components/rail/DashboardRearrangeRail";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { useEconomyDashboard } from "../../hooks/useEconomyDashboard";
import {
	buildEconomyInitialWidgets,
	buildEconomyWidgetMap,
	ECONOMY_SIDEBAR_ITEMS,
} from "./EconomyDashboardConfig";

export function EconomyDashboard() {
	const t = useTranslate();
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
			rail={({ selectedItem, onSelectItem, placedItemIds }) => (
				<DashboardRearrangeRail
					items={ECONOMY_SIDEBAR_ITEMS}
					selectedItem={selectedItem}
					onSelectItem={onSelectItem}
					placedItemIds={placedItemIds}
					isRearranging={isRearranging}
					onToggleRearrange={() =>
						setIsRearranging((prev) => !prev)
					}
					onSave={() =>
						showToast(
							"success",
							t(localizationConstants.widgetBoardLayoutSaved),
						)
					}
					onDiscard={() => {
						setIsRearranging(false);
						showToast(
							"info",
							t(localizationConstants.widgetRailDiscard),
						);
					}}
				/>
			)}
		/>
	);
}

export default EconomyDashboard;
