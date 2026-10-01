import type {
	AccessListPage,
	AccessListParams,
	AccessPoint,
	AccessSortField,
} from "../types/access.types";

/**
 * Filter, sort and page the access rows. Pure and free of runtime imports, so
 * it can be tested on its own and replaced by a server query later without
 * touching the table.
 */

/** The text a column sorts by; "" means the row has no value there. */
function sortValue(row: AccessPoint, field: AccessSortField): string {
	switch (field) {
		case "assignedTo":
			return row.assignees[0] ?? "";
		case "objectRef":
			return row.objectRef ?? "";
		case "lastAssignedAt":
			return row.lastAssignedAt ?? "";
		default:
			return row[field];
	}
}

function matchesSearch(row: AccessPoint, needle: string): boolean {
	if (!needle) return true;
	return [row.idNumber, row.name, row.city, row.objectRef ?? ""].some((value) =>
		value.toLowerCase().includes(needle),
	);
}

/** Rows with no value in the sorted column go last in both directions. */
function compare(a: AccessPoint, b: AccessPoint, params: AccessListParams): number {
	if (!params.sortBy) return 0;
	const left = sortValue(a, params.sortBy);
	const right = sortValue(b, params.sortBy);
	if (!left && !right) return 0;
	if (!left) return 1;
	if (!right) return -1;
	const order = left.localeCompare(right, "sv", { numeric: true });
	return params.sortOrder === "asc" ? order : -order;
}

export function selectAccessPoints(rows: AccessPoint[], params: AccessListParams): AccessListPage {
	const needle = params.search.trim().toLowerCase();
	const matching = rows
		.filter((row) => !row.archived)
		.filter((row) => !params.status || row.status === params.status)
		.filter((row) => !params.type || row.type === params.type)
		.filter((row) => matchesSearch(row, needle))
		.sort((a, b) => compare(a, b, params)); // Array.sort is stable, so ties keep their order

	const totalPages = Math.max(1, Math.ceil(matching.length / params.pageSize));
	const page = Math.min(Math.max(1, params.page), totalPages);
	const start = (page - 1) * params.pageSize;
	return { rows: matching.slice(start, start + params.pageSize), totalItems: matching.length, page };
}

/** "2025-12-12T08:30:00" -> "2025-12-12 08:30". Sliced, not parsed, so no time zone can shift it. */
export function formatAssignedAt(value: string | null): string | null {
	return value ? `${value.slice(0, 10)} ${value.slice(11, 16)}` : null;
}
