import type { SortDir } from "@/utils/tableSort";
import type { TranslationKeys } from "@/utils/translation/constants";
import { DOCUMENT_CATEGORY_LABELS } from "../constants/forecastDocuments.constants";
import type {
	DocumentListFilters,
	DocumentSortField,
	ForecastDocument,
} from "../types/forecastDocuments.types";

/** Turns a translation key into the reader's text. */
export type DocumentLabel = (key: TranslationKeys) => string;

/**
 * Whether a document belongs in the register as filtered and searched. Search
 * reads what the reader sees: the number, the file's name and the category's
 * label.
 */
export function matchesDocument(
	document: ForecastDocument,
	filters: DocumentListFilters,
	query: string,
	label: DocumentLabel,
): boolean {
	if (filters.category && document.category !== filters.category) return false;

	const needle = query.trim().toLowerCase();
	if (!needle) return true;

	return [document.documentNo, document.fileName, label(DOCUMENT_CATEGORY_LABELS[document.category])]
		.join(" ")
		.toLowerCase()
		.includes(needle);
}

function sortValue(document: ForecastDocument, field: DocumentSortField, label: DocumentLabel): string {
	if (field === "category") return label(DOCUMENT_CATEGORY_LABELS[document.category]);
	return document[field];
}

/**
 * Documents in header order, compared in the app's language with numbers
 * inside a name read as numbers, so Q2 follows Q1 and Swedish å, ä and ö sort
 * after z. With no sort the register's own order — newest first — stands.
 */
export function sortDocuments(
	documents: ForecastDocument[],
	field: DocumentSortField | null,
	dir: SortDir,
	label: DocumentLabel,
	locale: string,
): ForecastDocument[] {
	if (!field || !dir) return documents;

	const factor = dir === "asc" ? 1 : -1;
	return [...documents].sort(
		(a, b) =>
			factor *
			sortValue(a, field, label).localeCompare(sortValue(b, field, label), locale, {
				sensitivity: "base",
				numeric: true,
			}),
	);
}
