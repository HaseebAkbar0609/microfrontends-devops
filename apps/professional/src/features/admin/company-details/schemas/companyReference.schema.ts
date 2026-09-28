import { z } from "zod";
import localizationConstants from "@/utils/translation/constants";
import { emailRegex, validatePhoneNumber } from "@/lib/validation/contactSchema";

const required = z
	.string()
	.min(1, { message: localizationConstants.protocolValRequired });

export const companyReferenceSchema = z.object({
	project: required,
	customer: required,
	municipality: required,
	contact: required.regex(emailRegex, {
		message: localizationConstants.orderValidationEmailInvalid,
	}),
	phone: required.refine(validatePhoneNumber, {
		message: localizationConstants.orderValidationPhoneInvalid,
	}),
});

export type CompanyReferenceValues = z.infer<typeof companyReferenceSchema>;
