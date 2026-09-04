import type { CompanyInformationFormValues } from "../schemas/companyInformation.schema";

export const DEFAULT_VALUES: CompanyInformationFormValues = {
	companyName: "Timeflowsystem Danmark Ltd",
	orgNumber: "",
	vatNumber: "SE560080100101",
	sniCode: "5-780057",
	postalAddress: {
		streetAddress: "Stengatan 11",
		postalCode: "175 10",
		city: "Järfälla",
	},
	visitingAddress: {
		streetAddress: "Stengatan 11",
		postalCode: "175 10",
		city: "Järfälla",
	},
	deliveryAddress: {
		streetAddress: "Stengatan 11",
		postalCode: "175 10",
		city: "Järfälla",
	},
	switchboardNumber: "",
	email: "Ann@example.com",
	website: "",
};
