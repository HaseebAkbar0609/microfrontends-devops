import { MONTHS_COUNT } from "../constants/budget.constants";
import type { BudgetLineItem } from "../types/budget.types";
import { generateSecureId } from "./cryptoUtils";

/** Twelve zeroed months, the shape every budget row carries. */
export function emptyMonths(): Record<number, number> {
	const months: Record<number, number> = {};
	for (let month = 0; month < MONTHS_COUNT; month++) {
		months[month] = 0;
	}
	return months;
}

/**
 * A blank row. A create form opens on one of these rather than on somebody's
 * sample figures, and Ny rad adds the same thing.
 */
export function emptyBudgetRow(): BudgetLineItem {
	return {
		id: generateSecureId("row"),
		konto: "",
		kontoName: "",
		kostnadsstalle: "",
		arsbudget: 0,
		fordelning: 0,
		procent: 0,
		months: emptyMonths(),
	};
}
