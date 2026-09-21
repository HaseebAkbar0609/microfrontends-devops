import type { SortDir } from "@/utils/tableSort";
import { PROTOCOL_ARCHIVED_FILTER, type ProtocolSortField } from "./projectProtocol.config";
import type { MeetingProtocol, ProjectProtocol, ProtocolType } from "./types";

/** Turns a type code into the reader's label. */
export type ProtocolTypeLabel = (type: ProtocolType) => string;

/** A Standard protocol, whose Visa detaljer opens its meeting rather than a PDF. */
export function hasMeeting(row: ProjectProtocol): row is MeetingProtocol {
	return row.meeting !== undefined;
}

/**
 * Whether a row belongs in the list as filtered and searched.
 *
 * No filter and a type filter both show active rows; the archived filter shows
 * archived rows only, so Arkivera takes a row out of the list and Arkiverade
 * is where it can be restored — as Besiktning does. Search reads what the
 * reader sees, plus the Benämning the menus name the row by.
 */
export function matchesProtocol(
	row: ProjectProtocol,
	filter: string | null,
	query: string,
	typeLabel: ProtocolTypeLabel,
): boolean {
	if (filter === PROTOCOL_ARCHIVED_FILTER) {
		if (!row.archived) return false;
	} else if (row.archived || (filter !== null && row.type !== filter)) {
		return false;
	}

	const needle = query.trim().toLowerCase();
	if (!needle) return true;

	return [row.date, typeLabel(row.type), row.name, row.fileName ?? ""].join(" ").toLowerCase().includes(needle);
}

function sortValue(row: ProjectProtocol, field: ProtocolSortField, typeLabel: ProtocolTypeLabel): string {
	switch (field) {
		case "date":
			return row.date;
		case "type":
			return typeLabel(row.type);
		case "file":
			return row.fileName ?? "";
	}
}

/**
 * Rows in header order. Typ sorts by its label, so it is alphabetical in
 * either language; PDF by the file's name, and a protocol with no PDF sorts
 * last in both directions. Both compare in the app's language, so Swedish å, ä
 * and ö sort after z. With no sort the store's order — newest first — stands.
 */
export function sortProtocols(
	rows: ProjectProtocol[],
	field: ProtocolSortField | null,
	dir: SortDir,
	typeLabel: ProtocolTypeLabel,
	locale: string,
): ProjectProtocol[] {
	if (!field || !dir) return rows;

	const factor = dir === "asc" ? 1 : -1;
	return [...rows].sort((a, b) => {
		const left = sortValue(a, field, typeLabel);
		const right = sortValue(b, field, typeLabel);
		if (!left || !right) return left === right ? 0 : left ? -1 : 1;
		return factor * left.localeCompare(right, locale, { sensitivity: "base", numeric: true });
	});
}
