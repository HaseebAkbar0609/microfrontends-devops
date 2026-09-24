import { Layers } from "lucide-react";

import type { WidgetItem } from "@/features/widgetdashboard/components/DraggableSidebarItem";
import type { PlacedWidgetEntry, WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import {
	FORECAST_ANALYSIS_HALF_SPAN,
	FORECAST_ANALYSIS_KPI_SPAN,
	FORECAST_ANALYSIS_KPI_TITLES,
	FORECAST_KEY_FIGURES_CARD_TITLES,
	type AnalysisKpiId,
	type KeyFiguresCardId,
} from "../../../../constants/forecastAnalysis.constants";
import type {
	AnalysisCashFlow,
	AnalysisCumulativePoint,
	AnalysisForecastQuality,
	AnalysisKpis,
	AnalysisOpportunitySummary,
	AnalysisProfitability,
	AnalysisProjectPerformance,
	AnalysisRiskItem,
	AnalysisUtilization,
} from "../../../../types/forecastAnalysis.types";
import { createAnalysisKpiWidgets } from "../widgets/AnalysisKpiWidgets";
import { createKeyFiguresCashWidgets } from "./widgets/KeyFiguresCashWidgets";
import { createKeyFiguresQualityWidgets } from "./widgets/KeyFiguresQualityWidgets";
import { createKeyFiguresTrendWidget } from "./widgets/KeyFiguresTrendWidget";

export type KeyFiguresWidgetId = AnalysisKpiId | KeyFiguresCardId;

/** The frame's grid: the six figures Analys shares, then Nyckeltal's own cards. */
export const KEY_FIGURES_LAYOUT: { id: KeyFiguresWidgetId; span: string }[] = [
	...(Object.keys(FORECAST_ANALYSIS_KPI_TITLES) as AnalysisKpiId[]).map((id) => ({
		id: id as KeyFiguresWidgetId,
		span: FORECAST_ANALYSIS_KPI_SPAN,
	})),
	{ id: "forecastQuality", span: FORECAST_ANALYSIS_HALF_SPAN },
	{ id: "keyFigureRisks", span: FORECAST_ANALYSIS_HALF_SPAN },
	{ id: "cashFlow", span: FORECAST_ANALYSIS_HALF_SPAN },
	{ id: "projectProfitability", span: FORECAST_ANALYSIS_HALF_SPAN },
	{ id: "utilizationRates", span: FORECAST_ANALYSIS_HALF_SPAN },
	{ id: "cumulativeProfit", span: "col-span-12" },
];

const WIDGET_TITLES: Record<KeyFiguresWidgetId, TranslationKeys> = {
	...FORECAST_ANALYSIS_KPI_TITLES,
	...FORECAST_KEY_FIGURES_CARD_TITLES,
};

/** Everything Nyckeltal's cards read, derived once by `useForecastAnalysis`. */
export interface KeyFiguresWidgetData {
	kpis: AnalysisKpis;
	quality: AnalysisForecastQuality;
	opportunities: AnalysisOpportunitySummary;
	risks: AnalysisRiskItem[];
	cashFlow: AnalysisCashFlow;
	profitability: AnalysisProfitability;
	performance: AnalysisProjectPerformance;
	utilization: AnalysisUtilization;
	cumulative: AnalysisCumulativePoint[];
}

export function buildKeyFiguresWidgetMap(data: KeyFiguresWidgetData): Record<string, WidgetProps> {
	return {
		...createAnalysisKpiWidgets(data.kpis),
		...createKeyFiguresQualityWidgets({
			quality: data.quality,
			riskExposure: data.kpis.riskExposure,
			opportunities: data.opportunities,
			risks: data.risks,
		}),
		...createKeyFiguresCashWidgets({
			cashFlow: data.cashFlow,
			profitability: data.profitability,
			performance: data.performance,
			utilization: data.utilization,
		}),
		...createKeyFiguresTrendWidget(data.cumulative),
		emptyPage: {
			title: localizationConstants.emptyPageLabel,
			icon: Layers,
		},
	};
}

export function buildKeyFiguresInitialWidgets(widgetMap: Record<string, WidgetProps>): PlacedWidgetEntry[] {
	return KEY_FIGURES_LAYOUT.map(({ id, span }) => ({
		/* Its own prefix, so the two boards on this page never share a card's key. */
		uid: `keyfigures-${id}`,
		sidebarId: id,
		colSpanClass: span,
		widgetProps: widgetMap[id],
	}));
}

/** The rail's Meny: the cards in grid order, each with the stack icon the frame draws. */
export const KEY_FIGURES_SIDEBAR_ITEMS: WidgetItem[] = KEY_FIGURES_LAYOUT.map(({ id }) => ({
	id,
	label: WIDGET_TITLES[id],
	icon: Layers,
}));
