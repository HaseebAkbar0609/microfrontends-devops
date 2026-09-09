/**
 * Currency formatting utility for ROT & RUT deduction calculations
 */
export function formatCurrency(amount: number, currency: string, lang = "sv"): string {
	const locale = lang === "sv" ? "sv-SE" : "en-US";
	return `${new Intl.NumberFormat(locale, {
		style: "decimal",
		maximumFractionDigits: 0,
	}).format(amount)} ${currency}`;
}
