import type { SortDir } from "@/utils/tableSort";
import type { TranslationKeys } from "@/utils/translation/constants";
import { REPORT_CATEGORY_LABELS } from "../constants/forecastReports.constants";
import type {
	ReportDocument,
	ReportListFilters,
	ReportSortField,
} from "../types/forecastReports.types";

/** Turns a translation key into the reader's text. */
export type ReportLabel = (key: TranslationKeys) => string;

/**
 * Whether a report belongs in the register as filtered and searched. Search
 * reads what the reader sees: the number, the file's name and the category's
 * label.
 */
export function matchesReport(
	report: ReportDocument,
	filters: ReportListFilters,
	query: string,
	label: ReportLabel,
): boolean {
	if (filters.category && report.category !== filters.category) return false;

	const needle = query.trim().toLowerCase();
	if (!needle) return true;

	return [report.reportNo, report.fileName, label(REPORT_CATEGORY_LABELS[report.category])]
		.join(" ")
		.toLowerCase()
		.includes(needle);
}

function sortValue(report: ReportDocument, field: ReportSortField, label: ReportLabel): string {
	if (field === "category") return label(REPORT_CATEGORY_LABELS[report.category]);
	return report[field];
}

/**
 * Reports in header order, compared in the app's language with numbers inside
 * a name read as numbers, so Q2 follows Q1 and Swedish å, ä and ö sort after z.
 * With no sort the register's own order — newest first — stands.
 */
export function sortReports(
	reports: ReportDocument[],
	field: ReportSortField | null,
	dir: SortDir,
	label: ReportLabel,
	locale: string,
): ReportDocument[] {
	if (!field || !dir) return reports;

	const factor = dir === "asc" ? 1 : -1;
	return [...reports].sort(
		(a, b) =>
			factor *
			sortValue(a, field, label).localeCompare(sortValue(b, field, label), locale, {
				sensitivity: "base",
				numeric: true,
			}),
	);
}
