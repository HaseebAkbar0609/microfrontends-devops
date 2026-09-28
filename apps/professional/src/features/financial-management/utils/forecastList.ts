import type { SortDir } from "@/utils/tableSort";
import type { TranslationKeys } from "@/utils/translation/constants";
import {
	FORECAST_CATEGORY_LABELS,
	FORECAST_CUSTOMER_TYPE_LABELS,
	FORECAST_LIST_STATUSES,
} from "../constants/forecastList.constants";
import type { ForecastListFilters, ForecastListRow, ForecastListSortField } from "../types/forecastList.types";
import { formatNumber } from "./economyFormatters";

/** Turns a translation key into the reader's text. */
export type ForecastLabel = (key: TranslationKeys) => string;

/** TB-bidrag: intäkter less kostnader, which are stored negative. */
export function forecastContribution(row: ForecastListRow): number {
	return row.revenue + row.costs;
}

/**
 * Whether a row belongs in the list as filtered and searched. Search reads
 * the text columns the reader sees — objekt, kund, projekt, ansvarig,
 * kostnadsställe and the kategori and typ labels.
 */
export function matchesForecast(
	row: ForecastListRow,
	filters: ForecastListFilters,
	query: string,
	label: ForecastLabel,
): boolean {
	if (filters.category && row.category !== filters.category) return false;
	if (filters.customerType && row.customerType !== filters.customerType) return false;

	const needle = query.trim().toLowerCase();
	if (!needle) return true;

	return [
		row.objectNo,
		row.customer,
		row.projectName,
		row.responsible,
		row.costCentre,
		label(FORECAST_CATEGORY_LABELS[row.category]),
		label(FORECAST_CUSTOMER_TYPE_LABELS[row.customerType]),
	]
		.join(" ")
		.toLowerCase()
		.includes(needle);
}

/**
 * A field as the reader sees it, in the table and the details dialog alike:
 * Kategori, Typ and Status by their labels, amounts in Swedish grouping.
 */
export function formatForecastField(row: ForecastListRow, field: ForecastListSortField, label: ForecastLabel): string {
	switch (field) {
		case "category":
			return label(FORECAST_CATEGORY_LABELS[row.category]);
		case "customerType":
			return label(FORECAST_CUSTOMER_TYPE_LABELS[row.customerType]);
		case "status":
			return label(FORECAST_LIST_STATUSES[row.status].labelKey);
		case "revenue":
		case "costs":
			return formatNumber(row[field]);
		case "contribution":
			return formatNumber(forecastContribution(row));
		default:
			return row[field];
	}
}

/**
 * A field as a value rather than as text: amounts as numbers, everything else
 * as the text the reader sees. Sorting compares these, and a spreadsheet
 * written from them can add its money columns up.
 */
export function forecastFieldValue(
	row: ForecastListRow,
	field: ForecastListSortField,
	label: ForecastLabel,
): string | number {
	switch (field) {
		case "revenue":
		case "costs":
			return row[field];
		case "contribution":
			return forecastContribution(row);
		default:
			return formatForecastField(row, field, label);
	}
}

/**
 * Rows in header order. Amounts compare as numbers; text compares in the
 * app's language with numbers inside it read as numbers, so 2021-10 follows
 * 2021-9 and Swedish å, ä and ö sort after z. Kategori, Typ and Status sort by
 * their labels. With no sort the list's own order stands.
 */
export function sortForecasts(
	rows: ForecastListRow[],
	field: ForecastListSortField | null,
	dir: SortDir,
	label: ForecastLabel,
	locale: string,
): ForecastListRow[] {
	if (!field || !dir) return rows;

	const factor = dir === "asc" ? 1 : -1;
	return [...rows].sort((a, b) => {
		const left = forecastFieldValue(a, field, label);
		const right = forecastFieldValue(b, field, label);
		if (typeof left === "number" && typeof right === "number") return factor * (left - right);
		return factor * String(left).localeCompare(String(right), locale, { sensitivity: "base", numeric: true });
	});
}
