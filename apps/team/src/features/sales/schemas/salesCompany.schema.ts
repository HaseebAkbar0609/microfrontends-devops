import { z } from "zod";
import localizationConstants from "@/utils/translation/constants";

/** Swedish organisation numbers are printed as 556000-0000. */
const ORGANISATION_NUMBER_PATTERN = /^\d{6}-\d{4}$/;

/** Route segments we generate are alphanumeric with dashes only. */
const COMPANY_ID_PATTERN = /^[A-Za-z0-9-]{1,64}$/;

/**
 * Validation messages are translation keys, not sentences. Render them with
 * `t(message as TranslationKeys)` so the language toggle applies to them too.
 */
export const salesCompanyDraftSchema = z.object({
	name: z.string().trim().min(1, {
		message: localizationConstants.salesValidationCompanyNameRequired,
	}),
	organisationNumber: z
		.string()
		.trim()
		.refine((value) => value === "" || ORGANISATION_NUMBER_PATTERN.test(value), {
			message: localizationConstants.salesValidationOrgNumberInvalid,
		}),
	trade: z.string().trim(),
	city: z.string().trim(),
	contactPerson: z.string().trim(),
	mobile: z.string().trim(),
	email: z
		.string()
		.trim()
		.refine((value) => value === "" || z.string().email().safeParse(value).success, {
			message: localizationConstants.salesValidationEmailInvalid,
		}),
	category: z.string(),
	region: z.string(),
	status: z.enum(["prospect", "lead", "quoted", "accepted", "closed"]),
});

export type SalesCompanyDraftValues = z.infer<typeof salesCompanyDraftSchema>;

/** Empty draft, kept next to the schema it is validated against. */
export const EMPTY_SALES_COMPANY_DRAFT: SalesCompanyDraftValues = {
	name: "",
	organisationNumber: "",
	trade: "",
	city: "",
	contactPerson: "",
	mobile: "",
	email: "",
	category: "",
	region: "",
	status: "prospect",
};

/** Guards the `[companyId]` route segment before it reaches the feature. */
export const salesCompanyIdSchema = z.string().regex(COMPANY_ID_PATTERN);

export function parseSalesCompanyId(value: string): string | null {
	const result = salesCompanyIdSchema.safeParse(value);
	return result.success ? result.data : null;
}
