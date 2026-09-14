import { z } from "zod";

import { checkUploadedFile } from "@/lib/validation/fileUpload";
import localizationConstants from "@/utils/translation/constants";
import {
	CONTRACT_FILE_EXTENSIONS,
	PAYMENT_PLAN_FILE_MAX_BYTES,
	PAYMENT_PLAN_NAME_MAX_LENGTH,
} from "../paymentPlan.config";

/** `File` checked at runtime, so the schema module is safe to load on the server. */
const fileSchema = z.custom<File>(
	(value) => typeof File !== "undefined" && value instanceof File,
);

/**
 * "Skapa betalningsplan". Messages are translation keys.
 *
 * The contract is re-checked here by extension and size: the picker's MIME
 * check trusts the browser's guess, and `accept` only filters the OS dialog.
 */
export const createPaymentPlanSchema = z.object({
	name: z
		.string()
		.trim()
		.min(1, localizationConstants.projectPaymentPlanNameRequired)
		.max(PAYMENT_PLAN_NAME_MAX_LENGTH, localizationConstants.protocolValMaxLength),
	contract: fileSchema
		.nullable()
		.superRefine((file, ctx) => {
			if (!file) return;
			const reason = checkUploadedFile(file, {
				acceptExtensions: CONTRACT_FILE_EXTENSIONS,
				maxFileSizeBytes: PAYMENT_PLAN_FILE_MAX_BYTES,
			});
			if (reason) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message:
						reason === "size"
							? localizationConstants.projectPaymentPlanFileTooLarge
							: localizationConstants.projectPaymentPlanPdfOnly,
				});
			}
		}),
});

export type CreatePaymentPlanValues = z.infer<typeof createPaymentPlanSchema>;

export const EMPTY_CREATE_PAYMENT_PLAN: CreatePaymentPlanValues = {
	name: "",
	contract: null,
};
