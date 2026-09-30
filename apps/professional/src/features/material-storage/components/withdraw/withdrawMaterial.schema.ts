import { z } from "zod";
import localizationConstants from "@/utils/translation/constants";
import {
	MATERIAL_TEXT_LIMITS,
	WITHDRAWAL_LINK_TYPES,
	WITHDRAWAL_TARGET_TEXT,
} from "../../constants/materialStorage.constants";
import type { MaterialUnit } from "../../types/materialStorage.types";
import type { WithdrawalLinkType, WithdrawMaterialInput } from "../../types/materialTransaction.types";
import { quantityInputError, typedQuantity } from "../../utils/materialQuantityInput";
import { parseDecimalInput } from "../../utils/materialStockChanges";
import { isChargedToCustomer, WITHDRAWAL_LINK_RULES } from "../../utils/materialWithdrawal";

/** Number fields stay strings while typed, so "129,5" is not mangled before it is complete. */
export interface WithdrawMaterialFormValues {
	depotId: string;
	articleId: string;
	quantity: string;
	linkType: WithdrawalLinkType;
	/** The chosen order, project or invoice. */
	linkId: string;
	workStepId: string;
	salesPrice: string;
	addInvoiceLine: boolean;
	comment: string;
}

/** "withdraw" takes the stock out; "draft" only needs depot and material, but still checks what was typed. */
export type WithdrawIntent = "withdraw" | "draft";

interface SchemaContext {
	intent: WithdrawIntent;
	unitOf: (articleId: string) => MaterialUnit | undefined;
	/** Tillgängligt in the chosen depot; undefined until known, when the service still refuses too much. */
	available: number | undefined;
}

export function createWithdrawMaterialSchema({ intent, unitOf, available }: SchemaContext) {
	return z
		.object({
			depotId: z.string().min(1, localizationConstants.materialErrorDepotRequired),
			articleId: z.string().min(1, localizationConstants.materialErrorMaterialRequired),
			quantity: z.string(),
			linkType: z.enum(WITHDRAWAL_LINK_TYPES),
			linkId: z.string(),
			workStepId: z.string(),
			salesPrice: z.string(),
			addInvoiceLine: z.boolean(),
			comment: z.string().max(MATERIAL_TEXT_LIMITS.comment, localizationConstants.materialErrorTooLong),
		})
		.superRefine((values, ctx) => {
			const issue = (path: keyof WithdrawMaterialFormValues, message: string) =>
				ctx.addIssue({ code: z.ZodIssueCode.custom, path: [path], message });
			const rules = WITHDRAWAL_LINK_RULES[values.linkType];
			const withdrawing = intent === "withdraw";

			const quantityError = quantityInputError(values.quantity, unitOf(values.articleId), withdrawing);
			const quantity = typedQuantity(values.quantity);
			if (quantityError) issue("quantity", quantityError);
			else if (withdrawing && quantity !== null && available !== undefined && quantity > available)
				issue("quantity", localizationConstants.materialErrorQuantityExceedsAvailable);

			if (withdrawing && values.linkType !== "internal" && !values.linkId)
				issue("linkId", WITHDRAWAL_TARGET_TEXT[values.linkType].required);

			if (rules.hasSalesPrice && values.salesPrice.trim() && parseDecimalInput(values.salesPrice) === null)
				issue("salesPrice", localizationConstants.materialErrorPriceInvalid);
		});
}

/**
 * Validated form values → what the service takes. Fields the chosen link type
 * does not show are dropped, and empty optional fields become null.
 */
export function toWithdrawMaterialInput(values: WithdrawMaterialFormValues): WithdrawMaterialInput {
	const rules = WITHDRAWAL_LINK_RULES[values.linkType];
	return {
		depotId: values.depotId,
		articleId: values.articleId,
		quantity: typedQuantity(values.quantity),
		linkType: values.linkType,
		linkId: (rules.hasTarget && values.linkId) || null,
		workStepId: (rules.hasWorkStep && values.workStepId) || null,
		salesPrice: rules.hasSalesPrice && values.salesPrice.trim() ? parseDecimalInput(values.salesPrice) : null,
		addInvoiceLine: isChargedToCustomer(values.linkType, values.addInvoiceLine),
		comment: values.comment.trim() || null,
	};
}
