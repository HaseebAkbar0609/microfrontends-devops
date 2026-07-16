import { z } from "zod";

const optionalString = z.string().optional().or(z.literal(""));

export const companyInformationSchema = z.object({
	companyName: optionalString,
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
	switchboardNumber: optionalString,
	email: optionalString,
	website: optionalString,
});

export type CompanyInformationFormValues = z.infer<typeof companyInformationSchema>;
