/**
 * Standard Swedish currency and number formatting for Economy Module
 */
export function formatSek(amount: number): string {
	const formatted = new Intl.NumberFormat("sv-SE", {
		maximumFractionDigits: 0,
		minimumFractionDigits: 0,
	}).format(Math.round(amount));

	return `${formatted} SEK`;
}

export function formatSignedSek(amount: number): string {
	const prefix = amount > 0 ? "+" : amount < 0 ? "-" : "";
	const absFormatted = new Intl.NumberFormat("sv-SE", {
		maximumFractionDigits: 0,
		minimumFractionDigits: 0,
	}).format(Math.abs(Math.round(amount)));

	return `${prefix}${absFormatted} SEK`;
}

export function formatNumber(value: number): string {
	return new Intl.NumberFormat("sv-SE").format(value);
}

export function formatPercent(value: number, decimals: number = 1): string {
	return `${value.toFixed(decimals)} %`;
}

export function formatHours(hours: number): string {
	return `${formatNumber(Math.round(hours))} h`;
}

/** Hours with their sign, written with the minus sign (−) as the Prognos frame does. */
export function formatSignedHours(hours: number): string {
	const prefix = hours > 0 ? "+" : hours < 0 ? "−" : "";
	return `${prefix}${formatHours(Math.abs(hours))}`;
}
