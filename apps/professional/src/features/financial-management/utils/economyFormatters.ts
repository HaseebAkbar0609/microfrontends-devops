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

/**
 * A short figure for a chart axis or a note: "1,2 M SEK" for millions, "420 k
 * SEK" below that. Raw kronor on an axis are unreadable, and everything in
 * millions rounds a few hundred thousand away to nothing.
 */
export function formatSekCompact(amount: number): string {
	const round = (value: number, digits: number) =>
		new Intl.NumberFormat("sv-SE", { maximumFractionDigits: digits }).format(value);

	if (Math.abs(amount) >= 1_000_000) return `${round(amount / 1_000_000, 1)} M SEK`;
	if (Math.abs(amount) >= 1_000) return `${round(amount / 1_000, 0)} k SEK`;
	return formatSek(amount);
}
