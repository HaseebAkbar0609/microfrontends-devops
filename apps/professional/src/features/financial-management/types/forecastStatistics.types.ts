import type { TranslationKeys } from "@/utils/translation/constants";
import type { RiskLevel } from "./forecastRisk.types";

/** Which of the six figures a card draws. */
export type StatisticsKpiId =
	| "cumulativeProfit"
	| "operatingCost"
	| "activeObjects"
	| "averageMargin"
	| "openCases"
	| "riskExposure";

/** How a figure is written: money, a percentage, or a plain count. */
export type StatisticsKpiFormat = "sek" | "percent" | "count";

/**
 * One month of everything the page measures.
 *
 * Every card, both rings and the chart are derived from these rows, so a
 * card's sparkline is always the month-by-month version of the number printed
 * above it. Seed the two apart and they drift, which is the one defect a
 * reader always catches.
 */
export interface StatisticsMonthPoint {
	monthKey: TranslationKeys;
	profit: number;
	/** Positive, so both of the chart's fills sit above the axis. */
	operatingCost: number;
	activeObjects: number;
	openCases: number;
	riskExposure: number;
}

/** One month of the chart, after the running sums are taken. */
export interface StatisticsChartPoint {
	monthKey: TranslationKeys;
	profit: number;
	operatingCost: number;
}

/** One of the six cards, as the derive layer builds it. */
export interface StatisticsKpi {
	id: StatisticsKpiId;
	labelKey: TranslationKeys;
	value: number;
	format: StatisticsKpiFormat;
	/** Against the month before; the sub-line reads it. */
	change: number;
	/** The sparkline, oldest first — one point per month. */
	trend: number[];
	/** Whether the figure has crossed its threshold. */
	isWarning: boolean;
}

/** One arc of either ring; the panel resolves the colour. */
export interface StatisticsDistributionSlice {
	id: string;
	labelKey: TranslationKeys;
	value: number;
}

/** Which of the two cards an event belongs to. */
export type StatisticsEventKind = "system" | "financial";

export interface StatisticsEvent {
	id: string;
	kind: StatisticsEventKind;
	labelKey: TranslationKeys;
	/** ISO date, YYYY-MM-DD. */
	date: string;
}

/** One row of the cross-system table. */
export interface StatisticsActivityRow {
	id: string;
	/** A real name, as the risk and analysis records carry one — not a key. */
	projectName: string;
	moduleKey: TranslationKeys;
	caseVolume: number;
	/** Riskhantering's own vocabulary, so one map drives the pill. */
	level: RiskLevel;
	exposure: number;
}

export type StatisticsActivitySortField =
	| "projectName"
	| "moduleKey"
	| "caseVolume"
	| "level"
	| "exposure";

/** What the seed states outright. */
export interface StatisticsSeed {
	months: StatisticsMonthPoint[];
	objectDistribution: StatisticsDistributionSlice[];
	events: StatisticsEvent[];
	activity: StatisticsActivityRow[];
}

/** What the page reads, once the seed has been worked out. */
export interface StatisticsState {
	kpis: StatisticsKpi[];
	chartPoints: StatisticsChartPoint[];
	objectDistribution: StatisticsDistributionSlice[];
	/** Grouped from the activity rows, so the ring and the table agree. */
	healthDistribution: StatisticsDistributionSlice[];
	systemEvents: StatisticsEvent[];
	financialEvents: StatisticsEvent[];
	activity: StatisticsActivityRow[];
}
