import { z } from "zod";
import localizationConstants from "@/utils/translation/constants";

export const ConsultantDocumentSchema = z.object({
	id: z.string(),
	name: z.string(),
	size: z.number(),
	type: z.string(),
	date: z.string(),
	validity: z.string().optional(),
	file: z.instanceof(File).optional(),
	url: z.string().optional(),
	mediaId: z.string().optional(),
});

export type ConsultantDocument = z.infer<typeof ConsultantDocumentSchema>;

export const createConsultantRequestSchema = z.object({
	project: z
		.string()
		.min(1, { message: localizationConstants.validationProjectRequired }),
	consultantType: z.string().min(1, {
		message: localizationConstants.validationConsultantTypeRequired,
	}),
	customer: z
		.string()
		.min(1, { message: localizationConstants.validationCustomerRequired }),
	email: z
		.string()
		.min(1, {
			message: localizationConstants.validationPersonalEmailRequired,
		})
		.email({
			message: localizationConstants.validationPersonalEmailInvalid,
		}),
	mobile: z
		.string()
		.min(1, {
			message: localizationConstants.validationMobileNumberRequired,
		})
		.regex(/^\+?\d(?:[\s-]?\d){6,14}$/, {
			message: localizationConstants.validationMobileNumberInvalid,
		}),
	city: z
		.string()
		.min(1, { message: localizationConstants.validationCityRequired }),
	description: z.string().min(1, {
		message: localizationConstants.validationDescriptionRequired,
	}),
	documents: z.array(ConsultantDocumentSchema),
});

export type CreateConsultantRequestFormValues = z.infer<
	typeof createConsultantRequestSchema
>;

export const CREATE_CONSULTANT_REQUEST_DEFAULT_VALUES: CreateConsultantRequestFormValues =
	{
		project: "",
		consultantType: "",
		customer: "",
		email: "",
		mobile: "",
		city: "",
		description: "",
		documents: [],
	};
