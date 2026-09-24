import { Layers } from "lucide-react";

import type { WidgetItem } from "@/features/widgetdashboard/components/DraggableSidebarItem";
import type { PlacedWidgetEntry, WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import {
	FORECAST_ANALYSIS_CARD_TITLES,
	FORECAST_ANALYSIS_HALF_SPAN,
	FORECAST_ANALYSIS_KPI_SPAN,
	FORECAST_ANALYSIS_KPI_TITLES,
	FORECAST_ANALYSIS_QUARTER_SPAN,
	type AnalysisCardId,
	type AnalysisKpiId,
} from "../../../constants/forecastAnalysis.constants";
import type {
	AnalysisKpis,
	AnalysisOpportunitySummary,
	AnalysisProjectPerformance,
	AnalysisRiskItem,
	AnalysisSummaryRow,
	AnalysisTrendPoint,
} from "../../../types/forecastAnalysis.types";
import { createAnalysisFinancialWidgets } from "./widgets/AnalysisFinancialWidgets";
import { createAnalysisKpiWidgets } from "./widgets/AnalysisKpiWidgets";
import { createAnalysisRiskWidgets } from "./widgets/AnalysisRiskWidgets";
import { createAnalysisTrendWidget } from "./widgets/AnalysisTrendWidget";

export type AnalysisWidgetId = AnalysisKpiId | AnalysisCardId;

/**
 * The frame's grid: the six figure cards across the top, then Financial
 * Summary beside Project Performance, the trend chart beside the two banded
 * cards.
 */
export const ANALYSIS_LAYOUT: { id: AnalysisWidgetId; span: string }[] = [
	...(Object.keys(FORECAST_ANALYSIS_KPI_TITLES) as AnalysisKpiId[]).map((id) => ({
		id: id as AnalysisWidgetId,
		span: FORECAST_ANALYSIS_KPI_SPAN,
	})),
	{ id: "financialSummary", span: FORECAST_ANALYSIS_HALF_SPAN },
	{ id: "projectPerformance", span: FORECAST_ANALYSIS_HALF_SPAN },
	{ id: "forecastTrends", span: FORECAST_ANALYSIS_HALF_SPAN },
	{ id: "riskOpportunities", span: FORECAST_ANALYSIS_QUARTER_SPAN },
	{ id: "opportunities", span: FORECAST_ANALYSIS_QUARTER_SPAN },
];

const WIDGET_TITLES: Record<AnalysisWidgetId, TranslationKeys> = {
	...FORECAST_ANALYSIS_KPI_TITLES,
	...FORECAST_ANALYSIS_CARD_TITLES,
};

/** Everything the cards read, derived once by `useForecastAnalysis`. */
export interface AnalysisWidgetData {
	kpis: AnalysisKpis;
	summaryRows: AnalysisSummaryRow[];
	performance: AnalysisProjectPerformance;
	trend: AnalysisTrendPoint[];
	opportunities: AnalysisOpportunitySummary;
	risks: AnalysisRiskItem[];
}

export function buildAnalysisWidgetMap(data: AnalysisWidgetData): Record<string, WidgetProps> {
	return {
		...createAnalysisKpiWidgets(data.kpis),
		...createAnalysisFinancialWidgets(data.summaryRows, data.performance),
		...createAnalysisTrendWidget(data.trend),
		...createAnalysisRiskWidgets({
			riskExposure: data.kpis.riskExposure,
			opportunities: data.opportunities,
			risks: data.risks,
		}),
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
	label: WIDGET_TITLES[id],
	icon: Layers,
}));
