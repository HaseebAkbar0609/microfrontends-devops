import type {
	CreateSupplierFormData,
	SupplierRatings,
} from "../types/createSupplier.types";
import localizationConstants from "@/utils/translation/constants";

export const STORAGE_KEY_SUPPLIER_DRAFT = "tf_professional_create_supplier_draft_v1";

export const DEFAULT_SUPPLIER_RATINGS: SupplierRatings = {
	economy: 0,
	environment: 0,
	quality: 0,
	collaboration: 0,
	timeliness: 0,
};

export const DEFAULT_INITIAL_SUPPLIER_FORM_VALUES: CreateSupplierFormData = {
	levNr: "",
	status: "active",
	companyName: "",
	mainCategory: "",
	department: "",
	region: "",
	orgNo: "",
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
	paymentDays: "30",
	interestRate: "8",
	invoiceFee: "0",
	collectionFee: "180",
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
			role: "Säljare",
			personalNo: "",
		},
	],
	ratings: DEFAULT_SUPPLIER_RATINGS,
	documents: [],
	additionalNotes: "",
};

export const SUPPLIER_STATUS_OPTIONS: { value: string; labelKey: keyof typeof localizationConstants }[] = [
	{ value: "active", labelKey: "supplierStatusActive" },
	{ value: "prospect", labelKey: "supplierStatusProspect" },
	{ value: "inactive", labelKey: "supplierStatusInactive" },
];

export const SUPPLIER_MAIN_CATEGORY_OPTIONS = [
	{ value: "Byggmaterial", label: "Byggmaterial" },
	{ value: "El & Belysning", label: "El & Belysning" },
	{ value: "VVS & Sanitet", label: "VVS & Sanitet" },
	{ value: "Maskin & Verktyg", label: "Maskin & Verktyg" },
	{ value: "Konsulttjänster", label: "Konsulttjänster" },
	{ value: "Övrigt", label: "Övrigt" },
];

export const SUPPLIER_CONTACT_ROLE_OPTIONS = [
	{ value: "Säljare", label: "Säljare" },
	{ value: "Ekonomiansvarig", label: "Ekonomiansvarig" },
	{ value: "Orderansvarig", label: "Orderansvarig" },
	{ value: "Kundansvarig", label: "Kundansvarig" },
	{ value: "Platschef", label: "Platschef" },
	{ value: "Övrig", label: "Övrig" },
];
