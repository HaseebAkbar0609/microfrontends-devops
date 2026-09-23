import type { SortDir } from "@/utils/tableSort";
import { FORECAST_RESULT_MONTH_KEYS } from "../constants/forecastResult.constants";
import type {
	ForecastMonthlyRow,
	ForecastMonthlySortField,
	ForecastResultSign,
	ForecastYearlyRow,
	ForecastYearlySortField,
} from "../types/forecastResult.types";

/** TB-bidrag: what an object's year leaves after its costs. */
export function yearlyContribution(row: ForecastYearlyRow): number {
	return row.revenue - row.costs;
}

/** A role's whole year, which is what the filter and the row's own reading weigh. */
export function monthlyTotal(row: ForecastMonthlyRow): number {
	return row.months.reduce((sum, month) => sum + month, 0);
}

/** The "Prognos resultat" row: every shown role summed, month by month. */
export function monthlyColumnTotals(rows: ForecastMonthlyRow[]): number[] {
	return FORECAST_RESULT_MONTH_KEYS.map((_, month) => rows.reduce((sum, row) => sum + (row.months[month] ?? 0), 0));
}

/** The grey band under Årlig: intäkter, kostnader and what they leave. */
export function yearlyTotals(rows: ForecastYearlyRow[]): { revenue: number; costs: number; contribution: number } {
	const revenue = rows.reduce((sum, row) => sum + row.revenue, 0);
	const costs = rows.reduce((sum, row) => sum + row.costs, 0);
	return { revenue, costs, contribution: revenue - costs };
}

function matchesSign(result: number, sign: ForecastResultSign | null): boolean {
	if (!sign) return true;
	return sign === "positive" ? result >= 0 : result < 0;
}

function matchesQuery(text: string, query: string): boolean {
	const needle = query.trim().toLowerCase();
	return !needle || text.toLowerCase().includes(needle);
}

/** An Årlig row belongs in the table when its object is searched for and its TB matches the filter. */
export function matchesYearly(row: ForecastYearlyRow, query: string, sign: ForecastResultSign | null): boolean {
	return matchesQuery(row.objectName, query) && matchesSign(yearlyContribution(row), sign);
}

/** A Månad row, likewise, by its role and by the year it adds up to. */
export function matchesMonthly(row: ForecastMonthlyRow, query: string, sign: ForecastResultSign | null): boolean {
	return matchesQuery(row.role, query) && matchesSign(monthlyTotal(row), sign);
}

/** The index a `month-N` sort field names. */
export function monthIndexOf(field: ForecastMonthlySortField): number | null {
	if (field === "role") return null;
	const index = Number(field.slice("month-".length));
	return Number.isInteger(index) ? index : null;
}

function compare(left: string | number, right: string | number, factor: number, locale: string): number {
	if (typeof left === "number" && typeof right === "number") return factor * (left - right);
	return factor * String(left).localeCompare(String(right), locale, { sensitivity: "base", numeric: true });
}

function yearlyValue(row: ForecastYearlyRow, field: ForecastYearlySortField): string | number {
	return field === "contribution" ? yearlyContribution(row) : row[field];
}

/**
 * Rows in header order: amounts as numbers, text in the app's language with
 * numbers inside it read as numbers, so Roll 10 follows Roll 9 and Swedish å,
 * ä and ö sort after z. With no sort the list's own order stands.
 */
export function sortYearly(
	rows: ForecastYearlyRow[],
	field: ForecastYearlySortField | null,
	dir: SortDir,
	locale: string,
): ForecastYearlyRow[] {
	if (!field || !dir) return rows;
	const factor = dir === "asc" ? 1 : -1;
	return [...rows].sort((a, b) => compare(yearlyValue(a, field), yearlyValue(b, field), factor, locale));
}

export function sortMonthly(
	rows: ForecastMonthlyRow[],
	field: ForecastMonthlySortField | null,
	dir: SortDir,
	locale: string,
): ForecastMonthlyRow[] {
	if (!field || !dir) return rows;
	const factor = dir === "asc" ? 1 : -1;
	const month = monthIndexOf(field);
	return [...rows].sort((a, b) =>
		month === null
			? compare(a.role, b.role, factor, locale)
			: compare(a.months[month] ?? 0, b.months[month] ?? 0, factor, locale),
	);
}
