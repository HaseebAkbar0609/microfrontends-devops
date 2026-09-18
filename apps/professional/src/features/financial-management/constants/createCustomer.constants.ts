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

export const CUSTOMER_STATUS_OPTIONS = [
	{ value: "active", labelKey: "activeStatus" },
	{ value: "prospect", labelKey: "prospectStatus" },
	{ value: "inactive", labelKey: "inactiveStatus" },
];

export const MAIN_CATEGORY_OPTIONS = [
	{ value: "bygg", label: "Bygg & Anläggning" },
	{ value: "el", label: "El & Belysning" },
	{ value: "vvs", label: "VVS & Sanitet" },
	{ value: "konsult", label: "Konsulttjänster" },
	{ value: "other", label: "Övrigt" },
];

export const CONTACT_ROLE_OPTIONS = [
	{ value: "Beställare", label: "Beställare" },
	{ value: "Ekonomiansvarig", label: "Ekonomiansvarig" },
	{ value: "Projektledare", label: "Projektledare" },
	{ value: "Platschef", label: "Platschef" },
	{ value: "Övrig", label: "Övrig" },
];

export const PAYMENT_TERMS_OPTIONS = [
	{ value: "10", label: "10 dagar" },
	{ value: "15", label: "15 dagar" },
	{ value: "20", label: "20 dagar" },
	{ value: "30", label: "30 dagar" },
	{ value: "60", label: "60 dagar" },
];

export const CURRENCY_OPTIONS = [
	{ value: "SEK", label: "SEK" },
	{ value: "EUR", label: "EUR" },
	{ value: "USD", label: "USD" },
	{ value: "NOK", label: "NOK" },
];

export const VAT_TYPE_OPTIONS = [
	{ value: "25%", label: "25 % (Standard)" },
	{ value: "12%", label: "12 % (Livsmedel / Hotell)" },
	{ value: "6%", label: "6 % (Kultur / Böcker)" },
	{ value: "0%", label: "0 % (Momsfri / Export)" },
];
