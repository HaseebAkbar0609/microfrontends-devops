import type { PaymentOption } from "../types";

/**
 * Quarterly: 5% discount (multiply by 0.95 for 3 months).
 * Annual: 2 months free = 10 months price (multiply by 10/12).
 */
export function getPaymentMultiplier(option: PaymentOption): number {
	switch (option) {
		case "month":
			return 1;
		case "quarter":
			return 3 * 0.95;
		case "year":
			return 10;
		default:
			return 1;
	}
}

export function formatPrice(amount: number): string {
	// Round just in case, no dividing
	const rounded = Math.round(amount);
	return `${rounded} SEK`;
}
