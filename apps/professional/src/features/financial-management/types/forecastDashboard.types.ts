import type { TranslationKeys } from "@/utils/translation/constants";

/** A department's utilisation over the coming six weeks, in percent of its capacity. */
export interface ForecastOccupancy {
	id: string;
	labelKey: TranslationKeys;
	percent: number;
}

/** Hours left in a week: positive is free capacity, negative is overload. */
export interface ForecastWeekBalance {
	week: number;
	hours: number;
}

/** Hours left in a month: positive is free capacity, negative is overload. */
export interface ForecastMonthBalance {
	id: string;
	labelKey: TranslationKeys;
	hours: number;
}

export type ForecastWarningTone = "critical" | "warning" | "info";

/** One line of Åtgärder & varningar: what needs attention and how many. */
export interface ForecastWarning {
	id: string;
	labelKey: TranslationKeys;
	count: number;
	tone: ForecastWarningTone;
}

/** Hours across every project and order: planned, forecast and worked so far. */
export interface ForecastProjectTotals {
	plannedHours: number;
	forecastHours: number;
	actualHours: number;
	/** Forecast cost of the forecast hours, in SEK. */
	forecastCost: number;
}

export interface ForecastProject {
	projectNo: string;
	plannedHours: number;
	workedHours: number;
	forecastHours: number;
	/** Forecast cost above budget, in SEK. */
	costOverrun: number;
}

export type ForecastProjectStatus = "risk" | "onTrack";

export interface ForecastProjectRow extends ForecastProject {
	/** Planned less forecast hours; negative when the forecast runs over. */
	hoursVariance: number;
	status: ForecastProjectStatus;
}

export type ForecastPeriod = "week" | "month";

export interface ForecastDashboardData {
	companyOccupancy: number;
	departments: ForecastOccupancy[];
	weeks: ForecastWeekBalance[];
	months: ForecastMonthBalance[];
	totals: ForecastProjectTotals;
	projects: ForecastProject[];
	warnings: ForecastWarning[];
}

/** The coming weeks summed: free capacity less overload, and each on its own. */
export interface ForecastLoadSummary {
	availableHours: number;
	freeHours: number;
	overloadHours: number;
}

export interface ForecastDashboardState extends Omit<ForecastDashboardData, "projects"> {
	load: ForecastLoadSummary;
	projects: ForecastProjectRow[];
	/** Projects whose forecast runs over their plan. */
	riskProjects: ForecastProjectRow[];
}
