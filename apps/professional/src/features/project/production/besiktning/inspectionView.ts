import type { SortDir } from "@/utils/tableSort";
import { INSPECTION_ARCHIVED_FILTER, type InspectionSortField } from "./projectInspection.config";
import type { InspectionType, ProjectInspection } from "./types";

/** Turns a type code into the reader's label. */
export type InspectionTypeLabel = (type: InspectionType) => string;

/**
 * Whether a row belongs in the list as filtered and searched.
 *
 * No filter and a type filter both show active rows; the archived filter shows
 * archived rows only, so Arkivera takes a row out of the list and Arkiverade
 * is where it can be restored. Search reads what the reader sees: both dates,
 * the translated type and every file name.
 */
export function matchesInspection(
	row: ProjectInspection,
	filter: string | null,
	query: string,
	typeLabel: InspectionTypeLabel,
): boolean {
	if (filter === INSPECTION_ARCHIVED_FILTER) {
		if (!row.archived) return false;
	} else if (row.archived || (filter !== null && row.type !== filter)) {
		return false;
	}

	const needle = query.trim().toLowerCase();
	if (!needle) return true;

	return [row.date, row.inspectionDate, typeLabel(row.type), ...row.documents.map((doc) => doc.name)]
		.join(" ")
		.toLowerCase()
		.includes(needle);
}

function sortValue(row: ProjectInspection, field: InspectionSortField, typeLabel: InspectionTypeLabel): string {
	switch (field) {
		case "date":
			return row.date;
		case "inspectionDate":
			return row.inspectionDate;
		case "type":
			return typeLabel(row.type);
		case "document":
			return row.documents[0]?.name ?? "";
	}
}

/**
 * Rows in header order. Typ sorts by its label, so it is alphabetical in either
 * language; PDF by the first file's name. Both compare in the app's language,
 * not the browser's, so Swedish å, ä and ö sort after z. Blank values — no
 * Besiktningsdatum, no file — sort last in both directions. With no sort the
 * store's order (newest Datum first) stands.
 */
export function sortInspections(
	rows: ProjectInspection[],
	field: InspectionSortField | null,
	dir: SortDir,
	typeLabel: InspectionTypeLabel,
	locale: string,
): ProjectInspection[] {
	if (!field || !dir) return rows;

	const factor = dir === "asc" ? 1 : -1;
	return [...rows].sort((a, b) => {
		const left = sortValue(a, field, typeLabel);
		const right = sortValue(b, field, typeLabel);
		if (!left || !right) return left === right ? 0 : left ? -1 : 1;
		return factor * left.localeCompare(right, locale, { sensitivity: "base", numeric: true });
	});
}

/** How a row is named to a screen reader and in the delete confirm. */
export function inspectionLabel(row: ProjectInspection, typeLabel: InspectionTypeLabel): string {
	return `${typeLabel(row.type)} ${row.date}`;
}
