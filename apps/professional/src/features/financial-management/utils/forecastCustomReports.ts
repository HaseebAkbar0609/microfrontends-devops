import type { SortDir } from "@/utils/tableSort";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { FORECAST_LIST_COLUMNS } from "../constants/forecastList.constants";
import {
	CUSTOM_REPORT_FILE_EXTENSION,
	CUSTOM_REPORT_NAME_MAX_LENGTH,
} from "../constants/forecastCustomReports.constants";
import type { CustomReport, CustomReportSortField } from "../types/forecastCustomReports.types";
import type { ForecastListSortField } from "../types/forecastList.types";

const COLUMN_ORDER: ForecastListSortField[] = FORECAST_LIST_COLUMNS.map((column) => column.key);
const COLUMN_KEYS = new Set<string>(COLUMN_ORDER);

/** Characters a file system will not take, and the control characters with them. */
const UNSAFE_FILE_CHARS = /[/\\:*?"<>|]|\p{Cc}/gu;

/** A column set in the list's own order, whatever order it was ticked in. */
export function orderedColumns(columns: readonly ForecastListSortField[]): ForecastListSortField[] {
	const chosen = new Set<string>(columns);
	return COLUMN_ORDER.filter((key) => chosen.has(key));
}

/**
 * The columns a stored report carries, or `null` when none of them survive.
 *
 * Anything the list no longer offers is dropped: a key renamed in a later
 * ticket would otherwise reach `formatForecastField` and render blank cells
 * for as long as the record lives.
 */
export function readStoredColumns(value: unknown): ForecastListSortField[] | null {
	if (!Array.isArray(value)) return null;
	const kept = value.filter((key): key is ForecastListSortField => typeof key === "string" && COLUMN_KEYS.has(key));
	return kept.length > 0 ? orderedColumns(kept) : null;
}

/** "VD / Q1" → "VD Q1.xlsx": the name a download arrives under. */
export function customReportFileName(report: CustomReport): string {
	const safe = report.name
		.replace(UNSAFE_FILE_CHARS, " ")
		.replace(/\s+/g, " ")
		.trim()
		.slice(0, CUSTOM_REPORT_NAME_MAX_LENGTH);
	return `${safe}${CUSTOM_REPORT_FILE_EXTENSION}`;
}

/** Whether a report belongs in the register as searched: its number, name or file. */
export function matchesCustomReport(report: CustomReport, query: string): boolean {
	const needle = query.trim().toLowerCase();
	if (!needle) return true;

	return [report.reportNo, report.name, customReportFileName(report)]
		.join(" ")
		.toLowerCase()
		.includes(needle);
}

function sortValue(report: CustomReport, field: CustomReportSortField): string {
	return field === "fileName" ? customReportFileName(report) : report[field];
}

/**
 * Reports in header order, compared in the app's language with numbers inside
 * a name read as numbers, so Q2 follows Q1 and Swedish å, ä and ö sort after z.
 * With no sort the register's own order — newest first — stands.
 */
export function sortCustomReports(
	reports: CustomReport[],
	field: CustomReportSortField | null,
	dir: SortDir,
	locale: string,
): CustomReport[] {
	if (!field || !dir) return reports;

	const factor = dir === "asc" ? 1 : -1;
	return [...reports].sort(
		(a, b) =>
			factor *
			sortValue(a, field).localeCompare(sortValue(b, field), locale, { sensitivity: "base", numeric: true }),
	);
}

/**
 * Why a name cannot be saved, or `null` when it can. Checked in the order the
 * reader meets them: nothing typed, too long, then already taken.
 */
export function customReportNameError(name: string, existing: readonly CustomReport[]): TranslationKeys | null {
	const trimmed = name.trim();
	if (!trimmed) return localizationConstants.forecastCustomReportsNameRequired;
	if (trimmed.length > CUSTOM_REPORT_NAME_MAX_LENGTH) return localizationConstants.forecastCustomReportsNameTooLong;

	const taken = existing.some((report) => report.name.localeCompare(trimmed, undefined, { sensitivity: "base" }) === 0);
	return taken ? localizationConstants.forecastCustomReportsNameDuplicate : null;
}
