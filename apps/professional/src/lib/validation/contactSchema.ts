import { z } from "zod";

import localizationConstants from "@/utils/translation/constants";

export const emailRegex = /^$|^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const postalCodeRegex = /^$|^[\d ]{2,12}$/;
export const orgPersonRegex = /^$|^[\d\-]{6,16}$/;

/**
 * E.164 and Swedish phone validation:
 * - empty is valid, since every phone field in these forms is optional
 * - only `[0-9 +-()]` allowed, 7-15 digits total
 * - a country code must be 1-4 digits and leave 5-14 national digits
 * - rejects placeholder numbers made of one repeated digit
 */
export const validatePhoneNumber = (val?: string): boolean => {
	if (!val || val.trim() === "") return true;

	const trimmed = val.trim();

	if (/[^0-9+\- ()]/.test(trimmed)) return false;

	const digitsOnly = trimmed.replace(/\D/g, "");
	if (digitsOnly.length < 7 || digitsOnly.length > 15) return false;
	if (/^(\d)\1+$/.test(digitsOnly)) return false;

	if (trimmed.startsWith("+")) {
		const match = trimmed.match(/^\+(\d{1,4})\s*(.*)$/);
		if (match) {
			const countryCodeDigits = match[1];
			const nationalDigits = (match[2] || "").replace(/\D/g, "");
			if (countryCodeDigits.length < 1 || countryCodeDigits.length > 4) {
				return false;
			}
			if (nationalDigits.length < 5 || nationalDigits.length > 14) {
				return false;
			}
		}
	}

	return true;
};

/**
 * The "Kunduppgifter" block shared by the order and purchase create flows.
 * Only the company name and address are mandatory; the rest are validated for
 * shape but may be left blank.
 */
export const customerDetailsSchema = z.object({
	customer: z
		.string()
		.trim()
		.min(1, localizationConstants.orderValidationCustomerRequired),
	address: z
		.string()
		.trim()
		.min(1, localizationConstants.orderValidationAddressRequired),
	postalCode: z
		.string()
		.trim()
		.regex(
			postalCodeRegex,
			localizationConstants.orderValidationPostalCodeInvalid,
		)
		.optional()
		.default(""),
	city: z.string().optional().default(""),
	email: z
		.string()
		.trim()
		.regex(emailRegex, localizationConstants.orderValidationEmailInvalid)
		.optional()
		.default(""),
	phone: z
		.string()
		.trim()
		.refine((val) => validatePhoneNumber(val), {
			message: localizationConstants.orderValidationPhoneInvalid,
		})
		.optional()
		.default(""),
	orgOrPersonalNo: z
		.string()
		.trim()
		.regex(
			orgPersonRegex,
			localizationConstants.orderValidationOrgOrPersonalNoInvalid,
		)
		.optional()
		.default(""),
});

export type CustomerDetails = z.infer<typeof customerDetailsSchema>;
