import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import type {
	StatisticsActivitySortField,
	StatisticsKpiId,
} from "../types/forecastStatistics.types";
import { FORECAST_CUMULATIVE_COLOR } from "./forecastAnalysis.constants";

/** The curve's green: the same hex the cumulative chart already draws with. */
export const FORECAST_STATISTICS_PROFIT_COLOR = FORECAST_CUMULATIVE_COLOR;

/** The cost band's red. Declared here rather than reaching into the risk
    palette for one value, as the personnel trend colour is. */
export const FORECAST_STATISTICS_COST_COLOR = "#ef4444";

/** The chart's two filled series, in the order they are drawn and listed. */
export const FORECAST_STATISTICS_SERIES = [
	{
		id: "profit",
		labelKey: localizationConstants.forecastStatisticsSeriesProfit,
		color: FORECAST_STATISTICS_PROFIT_COLOR,
	},
	{
		id: "operatingCost",
		labelKey: localizationConstants.forecastStatisticsSeriesCost,
		color: FORECAST_STATISTICS_COST_COLOR,
	},
] as const;

/** What each card is called. */
export const FORECAST_STATISTICS_KPI_LABELS: Record<StatisticsKpiId, TranslationKeys> = {
	cumulativeProfit: localizationConstants.forecastKeyFiguresCardCumulative,
	operatingCost: localizationConstants.forecastColCosts,
	activeObjects: localizationConstants.forecastStatisticsKpiObjects,
	averageMargin: localizationConstants.forecastAnalysisKpiMargin,
	openCases: localizationConstants.forecastStatisticsKpiOpenCases,
	riskExposure: localizationConstants.forecastAnalysisKpiRiskExposure,
};

/** The order the six cards are read in. */
export const FORECAST_STATISTICS_KPI_ORDER: StatisticsKpiId[] = [
	"cumulativeProfit",
	"operatingCost",
	"activeObjects",
	"averageMargin",
	"openCases",
	"riskExposure",
];

/**
 * The exposure above which the risk card flags itself. The same figure
 * Prognos Analys calls high risk, so one number means one thing.
 */
export const FORECAST_STATISTICS_RISK_WARNING_SEK = 20_000_000;

/** The table's columns, in the frame's order; the export reads the same list. */
export const FORECAST_STATISTICS_ACTIVITY_COLUMNS: {
	key: StatisticsActivitySortField;
	labelKey: TranslationKeys;
}[] = [
	{ key: "projectName", labelKey: localizationConstants.forecastStatisticsColProject },
	{ key: "moduleKey", labelKey: localizationConstants.forecastStatisticsColModule },
	{ key: "caseVolume", labelKey: localizationConstants.forecastStatisticsColVolume },
	{ key: "level", labelKey: localizationConstants.forecastStatisticsColRisk },
	{ key: "exposure", labelKey: localizationConstants.forecastStatisticsColExposure },
];

export const FORECAST_STATISTICS_ACTIVITY_PAGE_SIZE = 10;

/**
 * The object ring's colours, keyed by slice. Green for inside the budget
 * and red for over it, as the risk palette uses them, so the two rings on
 * this page read the same way.
 */
export const FORECAST_STATISTICS_OBJECT_COLORS: Record<string, string> = {
	onBudget: "#10b981",
	overBudget: "#ef4444",
	other: "#94a3b8",
};

/** What the exported workbook is called. */
export const FORECAST_STATISTICS_EXPORT_FILE = "prognos-statistik.xlsx";
