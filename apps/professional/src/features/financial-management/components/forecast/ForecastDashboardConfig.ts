import { Layers } from "lucide-react";

import type { WidgetItem } from "@/features/widgetdashboard/components/DraggableSidebarItem";
import type { PlacedWidgetEntry, WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import localizationConstants from "@/utils/translation/constants";
import {
	FORECAST_FULL_SPAN,
	FORECAST_HALF_SPAN,
	FORECAST_WIDGET_TITLES,
	type ForecastWidgetId,
} from "../../constants/forecastDashboard.constants";
import type { ForecastDashboardState } from "../../types/forecastDashboard.types";
import { createForecastActionsWidget } from "./widgets/ForecastActionsWidget";
import { createForecastCapacityWidgets } from "./widgets/ForecastCapacityWidgets";
import { createForecastProjectWidgets } from "./widgets/ForecastProjectWidgets";

/**
 * The frame's grid: two halves, a full row, two halves, a full row. A width
 * belongs to its slot, not its widget, so a swapped widget takes the width of
 * the slot it lands in.
 */
export const FORECAST_LAYOUT: { id: ForecastWidgetId; span: string }[] = [
	{ id: "kpiOverview", span: FORECAST_HALF_SPAN },
	{ id: "projectOrderForecasts", span: FORECAST_HALF_SPAN },
	{ id: "actionsWarnings", span: FORECAST_FULL_SPAN },
	{ id: "occupancy", span: FORECAST_HALF_SPAN },
	{ id: "availableHours", span: FORECAST_HALF_SPAN },
	{ id: "projectStatus", span: FORECAST_FULL_SPAN },
];

export function buildForecastWidgetMap(state: ForecastDashboardState): Record<string, WidgetProps> {
	return {
		...createForecastCapacityWidgets(state),
		...createForecastProjectWidgets(state),
		...createForecastActionsWidget(state),
		emptyPage: {
			title: localizationConstants.emptyPageLabel,
			icon: Layers,
		},
	};
}

export function buildForecastInitialWidgets(widgetMap: Record<string, WidgetProps>): PlacedWidgetEntry[] {
	return FORECAST_LAYOUT.map(({ id, span }) => ({
		uid: `forecast-${id}`,
		sidebarId: id,
		colSpanClass: span,
		widgetProps: widgetMap[id],
	}));
}

/** The rail's Meny: the six widgets in grid order, each with the stack icon the frame draws. */
export const FORECAST_SIDEBAR_ITEMS: WidgetItem[] = FORECAST_LAYOUT.map(({ id }) => ({
	id,
	label: FORECAST_WIDGET_TITLES[id],
	icon: Layers,
}));
