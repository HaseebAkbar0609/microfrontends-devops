import type { StaffLedgerItem } from "../types/staff.types";

/**
 * Formats a Swedish personal identity number to standard YYYY-MM-DD-XXXX format
 */
export function formatPersonNumber(pnr?: string): string {
	if (!pnr) return "-";
	const clean = pnr.replace(/[^\d]/g, "");
	if (clean.length === 12) {
		return `${clean.slice(0, 4)}-${clean.slice(4, 6)}-${clean.slice(6, 8)}-${clean.slice(8)}`;
	}
	if (clean.length === 10) {
		return `${clean.slice(0, 2)}-${clean.slice(2, 4)}-${clean.slice(4, 6)}-${clean.slice(6)}`;
	}
	return pnr;
}

/**
 * Extracts a unique list of suppliers/UEs from staff items
 */
export function extractUniqueSuppliers(items: StaffLedgerItem[]): string[] {
	const suppliers = new Set<string>();
	items.forEach((item) => {
		if (item.ue && item.ue.trim() !== "") {
			suppliers.add(item.ue.trim());
		}
	});
	return Array.from(suppliers).sort((a, b) => a.localeCompare(b, "sv"));
}
