import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// export function formatCurrency(value: number, currency: string = "SEK") {
// 	return value.toLocaleString("sv-SE", {
// 		style: "currency",
// 		currency,
// 		currencyDisplay: "code",
// 	});
// }

export function formatOptions(
	data: { id: string; name: string }[],
): { value: string; label: string }[] {
	return data.map((item) => ({
		value: item.id.toString(),
		label: item.name,
	}));
}

// export function formatCurrency(
// 	value: number | string,
// 	currency: string = "SEK",
// ): string {
// 	// Convert value to string and remove comma
// 	const cleanValue = String(value).replace(",", "");
// 	return `${cleanValue} ${currency}`;
// }

export function formatCurrency(
	value: number,
	currency: string = "SEK",
): string {
	// Remove the decimal point by multiplying by 100
	const amount = Math.round(value * 100);
	return `${amount} ${currency}`;
}
