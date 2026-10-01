import localizationConstants from "@/utils/translation/constants";
import { FORECAST_ANALYSIS_MONTH_KEYS } from "../constants/forecastAnalysis.constants";
import type { StatisticsSeed } from "../types/forecastStatistics.types";

/* January through September, as the module's other mocks run. */
const [JAN, FEB, MAR, APR, MAY, JUN, JUL, AUG, SEP] = FORECAST_ANALYSIS_MONTH_KEYS;

/**
 * What the statistics are measured from.
 *
 * One row per month carrying every figure the page reports, so the cards, the
 * sparklines, the chart and the rings are all worked out from the same
 * numbers and cannot contradict each other. Everything else — the running
 * sums, the margins, the health ring — is derived.
 */
export const INITIAL_STATISTICS_SEED: StatisticsSeed = {
	months: [
		{ monthKey: JAN, profit: 420000, operatingCost: 310000, activeObjects: 18, openCases: 24, riskExposure: 12400000 },
		{ monthKey: FEB, profit: 465000, operatingCost: 322000, activeObjects: 19, openCases: 27, riskExposure: 13100000 },
		{ monthKey: MAR, profit: 512000, operatingCost: 341000, activeObjects: 21, openCases: 31, riskExposure: 15800000 },
		{ monthKey: APR, profit: 498000, operatingCost: 358000, activeObjects: 22, openCases: 29, riskExposure: 17200000 },
		{ monthKey: MAY, profit: 544000, operatingCost: 366000, activeObjects: 24, openCases: 33, riskExposure: 18600000 },
		{ monthKey: JUN, profit: 601000, operatingCost: 384000, activeObjects: 25, openCases: 36, riskExposure: 19900000 },
		{ monthKey: JUL, profit: 438000, operatingCost: 372000, activeObjects: 23, openCases: 30, riskExposure: 21300000 },
		{ monthKey: AUG, profit: 472000, operatingCost: 391000, activeObjects: 24, openCases: 34, riskExposure: 22100000 },
		{ monthKey: SEP, profit: 536000, operatingCost: 405000, activeObjects: 26, openCases: 38, riskExposure: 23400000 },
	],

	objectDistribution: [
		{ id: "onBudget", labelKey: localizationConstants.forecastStatisticsObjectsOnBudget, value: 17 },
		{ id: "overBudget", labelKey: localizationConstants.forecastStatisticsObjectsOver, value: 6 },
		{ id: "other", labelKey: localizationConstants.forecastStatisticsObjectsOther, value: 3 },
	],

	events: [
		{ id: "ev-1", kind: "system", labelKey: localizationConstants.forecastStatisticsEventForecast, date: "2026-07-22" },
		{ id: "ev-2", kind: "system", labelKey: localizationConstants.forecastStatisticsEventReport, date: "2026-07-19" },
		{ id: "ev-3", kind: "system", labelKey: localizationConstants.forecastStatisticsEventRisk, date: "2026-07-15" },
		{ id: "ev-4", kind: "financial", labelKey: localizationConstants.forecastStatisticsEventBudget, date: "2026-07-21" },
		{ id: "ev-5", kind: "financial", labelKey: localizationConstants.forecastStatisticsEventInvoice, date: "2026-07-17" },
		{ id: "ev-6", kind: "financial", labelKey: localizationConstants.forecastStatisticsEventMargin, date: "2026-07-11" },
	],

	activity: [
		{ id: "act-1", projectName: "Kv. Almen 4", moduleKey: localizationConstants.forecastRiskTitle, caseVolume: 86, level: "high", exposure: 8400000 },
		{ id: "act-2", projectName: "Hamnmagasinet", moduleKey: localizationConstants.forecastAnalysisTitle, caseVolume: 64, level: "low", exposure: 2120000 },
		{ id: "act-3", projectName: "Strandvägen 12", moduleKey: localizationConstants.cases, caseVolume: 58, level: "watch", exposure: 4650000 },
		{ id: "act-4", projectName: "Logistikparken", moduleKey: localizationConstants.budget, caseVolume: 41, level: "low", exposure: 1480000 },
		{ id: "act-5", projectName: "Vasaterminalen", moduleKey: localizationConstants.forecastRiskTitle, caseVolume: 37, level: "high", exposure: 5230000 },
		{ id: "act-6", projectName: "Norra verkstaden", moduleKey: localizationConstants.forecastReportsTitle, caseVolume: 29, level: "watch", exposure: 1520000 },
	],
};
