import { ATA_COUNT_DIGITS, ATA_SECTIONS, ATA_SUPPLIER_NUMBER_DIGITS } from "./projectAta.config";
import type { AtaLineItem, AtaLineItems } from "./types";

/**
 * An ÄTA's money, derived from its rows — never stored, so the tables, the
 * rail and the list cannot disagree.
 *
 * Per row, in whole kronor:
 *   Nettosumma   = Antal × Nettopris
 *   Belopp       = Nettosumma plus påslag %
 *   arvode       = Belopp − Nettosumma        (summed as "Varav arvode")
 *   A-pris/enhet = Belopp ÷ Antal
 * e.g. 40 tim × 650 kr at 10 % → Nettosumma 26 000, Belopp 28 600,
 * arvode 2 600, A-pris 715. %2 is shown as entered and stays out of the maths.
 *
 * Quantities carry at most two decimals, so they are scaled to integers before
 * multiplying; nothing accumulates floating-point drift.
 */

const PERCENT = 100;
const QUANTITY_SCALE = 100;

export function netSum(quantity: number, netPrice: number): number {
	return Math.round((Math.round(quantity * QUANTITY_SCALE) * netPrice) / QUANTITY_SCALE);
}

export function lineAmount(net: number, markupPercent: number): number {
	return Math.round((net * (PERCENT + markupPercent)) / PERCENT);
}

export interface LineFigures {
	netSum: number;
	amount: number;
	fee: number;
	unitPrice: number;
}

export function lineFigures(item: Pick<AtaLineItem, "quantity" | "netPrice" | "markupPercent">): LineFigures {
	const net = netSum(item.quantity, item.netPrice);
	const amount = lineAmount(net, item.markupPercent);
	return {
		netSum: net,
		amount,
		fee: amount - net,
		unitPrice: item.quantity > 0 ? Math.round(amount / item.quantity) : 0,
	};
}

export function sectionTotals(items: readonly AtaLineItem[]): { amount: number; fee: number } {
	return items.reduce(
		(total, item) => {
			const figures = lineFigures(item);
			return { amount: total.amount + figures.amount, fee: total.fee + figures.fee };
		},
		{ amount: 0, fee: 0 },
	);
}

/** "Egen personal": the people on the staff rows, counted once each. */
export function distinctPeople(items: readonly AtaLineItem[]): number {
	return new Set(
		items.map((item) => item.party.trim().toLocaleLowerCase()).filter((name) => name.length > 0),
	).size;
}

export function padCount(count: number): string {
	return String(count).padStart(ATA_COUNT_DIGITS, "0");
}

/** A supplier ÄTA's number as its sender writes it: 1 → "001". */
export function padAtaNumber(number: number): string {
	return String(number).padStart(ATA_SUPPLIER_NUMBER_DIGITS, "0");
}

export interface AtaSummaryFigures {
	staffCount: number;
	material: number;
	machines: number;
	ue: number;
	supplierAta: number;
}

/** The rail's figures. */
export function ataSummary(lineItems: AtaLineItems): AtaSummaryFigures {
	return {
		staffCount: distinctPeople(lineItems.staff),
		material: sectionTotals(lineItems.material).amount,
		machines: sectionTotals(lineItems.machines).amount,
		ue: sectionTotals(lineItems.ue).amount,
		supplierAta: sectionTotals(lineItems.supplierAta).amount,
	};
}

/** The list's Belopp: every section's rows, staff included. */
export function ataTotal(lineItems: AtaLineItems): number {
	return ATA_SECTIONS.reduce((total, section) => total + sectionTotals(lineItems[section]).amount, 0);
}

export function hasLineItems(lineItems: AtaLineItems): boolean {
	return ATA_SECTIONS.some((section) => lineItems[section].length > 0);
}

/** "7,5" or "7.5" → 7.5; anything that is not above 0 with at most two decimals → `null`. */
export function parseQuantity(value: string): number | null {
	const normalised = value.trim().replace(",", ".");
	if (!/^\d+(\.\d{1,2})?$/.test(normalised)) return null;
	const quantity = Number(normalised);
	return quantity > 0 ? quantity : null;
}

/** Whole kronor, spaces allowed as thousand separators ("158 680"); otherwise `null`. */
export function parseWholeKronor(value: string): number | null {
	const normalised = value.replace(/\s/g, "");
	return /^\d+$/.test(normalised) ? Number(normalised) : null;
}
