export type BankTabType = "bankkonton" | "lan-finansiering" | "bank-dokument";

export type BankDetailTabType = "grundlaggande-info" | "dokument";

export interface BankContactPerson {
	name: string;
	role: string;
	email: string;
	phone: string;
}

export interface BankAccountItem {
	id: string;
	bankName: string;
	accountType: string;
	accountNumber: string;
	iban: string;
	swiftBic: string;
	currency: string;
	balance: number;
	contactPerson: BankContactPerson;
	createdAt: string;
	updatedAt: string;
}

export interface BankDocumentItem {
	id: string;
	date: string;
	name: string;
	fileType: string;
	fileUrl?: string;
	fileSize?: string;
	loanId?: string;
}

export interface BankLoanItem {
	id: string;
	loanNr: string;
	title: string;
	loanType: string;
	bank: string;
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
	startDate: string;
	endDate: string;
	status?: "active" | "inactive";
	interestRate?: number;
	monthlyCost?: number;
	originalAmount?: number;
	remainingDebt?: number;
	repaidPercent?: number;
	contactPerson?: BankContactPerson;
}

export interface BankAccountFormData {
	id?: string;
	bankName: string;
	accountType: string;
	accountNumber: string;
	iban: string;
	swiftBic: string;
	currency: string;
	balance: number;
	contactPerson: BankContactPerson;
}

export type BankSortField =
	| "loanNr"
	| "title"
	| "loanType"
	| "bank"
	| "startDate"
	| "endDate"
	| "status";

export type BankSortOrder = "asc" | "desc";
export type SortOrder = BankSortOrder;
