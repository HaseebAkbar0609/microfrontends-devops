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
                    return Number.isFinite(num) && Number.isInteger(num) && num > 0 && num <= 100;
				},
				{ message: t(localizationConstants.validationInvalidFormat) },
			),
		personalId: z
			.string()
			.min(1, { message: t(localizationConstants.validationInvalidFormat) })
			.refine(
				(val) => {
					const clean = val.replace(/\D/g, "");
					return (clean.length === 10 || clean.length === 12) && isValidSwedishPersonalNumber(clean);
				},
				{ message: t(localizationConstants.validationInvalidFormat) },
			),
		isCoOwner: z.boolean().optional().default(false),
		coOwnerPersonalId: z
			.string()
			.optional()
			.refine(
				(val) => {
					if (!val || val.trim() === "") return true;
					const clean = val.replace(/\D/g, "");
					return (clean.length === 10 || clean.length === 12) && isValidSwedishPersonalNumber(clean);
				},
				{ message: t(localizationConstants.validationInvalidFormat) },
			),
	})
	.superRefine((data, ctx) => {
		if (data.isCoOwner && !data.coOwnerPersonalId?.trim()) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["coOwnerPersonalId"],
				message: t(localizationConstants.validationRegisterCoOwnerPersonalIdRequired),
			});
		}
	});

export type RegistrationSchemaType = z.input<ReturnType<typeof getRegistrationSchema>>;
