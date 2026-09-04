import {
	MS_PER_DAY,
	SALES_CURRENCY,
	SALES_LOCALE,
	SALES_REFERENCE_DATE,
} from "../constants/sales.constants";
import type { SalesCompany } from "../types";

const currencyFormatter = new Intl.NumberFormat(SALES_LOCALE, {
	style: "currency",
	currency: SALES_CURRENCY,
	maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat(SALES_LOCALE, {
	year: "numeric",
	month: "2-digit",
	day: "2-digit",
});

export const EMPTY_VALUE_PLACEHOLDER = "—";

/** Formats an amount as whole Swedish kronor. */
export function formatCurrency(amount: number): string {
	return currencyFormatter.format(amount);
}

/** Formats an ISO string as a short date, or a dash when absent. */
export function formatDate(iso: string): string {
	if (!iso) return EMPTY_VALUE_PLACEHOLDER;
	const parsed = new Date(iso);
	if (Number.isNaN(parsed.getTime())) return EMPTY_VALUE_PLACEHOLDER;
	return dateFormatter.format(parsed);
}

/**
 * Whole days between the reference date and `iso`. Negative once the date has
 * passed.
 */
export function daysUntil(iso: string): number {
	const target = new Date(iso).getTime();
	if (Number.isNaN(target)) return 0;
	const reference = new Date(SALES_REFERENCE_DATE).getTime();
	return Math.ceil((target - reference) / MS_PER_DAY);
}

/** The amount actually invoiced to a company, if any. */
export function getInvoicedAmount(company: SalesCompany): number {
	if (!company.payment) return 0;
	return company.payment.amount || company.quote?.firstInvoice || 0;
}

/** Case- and accent-insensitive comparison used by every sortable column. */
export function compareText(a: string, b: string): number {
	return a.localeCompare(b, undefined, {
		sensitivity: "base",
		numeric: true,
	});
}
