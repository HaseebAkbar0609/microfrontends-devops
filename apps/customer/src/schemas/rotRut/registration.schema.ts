import { z } from "zod";
import { isValidSwedishPersonalNumber } from "@/utils/validation";
import localizationConstants from "@/utils/translation/constants";

export const getRegistrationSchema = (t: (key: string) => string) =>
	z.object({
		propertyId: z.string().min(1, {
			message: t(localizationConstants.validationRegisterPropertyIdRequired),
		}),
		address: z.string().min(1, {
			message: t(localizationConstants.validationRegisterAddressRequired),
		}),
		firstName: z.string().min(1, {
			message: t(localizationConstants.validationRegisterFirstNameRequired),
		}),
		lastName: z.string().min(1, {
			message: t(localizationConstants.validationRegisterLastNameRequired),
		}),
		sharePercentage: z
			.string()
			.min(1, {
				message: t(
					localizationConstants.validationRegisterSharePercentageRequired,
				),
			})
			.refine(
				(val) => {
					const num = Number(val);
					return Number.isFinite(num) && num > 0 && num <= 100;
				},
				{ message: t(localizationConstants.validationInvalidFormat) },
			),
		personalId: z
			.string()
			.regex(/^\d+$/, { message: t(localizationConstants.validationInvalidFormat) })
			.refine((val) => isValidSwedishPersonalNumber(val), {
				message: t(localizationConstants.validationInvalidFormat),
			}),
	});

const _baseSchema = z.object({
	propertyId: z.string(),
	address: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	sharePercentage: z.string(),
	personalId: z.string(),
});

export type RegistrationSchemaType = z.infer<typeof _baseSchema>;
