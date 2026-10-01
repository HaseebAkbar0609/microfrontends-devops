import type { TranslationKeys } from "@/utils/translation/constants";
import { RISK_LEVEL_META, RISK_LEVEL_ORDER } from "../constants/forecastRisk.constants";
import {
	FORECAST_STATISTICS_ACTIVITY_COLUMNS,
	FORECAST_STATISTICS_KPI_LABELS,
	FORECAST_STATISTICS_KPI_ORDER,
	FORECAST_STATISTICS_RISK_WARNING_SEK,
} from "../constants/forecastStatistics.constants";
import type { SortDir } from "@/utils/tableSort";
import type {
	StatisticsActivityRow,
	StatisticsActivitySortField,
	StatisticsChartPoint,
	StatisticsDistributionSlice,
	StatisticsKpi,
	StatisticsKpiId,
	StatisticsMonthPoint,
	StatisticsSeed,
	StatisticsState,
} from "../types/forecastStatistics.types";
import type { Cell } from "./economyWorkbook";

/** Turns a translation key into the reader's text. */
export type StatisticsLabel = (key: TranslationKeys) => string;

/** What share of the month's turnover was kept, in percent. */
function marginOf(month: StatisticsMonthPoint): number {
	const turnover = month.profit + month.operatingCost;
	return turnover === 0 ? 0 : (month.profit / turnover) * 100;
}

/** The running total of a series, month by month. */
function runningTotal(values: number[]): number[] {
	let carried = 0;
	return values.map((value) => {
		carried += value;
		return carried;
	});
}

/**
 * The series behind each card, taken from the same months the card's figure
 * is. A card's value is the last point of its own sparkline, so the curve can
 * never disagree with the number above it.
 */
function trendFor(id: StatisticsKpiId, months: StatisticsMonthPoint[]): number[] {
	switch (id) {
		case "cumulativeProfit":
			return runningTotal(months.map((month) => month.profit));
		case "operatingCost":
			return months.map((month) => month.operatingCost);
		case "activeObjects":
			return months.map((month) => month.activeObjects);
		case "averageMargin":
			return months.map(marginOf);
		case "openCases":
			return months.map((month) => month.openCases);
		case "riskExposure":
			return months.map((month) => month.riskExposure);
	}
}

const PERCENT_KPIS = new Set<StatisticsKpiId>(["averageMargin"]);
const COUNT_KPIS = new Set<StatisticsKpiId>(["activeObjects", "openCases"]);

function formatOf(id: StatisticsKpiId) {
	if (PERCENT_KPIS.has(id)) return "percent" as const;
	if (COUNT_KPIS.has(id)) return "count" as const;
	return "sek" as const;
}

/** The six cards, each the last point of its own series. */
export function buildStatisticsKpis(months: StatisticsMonthPoint[]): StatisticsKpi[] {
	return FORECAST_STATISTICS_KPI_ORDER.map((id) => {
		const trend = trendFor(id, months);
		const value = trend.at(-1) ?? 0;
		const previous = trend.at(-2) ?? value;
		return {
			id,
			labelKey: FORECAST_STATISTICS_KPI_LABELS[id],
			value,
			format: formatOf(id),
			change: value - previous,
			trend,
			isWarning: id === "riskExposure" && value > FORECAST_STATISTICS_RISK_WARNING_SEK,
		};
	});
}

/** Both of the chart's series as running totals, which is what cumulative means. */
export function buildChartPoints(months: StatisticsMonthPoint[]): StatisticsChartPoint[] {
	const profit = runningTotal(months.map((month) => month.profit));
	const cost = runningTotal(months.map((month) => month.operatingCost));
	return months.map((month, index) => ({
		monthKey: month.monthKey,
		profit: profit[index],
		operatingCost: cost[index],
	}));
}

/**
 * The health ring, counted off the rows the table shows, so the two always
 * describe the same projects. Levels with no projects stay in the legend.
 */
export function buildHealthDistribution(
	activity: StatisticsActivityRow[],
): StatisticsDistributionSlice[] {
	return RISK_LEVEL_ORDER.map((level) => ({
		id: level,
		labelKey: RISK_LEVEL_META[level].labelKey,
		value: activity.filter((row) => row.level === level).length,
	}));
}

/** Everything the page reads, worked out from the one seed. */
export function buildStatisticsState(seed: StatisticsSeed): StatisticsState {
	return {
		kpis: buildStatisticsKpis(seed.months),
		chartPoints: buildChartPoints(seed.months),
		objectDistribution: seed.objectDistribution,
		healthDistribution: buildHealthDistribution(seed.activity),
		systemEvents: seed.events.filter((event) => event.kind === "system"),
		financialEvents: seed.events.filter((event) => event.kind === "financial"),
		activity: seed.activity,
	};
}

function sortValue(
	row: StatisticsActivityRow,
	field: StatisticsActivitySortField,
	label: StatisticsLabel,
): string | number {
	if (field === "moduleKey") return label(row.moduleKey);
	if (field === "level") return RISK_LEVEL_ORDER.indexOf(row.level);
	return row[field];
}

/**
 * Activity in header order. Risk sorts by how grave it is rather than by the
 * word, so Hög never files under H between Låg and Bevakas.
 */
export function sortStatisticsActivity(
	rows: StatisticsActivityRow[],
	field: StatisticsActivitySortField | null,
	dir: SortDir,
	label: StatisticsLabel,
	locale: string,
): StatisticsActivityRow[] {
	if (!field || !dir) return rows;

	const factor = dir === "asc" ? 1 : -1;
	return [...rows].sort((a, b) => {
		const left = sortValue(a, field, label);
		const right = sortValue(b, field, label);
		if (typeof left === "number" && typeof right === "number") return factor * (left - right);
		return (
			factor *
			String(left).localeCompare(String(right), locale, { sensitivity: "base", numeric: true })
		);
	});
}

/**
 * The table as a sheet. Counts and amounts go in as numbers so the reader can
 * add them up; everything else as the text they see.
 */
export function buildStatisticsActivityRows(
	rows: readonly StatisticsActivityRow[],
	label: StatisticsLabel,
): Cell[][] {
	const heading = FORECAST_STATISTICS_ACTIVITY_COLUMNS.map((column) => label(column.labelKey));
	return [
		heading,
		...rows.map((row) => [
			row.projectName,
			label(row.moduleKey),
			row.caseVolume,
			label(RISK_LEVEL_META[row.level].labelKey),
			row.exposure,
		]),
	];
}
