import { Layers } from "lucide-react";

import type { WidgetItem } from "@/features/widgetdashboard/components/DraggableSidebarItem";
import type { PlacedWidgetEntry, WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import localizationConstants from "@/utils/translation/constants";
import {
	FORECAST_ANALYSIS_KPI_SPAN,
	FORECAST_ANALYSIS_KPI_TITLES,
	type AnalysisKpiId,
} from "../../../constants/forecastAnalysis.constants";
import type { AnalysisKpis } from "../../../types/forecastAnalysis.types";
import { createAnalysisKpiWidgets } from "./widgets/AnalysisKpiWidgets";

/**
 * The frame's grid. The six figure cards come first, across the top; Financial
 * Summary, Project Performance, Forecast Trends and the two risk cards follow
 * in the next branch.
 */
export const ANALYSIS_LAYOUT: { id: AnalysisKpiId; span: string }[] = (
	Object.keys(FORECAST_ANALYSIS_KPI_TITLES) as AnalysisKpiId[]
).map((id) => ({ id, span: FORECAST_ANALYSIS_KPI_SPAN }));

export function buildAnalysisWidgetMap(kpis: AnalysisKpis): Record<string, WidgetProps> {
	return {
		...createAnalysisKpiWidgets(kpis),
		emptyPage: {
			title: localizationConstants.emptyPageLabel,
			icon: Layers,
		},
	};
}

export function buildAnalysisInitialWidgets(widgetMap: Record<string, WidgetProps>): PlacedWidgetEntry[] {
	return ANALYSIS_LAYOUT.map(({ id, span }) => ({
		uid: `analysis-${id}`,
		sidebarId: id,
		colSpanClass: span,
		widgetProps: widgetMap[id],
	}));
}

/** The rail's Meny: the cards in grid order, each with the stack icon the frame draws. */
export const ANALYSIS_SIDEBAR_ITEMS: WidgetItem[] = ANALYSIS_LAYOUT.map(({ id }) => ({
	id,
	label: FORECAST_ANALYSIS_KPI_TITLES[id],
	icon: Layers,
}));
