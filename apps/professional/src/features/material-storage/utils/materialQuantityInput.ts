import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { MATERIAL_DISCRETE_UNITS } from "../constants/materialStorage.constants";
import type { MaterialUnit } from "../types/materialStorage.types";
import { parseDecimalInput } from "./materialStockChanges";

/** A typed quantity that can be used: a number above 0, or null. */
export function typedQuantity(text: string): number | null {
	const quantity = parseDecimalInput(text);
	return quantity !== null && quantity > 0 ? quantity : null;
}

/**
 * The quantity rules the stock dialogs share: above 0, and whole for counted
 * units. An empty field is only an error when a quantity is required.
 */
export function quantityInputError(
	text: string,
	unit: MaterialUnit | undefined,
	required: boolean,
): TranslationKeys | null {
	if (!text.trim()) return required ? localizationConstants.materialErrorQuantityRequired : null;
	const quantity = typedQuantity(text);
	if (quantity === null) return localizationConstants.materialErrorQuantityInvalid;
	if (unit && MATERIAL_DISCRETE_UNITS.includes(unit) && !Number.isInteger(quantity))
		return localizationConstants.materialErrorQuantityWhole;
	return null;
}
