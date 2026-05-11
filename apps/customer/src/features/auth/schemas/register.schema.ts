import { z } from "zod";

import localizationConstants from "@/utils/translation/constants";

export const registerSchema = z
	.object({
		first_name: z
			.string()
			.min(1, localizationConstants.validationRegisterFirstNameRequired),

		last_name: z
			.string()
			.min(1, localizationConstants.validationRegisterLastNameRequired),
		email: z
			.string()
			.min(1, localizationConstants.validationRegisterEmailRequired)
			.email(localizationConstants.validationRegisterEmailInvalid),
		phone: z
			.string()
			.min(1, localizationConstants.validationRegisterPhoneRequired),
		postalCode: z
			.string()
			.min(1, localizationConstants.validationRegisterPostalCodeRequired),
		address: z
			.string()
			.min(1, localizationConstants.validationRegisterAddressRequired),
		city: z
			.string()
			.min(1, localizationConstants.validationRegisterCityRequired),
		country: z
			.string()
			.min(1, localizationConstants.validationRegisterCountryRequired),
		password: z
			.string()
			.min(1, localizationConstants.validationRegisterPasswordRequired),
		confirmPassword: z
			.string()
			.min(
				1,
				localizationConstants.validationRegisterConfirmPasswordRequired,
			),
		acceptTerms: z.boolean(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: localizationConstants.validationRegisterPasswordMismatch,
		path: ["confirmPassword"],
	});
// .refine((data) => data.acceptTerms === true, {
// 	message: localizationConstants.validationRegisterTermsMustAccept,
// 	path: ["acceptTerms"],
// });
