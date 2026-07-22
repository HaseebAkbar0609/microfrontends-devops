import type { PartnerCompanyProfileFormValues } from "../schemas/companyProfile.schema";

const stengatanAddress = {
	streetAddress: "Stengatan 11",
	postalCode: "175 10",
	city: "Järfälla",
};

export const DEFAULT_VALUES: PartnerCompanyProfileFormValues = {
	companyLogotype: null,
	companyName: "Timeflowsystem Danmark Ltd",
	orgNumber: "",
	vatNumber: "SE560080100101",
	sniCode: "5-789057",
	postalAddress: stengatanAddress,
	storeAddress: stengatanAddress,
	deliveryAddress: stengatanAddress,
	switchboardNumber: "",
	email: "Ann@example.com",
	website: "",
	storePostalAddress: stengatanAddress,
	storeVisitAddress: stengatanAddress,
	storeDeliveryAddress: stengatanAddress,
	storeSwitchboardNumber: "",
	storeEmail: "Ann@example.com",
	storeWebsite: "",
};
