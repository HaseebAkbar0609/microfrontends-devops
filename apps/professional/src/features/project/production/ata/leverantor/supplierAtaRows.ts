import type { SortDir } from "@/utils/tableSort";
import { ataTotal, padAtaNumber } from "../ataMath";
import { compact, compareText } from "../ataView";
import { ATA_STATUS_META } from "../projectAta.config";
import type { AtaAttested, SupplierAtaStatus } from "../types";
import type { SupplierAtaSortField } from "./supplierAta.config";
import type { SupplierAta, SupplierAtaRow } from "./types";

/** Labels in the reader's language, so search and sort read what the table shows. */
export interface SupplierAtaLabels {
	status: (status: SupplierAtaStatus) => string;
	attested: (attested: AtaAttested) => string;
	/** A customer ÄTA's name, "Äta 100". */
	customerAta: (number: number) => string;
}

/**
 * A selected supplier's rows. A link whose customer ÄTA no longer exists counts
 * as unlinked — the table never names an ÄTA that is not there.
 */
export function toSupplierAtaRows(atas: readonly SupplierAta[], customerNumbers: ReadonlyMap<string, number>): SupplierAtaRow[] {
	return atas.map((ata) => ({
		ata,
		amount: ataTotal(ata.lineItems),
		linkedNumber: ata.linkedCustomerAtaId ? (customerNumbers.get(ata.linkedCustomerAtaId) ?? null) : null,
	}));
}

export function matchesSupplierAta(
	row: SupplierAtaRow,
	filter: SupplierAtaStatus | null,
	query: string,
	labels: SupplierAtaLabels,
): boolean {
	if (filter && row.ata.status !== filter) return false;
	const needle = compact(query);
	if (!needle) return true;

	return [
		row.ata.createdDate,
		padAtaNumber(row.ata.number),
		row.linkedNumber === null ? "" : labels.customerAta(row.linkedNumber),
		String(row.amount),
		labels.status(row.ata.status),
		labels.attested(row.ata.attested),
		row.ata.attestDate,
	].some((value) => value && compact(value).includes(needle));
}

/**
 * Rows in header order: numbers as numbers, status in lifecycle order, text in
 * the app's language. An unlinked row and a missing attest date stay last
 * whichever way their column sorts.
 */
export function sortSupplierAtaRows(
	rows: SupplierAtaRow[],
	field: SupplierAtaSortField | null,
	dir: SortDir,
	labels: SupplierAtaLabels,
	locale: string,
): SupplierAtaRow[] {
	if (!field || !dir) return rows;
	const factor = dir === "asc" ? 1 : -1;

	return [...rows].sort((a, b) => {
		switch (field) {
			case "linked":
				if (a.linkedNumber === null || b.linkedNumber === null) {
					return a.linkedNumber === b.linkedNumber ? 0 : a.linkedNumber === null ? 1 : -1;
				}
				return factor * (a.linkedNumber - b.linkedNumber);
			case "attestDate":
				if (!a.ata.attestDate || !b.ata.attestDate) return compareText(a.ata.attestDate, b.ata.attestDate, locale);
				return factor * a.ata.attestDate.localeCompare(b.ata.attestDate);
			case "date":
				return factor * a.ata.createdDate.localeCompare(b.ata.createdDate);
			case "number":
				return factor * (a.ata.number - b.ata.number);
			case "amount":
				return factor * (a.amount - b.amount);
			case "status":
				return factor * (ATA_STATUS_META[a.ata.status].rank - ATA_STATUS_META[b.ata.status].rank);
			case "attested":
				return factor * compareText(labels.attested(a.ata.attested), labels.attested(b.ata.attested), locale);
		}
	});
}
