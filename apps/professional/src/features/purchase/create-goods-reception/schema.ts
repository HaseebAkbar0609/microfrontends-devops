import { z } from "zod";

import localizationConstants from "@/utils/translation/constants";

/**
 * The ticket's mandatory fields — Item Name, Category and Unit Price — plus the
 * purchase order the frame's first card selects.
 *
 * Messages are translation keys, resolved where they are rendered.
 */
export const goodsReceptionSchema = z.object({
	purchaseNo: z
		.string()
		.trim()
		.min(1, localizationConstants.purchaseGoodsReceptionValidationRequired),
	name: z
		.string()
		.trim()
		.min(1, localizationConstants.purchaseGoodsReceptionValidationRequired)
		.max(120),
	description: z.string().trim().max(500).default(""),
	category: z.enum(["spare_parts", "raw_materials", "machinery"], {
		errorMap: () => ({
			message:
				localizationConstants.purchaseGoodsReceptionValidationRequired,
		}),
	}),
	sku: z.string().trim().max(64).default(""),
	supplier: z
		.string()
		.trim()
		.min(1, localizationConstants.purchaseGoodsReceptionValidationRequired)
		.max(120),
	object: z.string().trim().max(120).default(""),
	expectedDelivery: z.string().trim().default(""),
	orderType: z
		.enum(["normal", "partial", "backorder"])
		.default("normal"),
	/**
	 * Held as a string because it comes from a text input; parsed here so an
	 * empty or non-numeric value fails validation instead of becoming NaN.
	 */
	unitPrice: z
		.string()
		.trim()
		.refine(
			(value) => Number.isFinite(Number(value)) && Number(value) > 0,
			localizationConstants.purchaseGoodsValidationPositive,
		),
	leadTimeDays: z
		.string()
		.trim()
		.refine(
			(value) =>
				value === "" ||
				(Number.isInteger(Number(value)) && Number(value) >= 0),
			localizationConstants.purchaseGoodsValidationPositive,
		)
		.default(""),
	minimumOrderQuantity: z
		.string()
		.trim()
		.refine(
			(value) =>
				value === "" ||
				(Number.isInteger(Number(value)) && Number(value) >= 0),
			localizationConstants.purchaseGoodsValidationPositive,
		)
		.default(""),
});

export type GoodsReceptionInput = z.input<typeof goodsReceptionSchema>;

/** Flattens a ZodError into `field -> message`, the shape the form renders. */
export function collectGoodsReceptionErrors(
	error: z.ZodError,
): Record<string, string> {
	const collected: Record<string, string> = {};

	for (const issue of error.issues) {
		const path = issue.path.join(".");
		if (path && !collected[path]) {
			collected[path] = issue.message;
		}
	}

	return collected;
}
