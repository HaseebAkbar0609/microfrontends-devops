import type {
	CreateCustomerFormData,
	CustomerRatings,
} from "../types/createCustomer.types";

export const STORAGE_KEY_CUSTOMER_DRAFT = "tf_professional_create_customer_draft_v1";

export const DEFAULT_CUSTOMER_RATINGS: CustomerRatings = {
	economy: 0,
	environment: 0,
	quality: 0,
	collaboration: 0,
	punctuality: 0,
	service: 0,
};

export const DEFAULT_INITIAL_CUSTOMER_FORM_VALUES: CreateCustomerFormData = {
	entityType: "company",
	customerNo: "",
	status: "prospect",
	companyName: "",
	firstName: "",
	lastName: "",
	orgNo: "",
	personnummer: "",
	mainCategory: "",
	department: "",
	region: "",
	vatRegNo: "",
	visitingAddress: "",
	visitingPostalCode: "",
	visitingCity: "",
	sameAsVisitingAddress: false,
	invoiceAddress: "",
	invoicePostalCode: "",
	invoiceCity: "",
	bankName: "",
	bankAccount: "",
	bankgiro: "",
	plusgiro: "",
	iban: "",
	bic: "",
	phone: "",
	email: "",
	website: "",
	contactNotes: "",
	contactPersons: [
		{
			id: "contact-1",
			firstName: "",
			lastName: "",
			mobilePhone: "",
			email: "",
			role: "Beställare",
			personalNo: "",
		},
	],
	ratings: DEFAULT_CUSTOMER_RATINGS,
	documents: [],
	notes: "",
	paymentTerms: "30",
	deliveryTerms: "Fritt vårt lager",
	deliveryMethod: "Post",
	interestInvoicing: "Ja",
	priceList: "Standard",
	currency: "SEK",
	invoiceDiscount: "0",
	invoiceFee: "0",
	shippingFee: "0",
	pricesInclVat: "exkl",
	ourReference: "",
	customerResponsible: "",
	externalReference: "",
	yourReference: "",
	vatNumber: "",
	vatType: "25%",
	salesAccount: "3000",
	costCenter: "",
	project: "",
	isRotRutEnabled: false,
	propertyDesignation: "",
	apartmentNumber: "",
	associatedPersons: [],
};

import localizationConstants from "@/utils/translation/constants";

export const CUSTOMER_STATUS_OPTIONS: { value: string; labelKey: keyof typeof localizationConstants }[] = [
	{ value: "active", labelKey: "customerStatusActive" },
	{ value: "prospect", labelKey: "customerStatusProspect" },
	{ value: "inactive", labelKey: "customerStatusInactive" },
];

export const MAIN_CATEGORY_OPTIONS: { value: string; labelKey: keyof typeof localizationConstants }[] = [
	{ value: "bygg", labelKey: "customerCategoryBygg" },
	{ value: "el", labelKey: "customerCategoryEl" },
	{ value: "vvs", labelKey: "customerCategoryVvs" },
	{ value: "konsult", labelKey: "customerCategoryKonsult" },
	{ value: "other", labelKey: "customerCategoryOther" },
];

export const CONTACT_ROLE_OPTIONS: { value: string; labelKey: keyof typeof localizationConstants }[] = [
	{ value: "Beställare", labelKey: "customerRolePurchaser" },
	{ value: "Ekonomiansvarig", labelKey: "customerRoleFinance" },
	{ value: "Projektledare", labelKey: "customerRoleProjectLeader" },
	{ value: "Platschef", labelKey: "customerRoleSiteManager" },
	{ value: "Övrig", labelKey: "customerRoleOther" },
];

export const PAYMENT_TERMS_OPTIONS: { value: string; labelKey: keyof typeof localizationConstants }[] = [
	{ value: "10", labelKey: "customerPaymentTerms10" },
	{ value: "15", labelKey: "customerPaymentTerms15" },
	{ value: "20", labelKey: "customerPaymentTerms20" },
	{ value: "30", labelKey: "customerPaymentTerms30" },
	{ value: "60", labelKey: "customerPaymentTerms60" },
];

export const CURRENCY_OPTIONS = [
	{ value: "SEK", label: "SEK" },
	{ value: "EUR", label: "EUR" },
	{ value: "USD", label: "USD" },
	{ value: "NOK", label: "NOK" },
];

export const VAT_TYPE_OPTIONS: { value: string; labelKey: keyof typeof localizationConstants }[] = [
	{ value: "25%", labelKey: "customerVatStandard" },
	{ value: "12%", labelKey: "customerVatReduced12" },
	{ value: "6%", labelKey: "customerVatReduced6" },
	{ value: "0%", labelKey: "customerVatZero" },
];
