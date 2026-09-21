export type SupplierRatingField =
	| "economy"
	| "environment"
	| "quality"
	| "collaboration"
	| "timeliness";

export type SupplierRatings = Record<SupplierRatingField, number>;

export interface SupplierContactPerson {
	id: string;
	firstName: string;
	lastName: string;
	mobilePhone: string;
	email: string;
	role: string;
	personalNo?: string;
}

export interface SupplierAttachedDocument {
	id: string;
	name: string;
	size: string;
	type: string;
	dateAdded: string;
	url?: string;
}

export interface CreateSupplierFormData {
	// Step 1: Basic Info (Grundläggande information)
	levNr: string;
	status: string;
	companyName: string;
	mainCategory: string;
	department: string;
	region: string;
	orgNo: string;
	vatRegNo: string;

	// Addresses
	visitingAddress: string;
	visitingPostalCode: string;
	visitingCity: string;
	sameAsVisitingAddress: boolean;
	invoiceAddress: string;
	invoicePostalCode: string;
	invoiceCity: string;

	// Bank Information
	bankName: string;
	bankAccount: string;
	bankgiro: string;
	plusgiro: string;
	iban: string;
	bic: string;

	// Payment Terms
	paymentDays: string;
	interestRate: string;
	invoiceFee: string;
	collectionFee: string;

	// Step 2: Contact (Kontakt)
	phone: string;
	email: string;
	website: string;
	contactNotes: string;
	contactPersons: SupplierContactPerson[];

	// Step 3: Assessment & Documents (Bedömning)
	ratings: SupplierRatings;
	documents: SupplierAttachedDocument[];
	additionalNotes: string;
}
