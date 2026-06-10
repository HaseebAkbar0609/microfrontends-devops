import { z } from "zod";
import localizationConstants from "@/utils/translation/constants";

export const DocumentSchema = z.object({
	id: z.string(),
	name: z.string(),
	size: z.number(),
	type: z.string(),
	date: z.string(),
	file: z.instanceof(File).optional(),
	/** Presigned URL from GET project (existing media); local uploads omit this */
	url: z.string().optional(),
});

export const SupplierSchema = z.object({
	id: z.string(),
	companyName: z.string(),
	/** Invitation: professional subcategory id */
	category: z.string(),
	orgNumber: z.string(),
	contactFirstName: z.string(),
	contactLastName: z.string(),
	emailAddress: z.string(),
	mobileNumber: z.string(),
});

export const createOfferSchema = z.object({
	firstName: z
		.string()
		.min(1, { message: localizationConstants.validationFirstNameRequired }),
	lastName: z
		.string()
		.min(1, { message: localizationConstants.validationLastNameRequired }),
	mobileNumber: z
		.string()
		.min(1, { message: localizationConstants.validationMobileNumberRequired }),
	personalEmail: z
		.string()
		.min(1, {
			message: localizationConstants.validationPersonalEmailRequired,
		})
		.email({
			message: localizationConstants.validationPersonalEmailInvalid,
		}),
	address: z
		.string()
		.min(1, { message: localizationConstants.validationAddressRequired }),
	city: z
		.string()
		.min(1, { message: localizationConstants.validationCityRequired }),
	pincode: z
		.string()
		.min(1, { message: localizationConstants.validationPincodeRequired }),
	country: z.string().optional(),
	/** Display-only: resolved from GET project `city_name` or cities API (form `city` stays id) */
	personalCityName: z.string().optional(),
	// Step 2 - Project information
	projectName: z
		.string()
		.min(1, { message: localizationConstants.validationProjectNameRequired }),
	isExpressJob: z.string(),
	clientNo: z
		.string()
		.min(1, { message: localizationConstants.validationClientNoRequired }),
	category: z
		.array(z.string())
		.min(1, { message: localizationConstants.validationCategoryRequired }),
	sameAsContact: z.boolean(),
	projectAddress: z
		.string()
		.min(1, {
			message: localizationConstants.validationProjectAddressRequired,
		}),
	projectCity: z
		.string()
		.min(1, { message: localizationConstants.validationProjectCityRequired }),
	projectPostalCode: z
		.string()
		.min(1, {
			message: localizationConstants.validationProjectPostalCodeRequired,
		}),
	directions: z.string().optional(),
	/** Display-only: from GET project `project_details.city_name` or cities API */
	projectCityName: z.string().optional(),
	// Step 3
	description: z.string().optional(),
	documents: z.array(DocumentSchema).optional(),
	invitedSuppliers: z.array(SupplierSchema).optional(),
	internalSuppliers: z.array(SupplierSchema).optional(),
});

export type QuoteDocument = z.infer<typeof DocumentSchema>;
export type QuoteSupplier = z.infer<typeof SupplierSchema>;
export type CreateOfferFormValues = z.infer<typeof createOfferSchema>;

export const DEFAULT_OFFER_FORM_VALUES: CreateOfferFormValues = {
	firstName: "",
	lastName: "",
	mobileNumber: "",
	personalEmail: "",
	address: "",
	city: "",
	pincode: "",
	country: "",
	personalCityName: "",
	// Step 2
	projectName: "",
	isExpressJob: "b2c",
	clientNo: "",
	category: [],
	sameAsContact: false,
	projectAddress: "",
	projectCity: "",
	projectPostalCode: "",
	directions: "",
	projectCityName: "",
	// Step 3
	description: "",
	documents: [],
	invitedSuppliers: [],
	internalSuppliers: [],
};
