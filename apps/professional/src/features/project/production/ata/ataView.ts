import type { SortDir } from "@/utils/tableSort";
import { padAtaNumber } from "./ataMath";
import { ATA_STATUS_META, type AtaListSortField } from "./projectAta.config";
import type { AtaAttested, AtaStatus, ProjectAta } from "./types";

/** A list row: the ÄTA with the figures the table shows. */
export interface AtaListRow {
	ata: ProjectAta;
	amount: number;
	linked: string;
}

/** Labels in the reader's language, so search and sort read what the table shows. */
export interface AtaLabels {
	status: (status: AtaStatus) => string;
	attested: (attested: AtaAttested) => string;
	number: (number: number) => string;
}

/** A supplier ÄTA's link to a customer ÄTA, as the kund list reads it. */
export interface SupplierAtaLinkRef {
	customerAtaId: string;
	supplierName: string;
	number: number;
}

/**
 * Each customer ÄTA's "Kopplad Lev-äta", from the supplier ÄTAs that link to
 * it: "Pelle Målare 001", or "Pelle Målare 001 +1" when more than one does.
 * The link is stored once, on the supplier ÄTA, so the two lists cannot
 * disagree. `links` arrive in the supplier store's order; the first names the cell.
 */
export function linkedLabels(
	links: readonly SupplierAtaLinkRef[],
	more: (label: string, count: number) => string,
): Map<string, string> {
	const grouped = new Map<string, SupplierAtaLinkRef[]>();
	for (const link of links) {
		grouped.set(link.customerAtaId, [...(grouped.get(link.customerAtaId) ?? []), link]);
	}
	return new Map(
		Array.from(grouped, ([customerAtaId, refs]) => {
			const label = `${refs[0].supplierName} ${padAtaNumber(refs[0].number)}`;
			return [customerAtaId, refs.length > 1 ? more(label, refs.length - 1) : label];
		}),
	);
}

/* Whitespace is dropped on both sides: amounts render with a (non-breaking)
   thousands space, and a reader typing "158 680" should still find 158680. */
export const compact = (value: string) => value.replace(/\s/g, "").toLocaleLowerCase();

export function matchesAta(
	row: AtaListRow,
	filter: AtaStatus | null,
	query: string,
	labels: AtaLabels,
): boolean {
	if (filter && row.ata.status !== filter) return false;

	const needle = compact(query);
	if (!needle) return true;

	return [
		row.ata.createdDate,
		String(row.ata.number),
		labels.number(row.ata.number),
		row.linked,
		String(row.amount),
		labels.status(row.ata.status),
		labels.attested(row.ata.attested),
	].some((value) => compact(value).includes(needle));
}

export function compareText(left: string, right: string, locale: string): number {
	if (!left || !right) return left === right ? 0 : left ? -1 : 1;
	return left.localeCompare(right, locale, { sensitivity: "base", numeric: true });
}

/**
 * Rows in header order. Numbers compare as numbers, status in lifecycle order
 * (Utkast, Förhandling, OK, Redovisad), text in the app's language with blanks
 * last. With no sort the store's order (ÄTA number) stands.
 */
export function sortAtaRows(
	rows: AtaListRow[],
	field: AtaListSortField | null,
	dir: SortDir,
	labels: AtaLabels,
	locale: string,
): AtaListRow[] {
	if (!field || !dir) return rows;
	const factor = dir === "asc" ? 1 : -1;

	const compare = (a: AtaListRow, b: AtaListRow): number => {
		switch (field) {
			case "date":
				return a.ata.createdDate.localeCompare(b.ata.createdDate);
			case "number":
				return a.ata.number - b.ata.number;
			case "amount":
				return a.amount - b.amount;
			case "status":
				return ATA_STATUS_META[a.ata.status].rank - ATA_STATUS_META[b.ata.status].rank;
			case "attested":
				return compareText(labels.attested(a.ata.attested), labels.attested(b.ata.attested), locale);
			case "linked":
				return compareText(a.linked, b.linked, locale);
		}
	};

	return [...rows].sort((a, b) => {
		/* Blank linked cells stay last whichever way the column sorts. */
		if (field === "linked" && (!a.linked || !b.linked)) return compareText(a.linked, b.linked, locale);
		return factor * compare(a, b);
	});
}
