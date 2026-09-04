/**
 * Centralized formatting utilities for Financial Management (Expenses & Invoices)
 * Standardizes number, currency, and percentage formatting across components.
 */

/**
 * Formats a number with Swedish locale number formatting (space thousands separator, comma decimal).
 * Defaults to 2 decimal places.
 */
export function formatNum(num: number, decimals = 2): string {
	if (isNaN(num) || num === null || num === undefined) {
		return "0,00";
	}
	return num.toLocaleString("sv-SE", {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
	});
}

/**
 * Formats a number as SEK amount.
 */
export function formatSEK(num: number): string {
	return `${formatNum(num)} SEK`;
}

/**
 * Formats a percentage value (e.g. 25 -> "25 %").
 */
export function formatPercent(num: number): string {
	if (isNaN(num) || num === null || num === undefined) {
		return "0 %";
	}
	return `${num} %`;
}
