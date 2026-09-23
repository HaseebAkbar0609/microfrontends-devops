import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import type {
	AnalysisDepartment,
	AnalysisFilters,
	AnalysisPeriod,
	AnalysisRiskLevel,
	AnalysisStatus,
} from "../types/forecastAnalysis.types";

export const FORECAST_ANALYSIS_STORAGE_KEY = "tfs_professional_forecast_analysis_layout_v1";

/**
 * The location the backend answers with this dashboard's live widget ids. Until
 * it knows this one, every card reads as not connected — see
 * docs/TFS-1081-widget-sources.md.
 */
export const FORECAST_ANALYSIS_SOURCE_LOCATION = "forecast_analysis_dashboard";

/** The mock runs January through September, as the frame's chart does. */
export const FORECAST_ANALYSIS_MONTH_COUNT = 9;

/** How many months back each period reads, counting from the last one. */
export const FORECAST_ANALYSIS_PERIOD_MONTHS: Record<AnalysisPeriod, number> = {
	yearToDate: FORECAST_ANALYSIS_MONTH_COUNT,
	quarter: 3,
	month: 1,
};

export const FORECAST_ANALYSIS_PERIODS: { id: AnalysisPeriod; labelKey: TranslationKeys }[] = [
	{ id: "yearToDate", labelKey: localizationConstants.forecastAnalysisPeriodYearToDate },
	{ id: "quarter", labelKey: localizationConstants.forecastAnalysisPeriodQuarter },
	{ id: "month", labelKey: localizationConstants.forecastAnalysisPeriodMonth },
];

export const FORECAST_ANALYSIS_DEPARTMENT_LABELS: Record<AnalysisDepartment, TranslationKeys> = {
	production: localizationConstants.forecastDeptProduction,
	service: localizationConstants.forecastDeptService,
};

export const FORECAST_ANALYSIS_STATUS_LABELS: Record<AnalysisStatus, TranslationKeys> = {
	active: localizationConstants.forecastAnalysisStatusActive,
	paused: localizationConstants.forecastAnalysisStatusPaused,
	closed: localizationConstants.forecastAnalysisStatusClosed,
};

/** What the whole selection's exposure is called, and how its footnote reads. */
export const FORECAST_ANALYSIS_RISK_LABELS: Record<AnalysisRiskLevel, TranslationKeys> = {
	low: localizationConstants.forecastAnalysisRiskLow,
	moderate: localizationConstants.forecastAnalysisRiskModerate,
	high: localizationConstants.forecastAnalysisRiskHigh,
};

/** Exposure in SEK above which the selection reads as moderate, then as high. */
export const FORECAST_ANALYSIS_RISK_THRESHOLDS = { moderate: 250000, high: 750000 };

/** Forecast accuracy in percent above which it reads as good, then as fair. */
export const FORECAST_ANALYSIS_ACCURACY_THRESHOLDS = { good: 85, fair: 70 };

/** Nothing filtered: the year so far, every department, object and status. */
export const INITIAL_ANALYSIS_FILTERS: AnalysisFilters = {
	period: "yearToDate",
	department: null,
	objectIds: [],
	status: null,
};

/** The six figure cards of the frame, in its order. */
export const FORECAST_ANALYSIS_KPI_TITLES = {
	revenueYtd: localizationConstants.forecastAnalysisKpiRevenue,
	grossMargin: localizationConstants.forecastAnalysisKpiMargin,
	forecastAccuracy: localizationConstants.forecastAnalysisKpiAccuracy,
	billableUtilization: localizationConstants.forecastAnalysisKpiUtilization,
	highRiskProjects: localizationConstants.forecastAnalysisKpiHighRisk,
	totalRiskExposure: localizationConstants.forecastAnalysisKpiRiskExposure,
} as const satisfies Record<string, TranslationKeys>;

export type AnalysisKpiId = keyof typeof FORECAST_ANALYSIS_KPI_TITLES;

/** Six across a full row, three beside the rail, two on a tablet, one on a phone. */
export const FORECAST_ANALYSIS_KPI_SPAN = "col-span-12 sm:col-span-6 lg:col-span-4 2xl:col-span-2";
