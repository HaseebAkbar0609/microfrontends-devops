import type { SortDir } from "@/utils/tableSort";
import type { DeviationRow } from "./types";

/** Whether a row's visible text contains the search, ignoring case. A blank search matches everything. */
export function matchesQuery(texts: readonly string[], query: string): boolean {
	const needle = query.trim().toLowerCase();
	return !needle || texts.join(" ").toLowerCase().includes(needle);
}

/**
 * Rows in the order a sortable header asks for. Text compares in the app's
 * language and numerically ("Rum 9" before "Rum 10"); numbers and ranks as
 * numbers. With no sort the rows keep the order they were added in.
 */
export function sortRows<T>(rows: readonly T[], value: ((row: T) => string | number) | null, dir: SortDir, locale: string): T[] {
	if (!value || !dir) return [...rows];
	const factor = dir === "asc" ? 1 : -1;
	return [...rows].sort((a, b) => {
		const left = value(a);
		const right = value(b);
		const order =
			typeof left === "number" && typeof right === "number"
				? left - right
				: String(left).localeCompare(String(right), locale, { sensitivity: "base", numeric: true });
		return factor * order;
	});
}

/** The next deviation's number: one past the highest so far. */
export function nextDeviationNumber(rows: readonly DeviationRow[]): number {
	return rows.reduce((highest, row) => Math.max(highest, row.number), 0) + 1;
}
