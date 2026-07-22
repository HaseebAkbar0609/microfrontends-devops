import { z } from "zod";

const optionalString = z.string().optional().or(z.literal(""));

const addressGroup = z.object({
	streetAddress: optionalString,
	postalCode: optionalString,
	city: optionalString,
});

export const partnerCompanyProfileSchema = z.object({
	companyLogotype: z.any().nullable().optional(),
	companyName: optionalString,
	orgNumber: optionalString,
	vatNumber: optionalString,
	sniCode: optionalString,
	postalAddress: addressGroup,
	storeAddress: addressGroup,
	deliveryAddress: addressGroup,
	switchboardNumber: optionalString,
	email: optionalString,
	website: optionalString,
	storePostalAddress: addressGroup,
	storeVisitAddress: addressGroup,
	storeDeliveryAddress: addressGroup,
	storeSwitchboardNumber: optionalString,
	storeEmail: optionalString,
	storeWebsite: optionalString,
});

export type PartnerCompanyProfileFormValues = z.infer<typeof partnerCompanyProfileSchema>;
