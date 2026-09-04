import { getQuoteTermMeta } from "../constants/quoteModules";
import { MONTHS_PER_YEAR } from "../constants/sales.constants";
import type {
	QuoteLine,
	QuoteModuleRow,
	QuoteTermId,
	QuoteTotals,
} from "../types";

function toQuoteLine(row: QuoteModuleRow): QuoteLine {
	const quantity = Math.max(0, row.quantity);
	const amount = row.price * quantity;
	return {
		id: row.id,
		name: row.name,
		description: row.description,
		quantity,
		price: row.price,
		unit: row.unit,
		amount,
	};
}

/**
 * Prices a quote from its selected rows.
 *
 * Discounts stack in a fixed order: the payment-term discount comes off the
 * monthly gross first, then any extra discount is taken off what remains.
 * One-time lines are excluded from the recurring cost and added to the first
 * invoice only.
 */
export function calculateQuoteTotals(
	rows: QuoteModuleRow[],
	termId: QuoteTermId,
	extraDiscountPercent: number,
): QuoteTotals {
	const term = getQuoteTermMeta(termId);
	const lines = rows.filter((row) => row.selected).map(toQuoteLine);

	const monthlyGross = lines.reduce(
		(total, line) => (line.unit === "oneTime" ? total : total + line.amount),
		0,
	);
	const oneTimeTotal = lines.reduce(
		(total, line) => (line.unit === "oneTime" ? total + line.amount : total),
		0,
	);

	const termDiscountAmount = monthlyGross * term.discount;
	const afterTermDiscount = monthlyGross - termDiscountAmount;
	const extraDiscountAmount = afterTermDiscount * (extraDiscountPercent / 100);
	const monthlyNet = afterTermDiscount - extraDiscountAmount;
	const amountPerInvoice = monthlyNet * term.months;

	return {
		lines,
		monthlyGross,
		termDiscountAmount,
		extraDiscountAmount,
		monthlyNet,
		oneTimeTotal,
		periodMonths: term.months,
		amountPerInvoice,
		firstInvoice: amountPerInvoice + oneTimeTotal,
		annualCost: monthlyNet * MONTHS_PER_YEAR,
	};
}
