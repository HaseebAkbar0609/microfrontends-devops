import type { CompanyInformationFormValues } from "../schemas/companyInformation.schema";

export const DEFAULT_VALUES: CompanyInformationFormValues = {
	companyLogotype: null,
	companyName: "",
	orgNumber: "",
	vatNumber: "",
	sniCode: "",
	postalAddress: {
		streetAddress: "",
		postalCode: "",
		city: "",
	},
	visitingAddress: {
		streetAddress: "",
		postalCode: "",
		city: "",
	},
	deliveryAddress: {
		streetAddress: "",
		postalCode: "",
		city: "",
	},
	phone: "",
	email: "",
	website: "",
	outgoingEmail: "",
	supplierInvoiceEmail: "",
	smsNumber: "",
};

export const LOGOTYPE_ALLOWED_TYPES = [
	"image/png",
	"image/jpeg",
	"application/pdf",
] as const;

export const LOGOTYPE_ACCEPT = LOGOTYPE_ALLOWED_TYPES.join(",");
