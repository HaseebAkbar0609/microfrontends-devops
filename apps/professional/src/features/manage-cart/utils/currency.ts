export function formatCartCurrencyFromOre(
	amountOre: number,
	currency = "SEK",
): string {
	const amount = amountOre / 100;
	return new Intl.NumberFormat(undefined, {
		style: "currency",
		currency,
		currencyDisplay: "code",
		minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
		maximumFractionDigits: 2,
	}).format(amount);
}
