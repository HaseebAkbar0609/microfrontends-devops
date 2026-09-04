import { z } from "zod";

import localizationConstants from "@/utils/translation/constants";

const optionalString = z.string().optional().or(z.literal(""));

const swedishOrgNumber = optionalString.refine(
	(value) => !value || /^\d{6}-\d{4}$/.test(value),
	{ message: localizationConstants.partnerValidationOrgNumberInvalid }
);

const swedishVatNumber = optionalString.refine(
	(value) => !value || /^SE\d{10}01$/.test(value),
	{ message: localizationConstants.partnerValidationVatNumberInvalid }
);

const websiteUrl = optionalString.refine(
	(value) => !value || /^https?:\/\/[^\s]+\.[^\s]+$/.test(value),
	{ message: localizationConstants.partnerValidationWebsiteInvalid }
);

const addressGroup = z.object({
	streetAddress: optionalString,
	postalCode: optionalString,
	city: optionalString,
});

export const partnerCompanyProfileSchema = z.object({
	companyLogotype: z.any().nullable().optional(),
	companyName: optionalString,
	orgNumber: swedishOrgNumber,
	vatNumber: swedishVatNumber,
	sniCode: optionalString,
	postalAddress: addressGroup,
	storeAddress: addressGroup,
	deliveryAddress: addressGroup,
	switchboardNumber: optionalString,
	email: optionalString,
	website: websiteUrl,
	storePostalAddress: addressGroup,
	storeVisitAddress: addressGroup,
	storeDeliveryAddress: addressGroup,
	storeSwitchboardNumber: optionalString,
	storeEmail: optionalString,
	storeWebsite: websiteUrl,
});

export type PartnerCompanyProfileFormValues = z.infer<typeof partnerCompanyProfileSchema>;
