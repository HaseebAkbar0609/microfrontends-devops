export type BankTabType = "bankkonton" | "lan-finansiering" | "bank-dokument";

export type BankDetailTabType = "grundlaggande-info" | "dokument";

export type BankIdAuthState =
	| "idle"
	| "waiting_app"
	| "authenticating"
	| "success"
	| "error";

export interface SupportedBank {
	id: string;
	name: string;
	shortName: string;
	bic: string;
	badgeBg: string;
	badgeText: string;
	isPopular?: boolean;
}

export interface BankContactPerson {
	name: string;
	role: string;
	email: string;
	phone: string;
}

export interface BankDocumentItem {
	id: string;
	date: string;
	name: string;
	fileType: string;
	fileUrl?: string;
	fileSize?: string;
	loanId?: string;
	accountId?: string;
}

export interface BankAccountItem {
	id: string;
	title?: string;
	bankName: string;
	accountType: string;
	accountNumber: string;
	iban: string;
	swiftBic: string;
	currency: string;
	balance: number;
	contactPerson: BankContactPerson;
	isConnected?: boolean;
	connectionType?: "bankid" | "manual";
	autoDailySync?: boolean;
	lastSync?: string;
	syncStatus?: "synced" | "syncing" | "error";
	documents?: BankDocumentItem[];
	createdAt: string;
	updatedAt: string;
}

export interface BankLoanItem {
	id: string;
	loanNr: string;
	title: string;
	loanType: string;
	bank: string;
	supplier?: string;
	paymentTerms?: string;
	discount?: string;
	overdueInterest?: string;
	startDate: string;
	endDate: string;
	status: "active" | "inactive";
	interestRate: number;
	monthlyCost: number;
	originalAmount: number;
	remainingDebt: number;
	repaidPercent: number;
	contactPerson: BankContactPerson;
	documents: BankDocumentItem[];
	createdAt: string;
	updatedAt: string;
}

export interface BankLoanFormData {
	id?: string;
	loanNr?: string;
	title: string;
	loanType: string;
	bank: string;
	supplier?: string;
	paymentTerms?: string;
	discount?: string;
	overdueInterest?: string;
	startDate: string;
	endDate: string;
	status?: "active" | "inactive";
	interestRate?: number;
	monthlyCost?: number;
	originalAmount?: number;
	remainingDebt?: number;
	repaidPercent?: number;
	contactPerson?: BankContactPerson;
	documents?: BankDocumentItem[];
}

export interface BankAccountFormData {
	id?: string;
	title?: string;
	bankName: string;
	accountType: string;
	accountNumber: string;
	iban: string;
	swiftBic: string;
	currency: string;
	balance: number;
	contactPerson: BankContactPerson;
	isConnected?: boolean;
	connectionType?: "bankid" | "manual";
	autoDailySync?: boolean;
	syncNow?: boolean;
	lastSync?: string;
	syncStatus?: "synced" | "syncing" | "error";
	documents?: BankDocumentItem[];
}

export type BankSortField =
	| "loanNr"
	| "title"
	| "loanType"
	| "bank"
	| "startDate"
	| "endDate"
	| "status";

export type BankDocSortField = "date" | "name" | "fileType";

export type BankSortOrder = "asc" | "desc";
export type SortOrder = BankSortOrder;

