import { z } from "zod";
import localizationConstants from "@/utils/translation/constants";

const emailRegex = /^$|^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const postalCodeRegex = /^$|^[\d ]{2,12}$/;
const orgPersonRegex = /^$|^[\d\-]{6,16}$/;

/**
 * 100% Comprehensive E.164 & Swedish/International Phone Validator:
 * - Empty string: Valid (optional field)
 * - Contains only allowed phone characters: [0-9+() -]
 * - Must have between 7 and 15 digits (ITU-T E.164 International Standard)
 * - If country code (+X...) is present, national number must have at least 5 digits
 * - Rejects dummy numbers where all digits are identical (e.g. 0000000, 1111111)
 */
export const validatePhoneNumber = (val?: string): boolean => {
	if (!val || val.trim() === "") return true;

	const trimmed = val.trim();

	// Disallow invalid characters (only digits, +, -, (, ), and spaces)
	if (/[^0-9+\- ()]/.test(trimmed)) {
		return false;
	}

	const digitsOnly = trimmed.replace(/\D/g, "");

	// International standard E.164: 7 to 15 digits total
	if (digitsOnly.length < 7 || digitsOnly.length > 15) {
		return false;
	}

	// Reject dummy repeating numbers where all digits are identical (e.g. "00000000", "11111111")
	if (/^(\d)\1+$/.test(digitsOnly)) {
		return false;
	}

	// If starts with country code (+), ensure country code and national digits are valid
	if (trimmed.startsWith("+")) {
		const match = trimmed.match(/^\+(\d{1,4})\s*(.*)$/);
		if (match) {
			const countryCodeDigits = match[1];
			const nationalDigits = (match[2] || "").replace(/\D/g, "");
			if (!countryCodeDigits || countryCodeDigits.length < 1 || countryCodeDigits.length > 4) return false;
			if (!nationalDigits || nationalDigits.length < 5 || nationalDigits.length > 14) return false;
		}
	}

	return true;
};

export const customerInfoSchema = z.object({
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
		.regex(postalCodeRegex, localizationConstants.orderValidationPostalCodeInvalid)
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
		.regex(orgPersonRegex, localizationConstants.orderValidationOrgOrPersonalNoInvalid)
		.optional()
		.default(""),
});

export const contactPersonSchema = z.object({
	firstName: z
		.string()
		.trim()
		.min(1, localizationConstants.orderValidationFirstNameRequired),
	lastName: z.string().optional().default(""),
	email: z
		.string()
		.trim()
		.regex(emailRegex, localizationConstants.orderValidationEmailInvalid)
		.optional()
		.default(""),
	mobile: z
		.string()
		.trim()
		.refine((val) => validatePhoneNumber(val), {
			message: localizationConstants.orderValidationPhoneInvalid,
		})
		.optional()
		.default(""),
	role: z.string().optional().default("Beställare"),
});

export const orderInfoSchema = z
	.object({
		orderNo: z
			.string()
			.trim()
			.min(1, localizationConstants.orderValidationOrderNoRequired),
		orderName: z
			.string()
			.trim()
			.min(1, localizationConstants.orderValidationOrderNameRequired),
		blockName: z.string().optional().default(""),
		orderAddress: z.string().optional().default(""),
		postalCode: z
			.string()
			.trim()
			.regex(postalCodeRegex, localizationConstants.orderValidationPostalCodeInvalid)
			.optional()
			.default(""),
		city: z.string().optional().default(""),
		type: z.string().optional().default(""),
		category: z.string().optional().default(""),
		department: z.string().optional().default(""),
		contractSum: z.string().optional().default(""),
		offerNo: z.string().optional().default(""),
		startDate: z.string().optional().default(""),
		endDate: z.string().optional().default(""),
	})
	.refine(
		(data) => {
			if (data.startDate && data.endDate) {
				return new Date(data.endDate) >= new Date(data.startDate);
			}
			return true;
		},
		{
			message: localizationConstants.orderValidationDateRangeInvalid,
			path: ["endDate"],
		}
	);

export const createOrderSchema = z.object({
	customerInfo: customerInfoSchema,
	contactPerson: contactPersonSchema,
	orderInfo: orderInfoSchema,
});
