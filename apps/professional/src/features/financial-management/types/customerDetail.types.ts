import type {
	CustomerEntityType,
	CustomerContactPerson,
	CustomerAttachedDocument,
} from "./createCustomer.types";

export type CustomerDetailTab = "basic" | "contact" | "assessment" | "invoice";

export interface CustomerDetailRatings {
	solvency: number;
	cooperation: number;
	clarity: number;
	availability: number;
	environment: number;
	timeliness: number;
}

export interface CustomerDetailData {
	id: string;
	customerNo: string;
	entityType: CustomerEntityType;
	name: string;
	orgNo: string;
	vatRegNo: string;
	gln?: string;
	peppolId?: string;

	// Bank Info
	bankName?: string;
	bankAccount?: string;
	bankgiro?: string;
	plusgiro?: string;
	iban?: string;
	bic?: string;

	// Visiting Address
	visitingAddress: string;
	visitingPostalCode: string;
	visitingCity: string;
	visitingCountry: string;

	// Invoice Address
	invoiceAddress: string;
	invoicePostalCode: string;
	invoiceCity: string;
	invoiceCountry: string;

	// Contact Information
	phone: string;
	email: string;
	website?: string;
	contactPersons: CustomerContactPerson[];

	// Assessment
	ratings: CustomerDetailRatings;
	documents: CustomerAttachedDocument[];
	notes?: string;

	// Invoicing & Terms
	paymentTerms: string;
	deliveryTerms?: string;
	deliveryMethod?: string;
	overdueInterest?: string;
	invoiceMethod?: string;
	invoiceEmail?: string;
	priceList?: string;
	invoiceDiscount?: string;
	invoiceFee?: string;
	shippingFee?: string;
	pricesInclVat?: string;
	interestInvoicing?: string;

	// References
	ourReference?: string;
	customerResponsible?: string;
	yourReference?: string;
	externalReference?: string;

	// Accounting
	vatNumber?: string;
	vatType?: string;
	salesAccount?: string;
	costCenter?: string;
	project?: string;

	// ROT / RUT
	isRotRutEnabled?: boolean;
	rotRutType?: string;
	propertyDesignation?: string;
	apartmentNumber?: string;
	brfOrgNo?: string;
}
