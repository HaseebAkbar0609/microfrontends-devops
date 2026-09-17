import type { SortDir } from "@/utils/tableSort";
import { ataTotal } from "../ataMath";
import { compact } from "../ataView";
import { SUPPLIER_ATA_BUCKET, type SupplierGroupSortField } from "./supplierAta.config";
import type { AtaSupplier, SupplierAta, SupplierGroupRow } from "./types";

/**
 * The grouped table's rows: one per supplier, with its ÄTAs' total and how many
 * are approved (OK, Redovisad), in review (Förhandling) and not approved
 * (Ej granskad). Suppliers keep the registry's order.
 */
export function groupSupplierAtas(suppliers: readonly AtaSupplier[], atas: readonly SupplierAta[]): SupplierGroupRow[] {
	return suppliers.map((supplier) => {
		const own = atas.filter((ata) => ata.supplierId === supplier.id);
		const row: SupplierGroupRow = { supplier, total: 0, count: own.length, approved: 0, inReview: 0, notApproved: 0 };
		for (const ata of own) {
			row.total += ataTotal(ata.lineItems);
			row[SUPPLIER_ATA_BUCKET[ata.status]] += 1;
		}
		return row;
	});
}

/** Search reads the company name and its total, whitespace ignored ("158 680"). */
export function matchesSupplierGroup(row: SupplierGroupRow, query: string): boolean {
	const needle = compact(query);
	return !needle || [row.supplier.name, String(row.total)].some((value) => compact(value).includes(needle));
}

export function sortSupplierGroups(
	rows: SupplierGroupRow[],
	field: SupplierGroupSortField | null,
	dir: SortDir,
	locale: string,
): SupplierGroupRow[] {
	if (!field || !dir) return rows;
	const factor = dir === "asc" ? 1 : -1;
	return [...rows].sort((a, b) =>
		factor *
		(field === "name"
			? a.supplier.name.localeCompare(b.supplier.name, locale, { sensitivity: "base" })
			: a[field] - b[field]),
	);
}
