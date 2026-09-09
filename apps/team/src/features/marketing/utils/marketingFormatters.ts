import {
	MARKETING_CURRENCY,
	MARKETING_LOCALE,
} from "../constants/marketing.constants";

/**
 * Formatters are constructed once at module scope rather than per cell, the
 * way `salesFormatters` and `supportFormatters` do it — a register table calls
 * these for every numeric cell on the page.
 */

const numberFormatter = new Intl.NumberFormat(MARKETING_LOCALE);

const currencyFormatter = new Intl.NumberFormat(MARKETING_LOCALE, {
	style: "currency",
	currency: MARKETING_CURRENCY,
	maximumFractionDigits: 0,
});

export function formatNumber(value: number): string {
	return numberFormatter.format(value);
}

export function formatCurrency(value: number): string {
	return currencyFormatter.format(value);
}

export function formatPercent(value: number): string {
	return `${numberFormatter.format(Math.round(value))} %`;
}
