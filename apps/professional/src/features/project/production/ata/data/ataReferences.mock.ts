import type { AtaReferenceOption } from "../types";

/**
 * The supplier invoices and time reports an ÄTA can refer to, per project.
 *
 * Neither register exists on the project record yet, so these stand in for
 * them. The labels are data — an invoice number and its supplier, a week and
 * its person — not UI copy.
 */
export const SEEDED_SUPPLIER_INVOICES: Record<string, AtaReferenceOption[]> = {
	"5001": [
		{ id: "inv-5001-001", label: "Faktura 001 · Pelle Målare" },
		{ id: "inv-5001-002", label: "Faktura 002 · Pelle Målare" },
		{ id: "inv-5001-017", label: "Faktura 017 · Rörmokare" },
		{ id: "inv-5001-118", label: "Faktura 118 · Elektriker AB" },
	],
	"5000": [{ id: "inv-5000-004", label: "Faktura 004 · Beijer Byggmaterial" }],
};

export const SEEDED_TIME_REPORTS: Record<string, AtaReferenceOption[]> = {
	"5001": [
		{ id: "tr-5001-01", label: "Tidrapport v.27 · Alex Miller" },
		{ id: "tr-5001-02", label: "Tidrapport v.28 · Alex Miller" },
		{ id: "tr-5001-03", label: "Tidrapport v.28 · Sara Lind" },
	],
	"5000": [{ id: "tr-5000-01", label: "Tidrapport v.29 · Johan Berg" }],
};
