import { AlertCircle, CircleCheck, Circle, TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";

import type { WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	FORECAST_ANALYSIS_ACCURACY_THRESHOLDS,
	FORECAST_ANALYSIS_KPI_TITLES,
	FORECAST_ANALYSIS_RISK_LABELS,
} from "../../../../constants/forecastAnalysis.constants";
import type { AnalysisKpiNote, AnalysisKpis, AnalysisTone } from "../../../../types/forecastAnalysis.types";
import { formatPercent, formatSek } from "../../../../utils/economyFormatters";

const TONE_CLASS: Record<AnalysisTone, string> = {
	positive: "text-emerald-600",
	negative: "text-red-600",
	neutral: "text-amber-600",
};

/** A figure's footnote reads as good, poor or merely worth knowing. */
function noteIcon(tone: AnalysisTone, rising: boolean | null): LucideIcon {
	if (rising === true) return TrendingUp;
	if (rising === false) return TrendingDown;
	if (tone === "positive") return CircleCheck;
	if (tone === "negative") return AlertCircle;
	return Circle;
}

function KpiCard({ value, note, rising = null }: { value: string; note: AnalysisKpiNote; rising?: boolean | null }) {
	const Icon = noteIcon(note.tone, rising);

	return (
		<div className="flex flex-1 flex-col justify-between gap-3">
			<p className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">{value}</p>
			<p className={cn("flex items-center gap-1.5 text-xs font-medium", TONE_CLASS[note.tone])}>
				<Icon size={14} aria-hidden />
				<Translate text={note.labelKey} values={note.values} />
			</p>
		</div>
	);
}

/** A change reads as good when it is up, unless being up is the problem. */
function changeTone(value: number, upIsGood = true): AnalysisTone {
	if (value === 0) return "neutral";
	return value > 0 === upIsGood ? "positive" : "negative";
}

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
