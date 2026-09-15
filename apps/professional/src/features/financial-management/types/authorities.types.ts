export type AuthorityCategory =
	| "Govt Docs"
	| "Financial"
	| "Tax"
	| "Legal"
	| "Insurance";

export type AuthorityStatus =
	| "pending"
	| "submitted"
	| "approved"
	| "action_required";

export interface AuthorityPartyContact {
	companyName: string;
	contactPerson: string;
	address: string;
	postalCodeCity: string;
	email: string;
	phone: string;
}

export interface AuthorityProjectInfo {
	projectNumber: string;
	projectName: string;
}

export interface AuthorityLineItem {
	id: string;
	articleNumber: string;
	description: string;
	quantity: number;
	unit: string;
	price: number;
	subtotal: number;
	handling?: string;
}

export interface AuthorityFinancialSummary {
	subtotal: number;
	freightFee: number;
	invoiceFee: number;
	totalExclVat: number;
	vatRate: number;
	vatAmount: number;
	note?: string;
}

export interface AuthorityCompanyDetails {
	companyName: string;
	address: string;
	vatNumber: string;
	orgNumber: string;
	fTax: boolean;
	bankName: string;
	bankNumber: string;
	iban: string;
	bic: string;
	swishNumber: string;
	email: string;
	phone: string;
	paymentTermsNotice?: string;
}

export interface AuthorityComment {
	id: string;
	author: string;
	avatarUrl?: string;
	date: string;
	message: string;
}

export interface AuthorityAttachment {
	id: string;
	name: string;
	fileType: "PDF" | "DOC" | "DOCX" | "PNG" | "JPG" | "XLSX";
	fileUrl?: string;
	fileSize?: string;
	date?: string;
	uploadDate?: string;
}

export interface AuthorityItem {
	id: string;
	caseNr: string;
	category: AuthorityCategory;
	authorityName: string;
	subject: string;
	documentName: string;
	date: string;
	dueDate?: string;
	status: AuthorityStatus;
	responsiblePerson: string;
	referenceNumber?: string;
	invoiceNumber?: string;
	paymentTerms?: string;
	contractNumber?: string;
	fileType?: "PDF" | "DOC" | "DOCX" | "PNG" | "JPG" | "XLSX";
	fileName?: string;
	fileUrl?: string;
	// Detailed Case View properties (Screenshots 3, 4, 5)
	customer?: AuthorityPartyContact;
	supplier?: AuthorityPartyContact;
	project?: AuthorityProjectInfo;
	lineItems?: AuthorityLineItem[];
	totals?: AuthorityFinancialSummary;
	companyDetails?: AuthorityCompanyDetails;
	comments?: AuthorityComment[];
	attachments?: AuthorityAttachment[];
	createdAt: string;
	updatedAt: string;
}

export interface AuthorityFormData {
	id?: string;
	caseNr?: string;
	category: AuthorityCategory;
	authorityName: string;
	subject: string;
	documentName: string;
	date: string;
	dueDate?: string;
	status?: AuthorityStatus;
	responsiblePerson?: string;
	referenceNumber?: string;
	invoiceNumber?: string;
	paymentTerms?: string;
	contractNumber?: string;
	fileType?: "PDF" | "DOC" | "DOCX" | "PNG" | "JPG" | "XLSX";
	fileName?: string;
	fileUrl?: string;
	attachments?: AuthorityAttachment[];
}

export type AuthoritySortField =
	| "caseNr"
	| "category"
	| "date"
	| "documentName"
	| "fileName"
	| "status"
	| "authorityName";

export type AuthoritySortOrder = "asc" | "desc";
