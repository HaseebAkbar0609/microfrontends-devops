import { AlertCircle, CircleCheck, TrendingUp } from "lucide-react";

import type { WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import localizationConstants from "@/utils/translation/constants";
import {
	FORECAST_ANALYSIS_ACCURACY_THRESHOLDS,
	FORECAST_ANALYSIS_KPI_TITLES,
	FORECAST_ANALYSIS_RISK_LABELS,
} from "../../../../constants/forecastAnalysis.constants";
import type { AnalysisKpiNote, AnalysisKpis } from "../../../../types/forecastAnalysis.types";
import { formatPercent, formatSek } from "../../../../utils/economyFormatters";
import { KpiCard, changeTone } from "./AnalysisCardParts";

/* The figure card and its tone helpers live beside this file, since Nyckeltal
   reads the same shape. */

function accuracyNote(accuracy: number): AnalysisKpiNote {
	if (accuracy >= FORECAST_ANALYSIS_ACCURACY_THRESHOLDS.good)
		return { labelKey: localizationConstants.forecastAnalysisAccuracyGood, tone: "positive" };
	if (accuracy >= FORECAST_ANALYSIS_ACCURACY_THRESHOLDS.fair)
		return { labelKey: localizationConstants.forecastAnalysisAccuracyFair, tone: "neutral" };
	return { labelKey: localizationConstants.forecastAnalysisAccuracyPoor, tone: "negative" };
}

/** The frame's six figure cards, each reading from the selection's own numbers. */
export function createAnalysisKpiWidgets(kpis: AnalysisKpis): Record<string, WidgetProps> {
	const utilizationChange = kpis.utilizationPercent - kpis.previousUtilizationPercent;

	return {
		revenueYtd: {
			title: FORECAST_ANALYSIS_KPI_TITLES.revenueYtd,
			icon: TrendingUp,
			variant: "kpi",
			content: (
				<KpiCard
					value={formatSek(kpis.revenue)}
					rising={kpis.revenueVsForecastPercent >= 0}
					note={{
						labelKey: localizationConstants.forecastAnalysisVsForecast,
						values: { percent: formatPercent(kpis.revenueVsForecastPercent, 0) },
						tone: changeTone(kpis.revenueVsForecastPercent),
					}}
				/>
			),
		},
		grossMargin: {
			title: FORECAST_ANALYSIS_KPI_TITLES.grossMargin,
			icon: TrendingUp,
			variant: "kpi",
			content: (
				<KpiCard
					value={formatPercent(kpis.marginPercent)}
					rising={kpis.marginVsBudgetPoints >= 0}
					note={{
						labelKey: localizationConstants.forecastAnalysisVsBudget,
						values: { percent: formatPercent(kpis.marginVsBudgetPoints) },
						tone: changeTone(kpis.marginVsBudgetPoints),
					}}
				/>
			),
		},
		forecastAccuracy: {
			title: FORECAST_ANALYSIS_KPI_TITLES.forecastAccuracy,
			icon: CircleCheck,
			variant: "kpi",
			content: <KpiCard value={formatPercent(kpis.accuracyPercent)} note={accuracyNote(kpis.accuracyPercent)} />,
		},
		billableUtilization: {
			title: FORECAST_ANALYSIS_KPI_TITLES.billableUtilization,
			icon: TrendingUp,
			variant: "kpi",
			content: (
				<KpiCard
					value={formatPercent(kpis.utilizationPercent)}
					rising={utilizationChange >= 0}
					note={{
						labelKey:
							utilizationChange >= 0
								? localizationConstants.forecastAnalysisUtilizationUpFrom
								: localizationConstants.forecastAnalysisUtilizationDownFrom,
						values: { percent: formatPercent(kpis.previousUtilizationPercent, 0) },
						tone: changeTone(utilizationChange),
					}}
				/>
			),
		},
		highRiskProjects: {
			title: FORECAST_ANALYSIS_KPI_TITLES.highRiskProjects,
			icon: AlertCircle,
			variant: "kpi",
			content: (
				<KpiCard
					value={String(kpis.highRiskCount)}
					note={
						kpis.newRiskCount > 0
							? {
									labelKey: localizationConstants.forecastAnalysisNewRisks,
									values: { count: kpis.newRiskCount },
									tone: "negative",
								}
							: { labelKey: localizationConstants.forecastAnalysisNoNewRisks, tone: "positive" }
					}
				/>
			),
		},
		totalRiskExposure: {
			title: FORECAST_ANALYSIS_KPI_TITLES.totalRiskExposure,
			icon: AlertCircle,
			variant: "kpi",
			content: (
				<KpiCard
					value={formatSek(kpis.riskExposure)}
					note={{
						labelKey: FORECAST_ANALYSIS_RISK_LABELS[kpis.riskLevel],
						tone: kpis.riskLevel === "high" ? "negative" : kpis.riskLevel === "moderate" ? "neutral" : "positive",
					}}
				/>
			),
		},
	};
}
