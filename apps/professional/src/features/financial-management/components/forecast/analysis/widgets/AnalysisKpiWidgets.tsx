import { AlertCircle, CircleCheck, TrendingUp } from "lucide-react";

import type { WidgetProps } from "@/features/widgetdashboard/types/dashboard";

import { FORECAST_ANALYSIS_KPI_TITLES } from "../../../../constants/forecastAnalysis.constants";
import type { AnalysisKpis } from "../../../../types/forecastAnalysis.types";

export function createAnalysisKpiWidgets(_kpis: AnalysisKpis): Record<string, WidgetProps> {

	return {
		revenueYtd: {
			title: FORECAST_ANALYSIS_KPI_TITLES.revenueYtd,
			icon: TrendingUp,
			variant: "kpi",
		},
		grossMargin: {
			title: FORECAST_ANALYSIS_KPI_TITLES.grossMargin,
			icon: TrendingUp,
			variant: "kpi",
		},
		forecastAccuracy: {
			title: FORECAST_ANALYSIS_KPI_TITLES.forecastAccuracy,
			icon: CircleCheck,
			variant: "kpi",
		},
		billableUtilization: {
			title: FORECAST_ANALYSIS_KPI_TITLES.billableUtilization,
			icon: TrendingUp,
			variant: "kpi",
		},
		highRiskProjects: {
			title: FORECAST_ANALYSIS_KPI_TITLES.highRiskProjects,
			icon: AlertCircle,
			variant: "kpi",
		},
		totalRiskExposure: {
			title: FORECAST_ANALYSIS_KPI_TITLES.totalRiskExposure,
			icon: AlertCircle,
			variant: "kpi",
		},
	};
}
