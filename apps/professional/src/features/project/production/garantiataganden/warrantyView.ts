import type { SortDir } from "@/utils/tableSort";
import type { WarrantySortField } from "./projectWarranty.config";
import type { WarrantyCommitment } from "./types";

/** The years the rows themselves carry, newest first — what Filter offers. */
export function yearsOf(rows: readonly WarrantyCommitment[]): string[] {
	return [...new Set(rows.map((row) => row.date.slice(0, 4)))].sort((a, b) => b.localeCompare(a));
}

/**
 * Whether a row belongs in the list as filtered and searched. Filter is by
 * year, drawn from the rows, so the list never needs today's date. Search reads
 * what the reader sees: the day and the name.
 */
export function matchesCommitment(row: WarrantyCommitment, filter: string | null, query: string): boolean {
	if (filter !== null && !row.date.startsWith(filter)) return false;

	const needle = query.trim().toLowerCase();
	return !needle || `${row.date} ${row.name}`.toLowerCase().includes(needle);
}

/**
 * Rows in header order. Benämning compares in the app's language and
 * numerically, so "Garantibesiktning 2" comes before "Garantibesiktning 10".
 * With no sort the store's order — newest day first — stands.
 */
export function sortCommitments(
	rows: WarrantyCommitment[],
	field: WarrantySortField | null,
	dir: SortDir,
	locale: string,
): WarrantyCommitment[] {
	if (!field || !dir) return rows;

	const factor = dir === "asc" ? 1 : -1;
	return [...rows].sort((a, b) => factor * a[field].localeCompare(b[field], locale, { sensitivity: "base", numeric: true }));
}
