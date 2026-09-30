import { z } from "zod";
import localizationConstants from "@/utils/translation/constants";
import {
	MATERIAL_DISCRETE_UNITS,
	MATERIAL_TEXT_LIMITS,
} from "../../constants/materialStorage.constants";
import type { MaterialUnit } from "../../types/materialStorage.types";
import type { ReceiveMaterialInput } from "../../types/materialTransaction.types";
import { parseDecimalInput } from "../../utils/materialReceipt";

/** Number fields stay strings while typed, so "82,5" is not mangled before it is complete. */
export interface ReceiveMaterialFormValues {
	depotId: string;
	articleId: string;
	quantity: string;
	supplierName: string;
	unitPrice: string;
	/** yyyy-MM-dd */
	deliveryDate: string;
	supplierOrderNo: string;
	comment: string;
}

/** "receive" books the stock; "draft" only needs depot and material, but still checks what was typed. */
export type ReceiveIntent = "receive" | "draft";

interface SchemaContext {
	intent: ReceiveIntent;
	/** yyyy-MM-dd; a delivery cannot be later than today. */
	today: string;
	unitOf: (articleId: string) => MaterialUnit | undefined;
}

export function createReceiveMaterialSchema({ intent, today, unitOf }: SchemaContext) {
	return z
		.object({
			depotId: z.string().min(1, localizationConstants.materialErrorDepotRequired),
			articleId: z.string().min(1, localizationConstants.materialErrorMaterialRequired),
			quantity: z.string(),
			supplierName: z.string(),
			unitPrice: z.string(),
			deliveryDate: z
				.string()
				.min(1, localizationConstants.materialErrorDateRequired)
				.refine((date) => date <= today, localizationConstants.materialErrorDateFuture),
			supplierOrderNo: z
				.string()
				.max(MATERIAL_TEXT_LIMITS.supplierOrderNo, localizationConstants.materialErrorTooLong),
			comment: z.string().max(MATERIAL_TEXT_LIMITS.comment, localizationConstants.materialErrorTooLong),
		})
		.superRefine((values, ctx) => {
			const issue = (path: keyof ReceiveMaterialFormValues, message: string) =>
				ctx.addIssue({ code: z.ZodIssueCode.custom, path: [path], message });

			if (values.quantity.trim()) {
				const quantity = parseDecimalInput(values.quantity);
				const unit = unitOf(values.articleId);
				if (quantity === null || quantity <= 0)
					issue("quantity", localizationConstants.materialErrorQuantityInvalid);
				else if (unit && MATERIAL_DISCRETE_UNITS.includes(unit) && !Number.isInteger(quantity))
					issue("quantity", localizationConstants.materialErrorQuantityWhole);
			} else if (intent === "receive") {
				issue("quantity", localizationConstants.materialErrorQuantityRequired);
			}

			if (values.unitPrice.trim() && parseDecimalInput(values.unitPrice) === null)
				issue("unitPrice", localizationConstants.materialErrorPriceInvalid);
		});
}

/** Validated form values → what the service takes. Empty optional fields become null. */
export function toReceiveMaterialInput(values: ReceiveMaterialFormValues): ReceiveMaterialInput {
	const text = (value: string) => value.trim() || null;
	const number = (value: string) => (value.trim() ? parseDecimalInput(value) : null);
	return {
		depotId: values.depotId,
		articleId: values.articleId,
		quantity: number(values.quantity),
		supplierName: text(values.supplierName),
		unitPrice: number(values.unitPrice),
		deliveryDate: values.deliveryDate,
		supplierOrderNo: text(values.supplierOrderNo),
		comment: text(values.comment),
	};
}
