import { z } from "zod";
import localizationConstants from "@/utils/translation/constants";

export const paymentCardSchema = z.object({
	cardName: z
		.string()
		.min(1, localizationConstants.subscriptionValCardNameRequired),
	firstName: z
		.string()
		.min(1, localizationConstants.subscriptionValFirstNameRequired),
	lastName: z
		.string()
		.min(1, localizationConstants.subscriptionValLastNameRequired),
	cardNumber: z
		.string()
		.min(1, localizationConstants.subscriptionValCardNumberRequired)
		.refine(
			(value) => /^\d{16}$/.test(value.replace(/\s/g, "")),
			localizationConstants.subscriptionValCardNumberInvalid,
		),
	expiryMonth: z
		.string()
		.min(1, localizationConstants.subscriptionValMonthRequired),
	expiryYear: z
		.string()
		.min(1, localizationConstants.subscriptionValYearRequired),
	cvc: z
		.string()
		.min(1, localizationConstants.subscriptionValCvcRequired)
		.refine(
			(value) => /^\d{3,4}$/.test(value),
			localizationConstants.subscriptionValCvcInvalid,
		),
});

export type PaymentCardFormValues = z.infer<typeof paymentCardSchema>;
