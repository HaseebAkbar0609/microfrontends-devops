import { z } from "zod";

// Mirrors tfs-backend/app/api/v1/professionals/users/schemas.py so the form
// rejects invalid input before it ever reaches the server (and stops matching
// the server's 422s with a bare toast instead of an inline field message).
const NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]{3,20}$/;
const PHONE_REGEX = /^\+?[0-9\s\-()]{6,30}$/;
const POSTAL_CODE_REGEX = /^[0-9A-Za-z\s\-]{2,20}$/;
const PERSONAL_ID_REGEX = /^[0-9A-Za-z\-+]{6,50}$/;

/** Optional field: empty is fine, but a non-empty value must match `regex`. */
const optionalPattern = (regex: RegExp, message: string) =>
	z
		.string()
		.optional()
		.refine((v) => !v || regex.test(v), { message });

const nextOfKinSchema = z.object({
	name: z
		.string()
		.optional()
		.refine((v) => !v || (v.trim().length >= 3 && v.trim().length <= 100), {
			message: "Name must be between 3 and 100 characters",
		}),
	relation: z.string().optional(),
	phone: optionalPattern(PHONE_REGEX, "Invalid phone number format"),
	email: z.string().email().or(z.literal("")).optional(),
});

export const contactSchema = z.object({
	firstName: z
		.string()
		.min(3, "First name must be between 3 and 20 characters")
		.max(20, "First name must be between 3 and 20 characters")
		.regex(NAME_REGEX, "First name contains invalid characters"),
	lastName: z
		.string()
		.min(3, "Last name must be between 3 and 20 characters")
		.max(20, "Last name must be between 3 and 20 characters")
		.regex(NAME_REGEX, "Last name contains invalid characters"),
	personalId: optionalPattern(PERSONAL_ID_REGEX, "Invalid personal ID format"),
	email: z.string().email(),
	phone: optionalPattern(PHONE_REGEX, "Invalid phone number format"),
	streetAddress: z
		.string()
		.optional()
		.refine((v) => !v || (v.trim().length >= 3 && v.trim().length <= 255), {
			message: "Address must be between 3 and 255 characters",
		}),
	postalCode: optionalPattern(POSTAL_CODE_REGEX, "Invalid postal code format"),
	countryId: z.string().optional(),
	cityId: z.string().optional(),
	nextOfKin: z.array(nextOfKinSchema).optional(),
	employmentNumber: z.string().optional(),
	position: z.string().optional(),
	department: z.string().optional(),
	profilePicture: z.any().optional(),
	languagePreference: z.string().optional(),
	languageOther: z.string().optional(),
	notifications: z
		.object({
			email: z.boolean().optional(),
			sms: z.boolean().optional(),
			webPush: z.boolean().optional(),
		})
		.optional(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
