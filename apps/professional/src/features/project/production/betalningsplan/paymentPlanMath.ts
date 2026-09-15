import type { PaymentAconto, PaymentTerms } from "./types";

/** Percent to fraction, kept as a named constant (rule 1). */
const PERCENT = 100;

/**
 * The most the plan may retain in total — "Belopp innehållet totalt".
 *
 * Rounded once, here, where a percentage first becomes kronor; every other sum
 * adds integers.
 */
export function retentionCap(terms: PaymentTerms): number {
	return Math.round((terms.contractSum * terms.retentionTotalPercent) / PERCENT);
}

/**
 * What to hold back from an aconto of `amount`.
 *
 * The per-aconto rule — a fixed amount when one is set, otherwise the
 * percentage — limited three ways: never below zero, never more than the
 * aconto itself, and never past the plan's ceiling once the other acontos'
 * retention is counted.
 *
 * @param retainedElsewhere retention already held on the plan's other rows.
 */
export function retainedFor(
	amount: number,
	terms: PaymentTerms,
	retainedElsewhere: number,
): number {
	const perAconto =
		terms.retentionFixedAmount > 0
			? terms.retentionFixedAmount
			: Math.round((amount * terms.retentionPerAcontoPercent) / PERCENT);
	const room = Math.max(0, retentionCap(terms) - retainedElsewhere);

	return Math.max(0, Math.min(perAconto, amount, room));
}

/**
 * Retention for every row, worked out again from the terms.
 *
 * Invoiced rows keep what they retained — that money has already been billed.
 * The rest are recalculated in date order against the ceiling that remains, so
 * adding, editing or removing a row, or changing the terms, can never push the
 * plan past "Belopp innehållet totalt". Row order is preserved.
 */
export function recomputeRetention(
	acontos: PaymentAconto[],
	terms: PaymentTerms,
): PaymentAconto[] {
	let held = acontos
		.filter((aconto) => aconto.invoicedDate)
		.reduce((sum, aconto) => sum + aconto.retained, 0);

	const next = new Map<string, number>();
	[...acontos]
		.filter((aconto) => !aconto.invoicedDate)
		.sort((a, b) => a.date.localeCompare(b.date))
		.forEach((aconto) => {
			const retained = retainedFor(aconto.amount, terms, held);
			next.set(aconto.id, retained);
			held += retained;
		});

	return acontos.map((aconto) =>
		next.has(aconto.id) && next.get(aconto.id) !== aconto.retained
			? { ...aconto, retained: next.get(aconto.id) ?? 0 }
			: aconto,
	);
}

/**
 * A deduction as the frame prints it: negative, but 0 rather than −0, which
 * `Intl.NumberFormat` would otherwise render with a minus sign.
 */
export function deduction(amount: number): number {
	return amount === 0 ? 0 : -amount;
}

/** "Att erhålla" — what the aconto pays out. */
export function toReceive(aconto: Pick<PaymentAconto, "amount" | "retained">): number {
	return aconto.amount - aconto.retained;
}

/**
 * What a row being added or edited would retain, for the dialog's preview.
 *
 * Runs the same recalculation the save does over the list with the candidate
 * in place, so the preview and the stored figure cannot disagree.
 */
export function previewRetention(
	acontos: PaymentAconto[],
	terms: PaymentTerms,
	candidate: Pick<PaymentAconto, "id" | "date" | "amount">,
): number {
	const exists = acontos.some((aconto) => aconto.id === candidate.id);
	const row: PaymentAconto = {
		activity: "",
		lift: "",
		retained: 0,
		paid: false,
		...acontos.find((aconto) => aconto.id === candidate.id),
		...candidate,
	};
	const list = exists
		? acontos.map((aconto) => (aconto.id === candidate.id ? row : aconto))
		: [...acontos, row];

	return (
		recomputeRetention(list, terms).find((aconto) => aconto.id === candidate.id)
			?.retained ?? 0
	);
}

export interface PaymentPlanSummary {
	/** Skickat — paid out on invoiced rows. */
	sent: number;
	/** Kvar att skicka, drawn as a deduction. */
	remaining: number;
	/** Innehållna medel on invoiced rows, drawn as a deduction. */
	retained: number;
	/** Totalt — the contract sum. */
	total: number;
}

/**
 * The summary box under the aconto table.
 *
 * Follows the frame's own figures: with a 5 000 000 kr contract and one
 * invoiced aconto of 500 000 retaining 50 000, it prints Skickat 450 000,
 * Kvar att skicka −4 550 000, Innehållna medel −50 000 and Totalt 5 000 000.
 * The two deductions keep the frame's minus sign; what "Kvar att skicka" should
 * mean commercially is flagged on the ticket.
 */
export function summarise(
	acontos: PaymentAconto[],
	terms: PaymentTerms,
): PaymentPlanSummary {
	const invoiced = acontos.filter((aconto) => aconto.invoicedDate);
	const sent = invoiced.reduce((sum, aconto) => sum + toReceive(aconto), 0);
	const retained = invoiced.reduce((sum, aconto) => sum + aconto.retained, 0);

	return {
		sent,
		remaining: deduction(terms.contractSum - sent),
		retained: deduction(retained),
		total: terms.contractSum,
	};
}

/**
 * "10.000" or "5 000 000 kr" → 10000 / 5000000.
 *
 * The project list stores its contract sum as display text with a thousands
 * separator; a plan needs the number. Anything that is not a whole number reads
 * as 0 rather than NaN.
 */
export function parseKronor(text: string): number {
	const digits = text.replace(/[^\d-]/g, "");
	const value = Number.parseInt(digits, 10);
	return Number.isFinite(value) ? value : 0;
}
