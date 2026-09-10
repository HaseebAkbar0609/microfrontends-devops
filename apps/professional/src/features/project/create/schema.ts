import { z } from "zod";

import {
	customerDetailsSchema,
	emailRegex,
	postalCodeRegex,
	validatePhoneNumber,
} from "@/lib/validation/contactSchema";
import localizationConstants from "@/utils/translation/constants";

/**
 * Zod messages are translation KEYS, not sentences.
 *
 * `localizationConstants` is an identity map, so the key survives into
 * `issue.message` and the component resolves it with
 * `t(message as TranslationKeys)`. A literal string here would ship English.
 */

const optionalEmail = z
	.string()
	.trim()
	.regex(emailRegex, localizationConstants.orderValidationEmailInvalid)
	.optional()
	.default("");

const optionalPhone = z
	.string()
	.trim()
	.refine(validatePhoneNumber, {
		message: localizationConstants.orderValidationPhoneInvalid,
	})
	.optional()
	.default("");

const optionalPostalCode = z
	.string()
	.trim()
	.regex(postalCodeRegex, localizationConstants.orderValidationPostalCodeInvalid)
	.optional()
	.default("");

/** Step 1 — the Kunduppgifter card is the shared block, unchanged. */
export const projectCustomerSchema = customerDetailsSchema;

export const projectContactPersonSchema = z.object({
	firstName: z
		.string()
		.trim()
		.min(1, localizationConstants.orderValidationFirstNameRequired),
	lastName: z.string().trim().optional().default(""),
	email: optionalEmail,
	mobile: optionalPhone,
	role: z.string().optional().default(""),
});

/** Step 2 — only the number and the name are mandatory, as the frames mark. */
export const projectDetailsSchema = z
	.object({
		projectNo: z
			.string()
			.trim()
			.min(1, localizationConstants.projectCreateValidationNoRequired),
		projectName: z
			.string()
			.trim()
			.min(1, localizationConstants.projectCreateValidationNameRequired),
		blockName: z.string().trim().optional().default(""),
		projectAddress: z.string().trim().optional().default(""),
		postalCode: optionalPostalCode,
		city: z.string().optional().default(""),
		linkedProjectNo: z.string().optional().default(""),
		type: z.string().optional().default(""),
		category: z.string().optional().default(""),
		department: z.string().optional().default(""),
		contractSum: z.string().trim().optional().default(""),
		offerNo: z.string().trim().optional().default(""),
		startDate: z.string().optional().default(""),
		endDate: z.string().optional().default(""),
	})
	/**
	 * The date picker already blocks an end before the start, but the field is
	 * typeable, so the rule is enforced here rather than only in the widget.
	 */
	.refine(
		(value) =>
			!value.startDate || !value.endDate || value.endDate >= value.startDate,
		{
			path: ["endDate"],
			message: localizationConstants.orderValidationDateRangeInvalid,
		},
	);

/** Step 4 — the frames star only "Typ av entreprenör". */
export const projectOrganisationSchema = z.object({
	contractorType: z
		.string()
		.trim()
		.min(
			1,
			localizationConstants.projectCreateValidationContractorTypeRequired,
		),
	organizationName: z.string().trim().optional().default(""),
	address: z.string().trim().optional().default(""),
	postalCode: optionalPostalCode,
	city: z.string().optional().default(""),
	email: optionalEmail,
	phone: optionalPhone,
	contacts: z.array(z.any()).optional().default([]),
});

export const createProjectSchema = z.object({
	customer: projectCustomerSchema,
	contactPerson: projectContactPersonSchema,
	details: projectDetailsSchema,
	documents: z.array(z.any()).optional().default([]),
	organisation: projectOrganisationSchema,
});
