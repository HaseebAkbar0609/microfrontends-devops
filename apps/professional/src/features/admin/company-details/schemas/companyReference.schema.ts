import { z } from "zod";
import localizationConstants from "@/utils/translation/constants";

const required = z
	.string()
	.min(1, { message: localizationConstants.protocolValRequired });

export const companyReferenceSchema = z.object({
	project: required,
	customer: required,
	municipality: required,
	contact: required.email({
		message: localizationConstants.protocolValRequired,
	}),
	phone: required,
});

export type CompanyReferenceValues = z.infer<typeof companyReferenceSchema>;
