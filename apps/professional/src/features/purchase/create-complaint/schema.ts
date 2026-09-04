import { z } from "zod";

import {
	emailRegex,
	postalCodeRegex,
	validatePhoneNumber,
} from "@/lib/validation/contactSchema";
import localizationConstants from "@/utils/translation/constants";

/**
 * Contact block. The design marks only Förnamn as required (red asterisk); the
 * rest are optional but still format-checked when filled.
 */
export const complaintContactSchema = z.object({
	contactId: z.string().optional().default(""),
	firstName: z
		.string()
		.trim()
		.min(1, localizationConstants.complaintValidationFirstNameRequired),
	lastName: z.string().optional().default(""),
	address: z.string().optional().default(""),
	postalCode: z
		.string()
		.trim()
		.regex(
			postalCodeRegex,
			localizationConstants.orderValidationPostalCodeInvalid,
		)
		.optional()
		.default(""),
	email: z
		.string()
		.trim()
		.regex(emailRegex, localizationConstants.orderValidationEmailInvalid)
		.optional()
		.default(""),
	phone: z
		.string()
		.trim()
		.refine((value) => validatePhoneNumber(value), {
			message: localizationConstants.orderValidationPhoneInvalid,
		})
		.optional()
		.default(""),
	city: z.string().optional().default(""),
	role: z.string().optional().default(""),
});

/** Company block; nothing is marked required in the design. */
export const complaintCompanySchema = z.object({
	company: z.string().optional().default(""),
	address: z.string().optional().default(""),
	phone: z
		.string()
		.trim()
		.refine((value) => validatePhoneNumber(value), {
			message: localizationConstants.orderValidationPhoneInvalid,
		})
		.optional()
		.default(""),
	email: z
		.string()
		.trim()
		.regex(emailRegex, localizationConstants.orderValidationEmailInvalid)
		.optional()
		.default(""),
});

/** Step 1 — everything on the Kontaktuppgifter tab. */
export const complaintContactStepSchema = z.object({
	info: z.object({
		complaintType: z
			.string()
			.trim()
			.min(1, localizationConstants.complaintValidationTypeRequired),
	}),
	supplierId: z
		.string()
		.trim()
		.min(1, localizationConstants.complaintValidationSupplierRequired),
	supplier: complaintCompanySchema,
	supplierContact: complaintContactSchema,
	reporter: complaintCompanySchema,
	reporterContact: complaintContactSchema,
});

/** Step 2 — the report itself. */
export const complaintReportStepSchema = z.object({
	title: z
		.string()
		.trim()
		.min(1, localizationConstants.complaintValidationTitleRequired),
	description: z
		.string()
		.trim()
		.min(1, localizationConstants.complaintValidationDescriptionRequired),
	discoveredAt: z.string().optional().default(""),
	deliveredAt: z.string().optional().default(""),
	priority: z.enum(["high", "medium", "low"]).default("high"),
	/**
	 * Consent is required to send. The attachments and contact blocks carry
	 * personal data, so the checkbox has to mean something — but only on send:
	 * `saveDraft` skips validation, so an unfinished draft still saves.
	 */
	gdprAccepted: z.literal(true, {
		/**
		 * `errorMap`, not `message`: with `message` zod only applies it to the
		 * missing/wrong-type case and reports an unchecked box as the English
		 * "Invalid literal value, expected true", which would reach the screen
		 * untranslated. `errorMap` covers both.
		 */
		errorMap: () => ({
			message: localizationConstants.complaintValidationGdprRequired,
		}),
	}),
});

/**
 * Flattens a ZodError into `"supplierContact.firstName" -> message`, the shape
 * the wizard's `errors` map uses.
 */
export function collectComplaintErrors(
	error: z.ZodError,
	prefix = "",
): Record<string, string> {
	const collected: Record<string, string> = {};

	for (const issue of error.issues) {
		const path = [prefix, ...issue.path].filter(Boolean).join(".");
		if (path && !collected[path]) {
			collected[path] = issue.message;
		}
	}

	return collected;
}
