import { z } from "zod";

const optionalString = z.string().optional().or(z.literal(""));
const optionalEmail = z.string().email().optional().or(z.literal(""));

export const companyInformationSchema = z.object({
	companyLogotype: z.any().nullable().optional(),
	companyName: z.string().min(1),
	orgNumber: optionalString,
	vatNumber: optionalString,
	sniCode: optionalString,
	postalAddress: z.object({
		streetAddress: optionalString,
		postalCode: optionalString,
		city: optionalString,
	}),
	visitingAddress: z.object({
		streetAddress: optionalString,
		postalCode: optionalString,
		city: optionalString,
	}),
	deliveryAddress: z.object({
		streetAddress: optionalString,
		postalCode: optionalString,
		city: optionalString,
	}),
	phone: optionalString,
	email: optionalEmail,
	website: optionalString,
	outgoingEmail: z.string().email(),
	supplierInvoiceEmail: optionalEmail,
	smsNumber: optionalString,
});

export type CompanyInformationFormValues = z.infer<typeof companyInformationSchema>;
