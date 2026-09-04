export function formatSEK(val: number): string {
	return new Intl.NumberFormat("sv-SE", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	}).format(val || 0);
}
