import type {
	SupplierContactPerson,
	SupplierAttachedDocument,
	SupplierRatings,
} from "./createSupplier.types";

export type SupplierDetailTab = "basic" | "contact" | "assessment" | "invoices";

export interface SupplierInvoiceRow {
	id: string;
	invoiceNumber: string;
	date: string;
	dueDate: string;
	totalAmount: string;
	status: "paid" | "pending" | "overdue";
}

export interface SupplierDetailData {
	id: string;
	levNr: string;
	name: string;
	status: string;
	mainCategory: string;
	department?: string;
	region?: string;
	orgNo: string;
	vatRegNo?: string;

	// Visiting Address
	visitingAddress: string;
	visitingPostalCode: string;
	visitingCity: string;
	visitingCountry?: string;

	// Invoice Address
	invoiceAddress?: string;
	invoicePostalCode?: string;
	invoiceCity?: string;
	invoiceCountry?: string;

	// Bank Information
	bankName?: string;
	bankAccount?: string;
	bankgiro?: string;
	plusgiro?: string;
	iban?: string;
	bic?: string;

	// Payment Terms
	paymentDays?: string;
	interestRate?: string;
	invoiceFee?: string;
	collectionFee?: string;

	// Contact Information
	phone: string;
	email: string;
	website?: string;
	contactNotes?: string;
	contactPersons: SupplierContactPerson[];

	// Assessment & Documents
	ratings: SupplierRatings;
	documents: SupplierAttachedDocument[];
	additionalNotes?: string;

	// Invoices
	invoices?: SupplierInvoiceRow[];
}
