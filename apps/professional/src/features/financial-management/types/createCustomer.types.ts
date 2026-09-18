export type CustomerEntityType = "company" | "private";

export type CustomerRatingField =
	| "economy"
	| "environment"
	| "quality"
	| "collaboration"
	| "punctuality"
	| "service";

export type CustomerRatings = Record<CustomerRatingField, number>;

export interface CustomerContactPerson {
	id: string;
	firstName: string;
	lastName: string;
	mobilePhone: string;
	email: string;
	role: string;
	personalNo?: string;
}

export interface CustomerAttachedDocument {
	id: string;
	name: string;
	size: string;
	type: string;
	dateAdded: string;
	url?: string;
}

export interface AssociatedPerson {
	id: string;
	name: string;
	personalId: string;
	ownershipShare: number;
}

export interface CreateCustomerFormData {
	// Entity Type
	entityType: CustomerEntityType;

	// Step 1: Basic Info
	customerNo: string;
	status: string;
	companyName: string;
	firstName: string;
	lastName: string;
	orgNo: string;
	personnummer: string;
	mainCategory: string;
	department: string;
	region: string;
	vatRegNo: string;

	// Addresses
	visitingAddress: string;
	visitingPostalCode: string;
	visitingCity: string;
	sameAsVisitingAddress: boolean;
	invoiceAddress: string;
	invoicePostalCode: string;
	invoiceCity: string;

	// Bank Info
	bankName: string;
	bankAccount: string;
	bankgiro: string;
	plusgiro: string;
	iban: string;
	bic: string;

	// Step 2: Contact
	phone: string;
	email: string;
	website: string;
	contactNotes: string;
	contactPersons: CustomerContactPerson[];

	// Step 3: Assessment & Documents
	ratings: CustomerRatings;
	documents: CustomerAttachedDocument[];
	notes: string;

	// Step 4: Invoice, References & Bookkeeping
	paymentTerms: string;
	deliveryTerms: string;
	deliveryMethod: string;
	interestInvoicing: string;
	priceList: string;
	currency: string;
	creditLimit: string;
	invoiceDiscount: string;
	invoiceFee: string;
	shippingFee: string;
	pricesInclVat: string;
	ourReference: string;
	customerResponsible: string;
	externalReference: string;
	yourReference: string;
	vatNumber: string;
	vatType: string;
	salesAccount: string;
	costCenter: string;
	project: string;

	// ROT/RUT (for private customers)
	isRotRutEnabled: boolean;
	propertyDesignation: string;
	apartmentNumber: string;
	associatedPersons: AssociatedPerson[];
}
