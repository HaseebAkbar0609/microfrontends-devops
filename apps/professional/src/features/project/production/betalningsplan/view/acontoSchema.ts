import { z } from "zod";

import localizationConstants from "@/utils/translation/constants";
import { ACONTO_TEXT_MAX_LENGTH, AMOUNT_MAX, PERCENT_MAX } from "../paymentPlan.config";

/** Digits only — kronor are whole numbers, and "1 000" or "1.000" is a typo. */
const WHOLE_NUMBER = /^\d+$/;

/** A whole-kronor field typed as text, checked before it becomes a number. */
const kronor = (message: string, min: number) =>
	z
		.string()
		.trim()
		.regex(WHOLE_NUMBER, message)
		.refine((value) => {
			const amount = Number(value);
			return amount >= min && amount <= AMOUNT_MAX;
		}, message);

/** The Lägga till / Redigera dialog. Messages are translation keys. */
export const acontoSchema = z.object({
	date: z.string().min(1, localizationConstants.projectPaymentPlanDateRequired),
	activity: z
		.string()
		.trim()
		.min(1, localizationConstants.projectPaymentPlanActivityRequired)
		.max(ACONTO_TEXT_MAX_LENGTH, localizationConstants.protocolValMaxLength),
	lift: z
		.string()
		.trim()
		.min(1, localizationConstants.projectPaymentPlanLiftRequired)
		.max(ACONTO_TEXT_MAX_LENGTH, localizationConstants.protocolValMaxLength),
	amount: kronor(localizationConstants.projectPaymentPlanAmountInvalid, 1),
});

export type AcontoFormValues = z.infer<typeof acontoSchema>;

const percent = z
	.string()
	.trim()
	.regex(WHOLE_NUMBER, localizationConstants.projectPaymentPlanPercentInvalid)
	.refine(
		(value) => Number(value) <= PERCENT_MAX,
		localizationConstants.projectPaymentPlanPercentInvalid,
	);

/**
 * The Betalningsplan card's pencil. The frame retains 10 % per aconto against
 * a 5 % ceiling, so the ceiling is not required to be the larger figure.
 */
export const termsSchema = z.object({
	contractSum: kronor(localizationConstants.projectPaymentPlanAmountNonNegative, 0),
	retentionPerAcontoPercent: percent,
	retentionTotalPercent: percent,
	retentionFixedAmount: kronor(localizationConstants.projectPaymentPlanAmountNonNegative, 0),
});

export type TermsFormValues = z.infer<typeof termsSchema>;
