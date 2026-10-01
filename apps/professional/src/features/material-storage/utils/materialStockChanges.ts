import type { MaterialStockEntry } from "../types/materialStorage.types";

// Only type imports here: tests/material-stock-changes.test.cjs runs this file on its own.

/** Keeps sums like 0.1 + 0.2 from drifting; quantities never need more than three decimals. */
const roundQuantity = (value: number) => Math.round(value * 1000) / 1000;

/**
 * Reads a number typed in either language: "82,50", "82.50", "1 150".
 * Returns null for anything that is not a plain non-negative decimal.
 */
export function parseDecimalInput(value: string): number | null {
	const normalized = value.replace(/[\s  ]/g, "").replace(",", ".");
	if (!/^\d+(\.\d+)?$/.test(normalized)) return null;
	return Number(normalized);
}

/** What can be taken out: the stock on the shelf that is not reserved. */
export const availableStock = (entry: Pick<MaterialStockEntry, "inStock" | "reserved">) =>
	Math.max(roundQuantity(entry.inStock - entry.reserved), 0);

/** Adds a received quantity to a depot's stock, adding the article to the depot if it did not carry it. */
export function applyReceipt(
	entries: MaterialStockEntry[],
	articleId: string,
	depotId: string,
	quantity: number,
): MaterialStockEntry[] {
	let found = false;
	const next = entries.map((entry) => {
		if (entry.articleId !== articleId || entry.depotId !== depotId) return entry;
		found = true;
		return { ...entry, inStock: roundQuantity(entry.inStock + quantity) };
	});
	return found ? next : [...next, { articleId, depotId, inStock: roundQuantity(quantity), reserved: 0 }];
}

/**
 * Takes a quantity out of a depot's stock. Reserved stock is held for other
 * work, so only the available part can go; asking for more throws.
 */
export function applyWithdrawal(
	entries: MaterialStockEntry[],
	articleId: string,
	depotId: string,
	quantity: number,
): MaterialStockEntry[] {
	const entry = entries.find((candidate) => candidate.articleId === articleId && candidate.depotId === depotId);
	if (!entry || quantity > availableStock(entry)) throw new Error("Not enough available stock");
	return entries.map((candidate) =>
		candidate === entry ? { ...entry, inStock: roundQuantity(entry.inStock - quantity) } : candidate,
	);
}

/** "INL", 2026, 7 → "INL-2026-0007" */
export function formatTransactionReference(prefix: string, year: number, sequence: number): string {
	return `${prefix}-${year}-${String(sequence).padStart(4, "0")}`;
}
