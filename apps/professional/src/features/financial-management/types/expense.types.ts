export type ExpenseStatus =
	| "klar"
	| "ej_attesterad"
	| "reklamerad"
	| "aktiv"
	| "ledig"
	| "ej_paborjad"
	| "pending"
	| "approved"
	| "paid"
	| "rejected";

export type ExpenseCategory =
	| "material"
	| "labor"
	| "equipment"
	| "travel"
	| "subcontractor"
	| "other";

export type SwedishVatRate = 25 | 12 | 6 | 0;

export interface ExpenseLineItem {
	id: string;
	description: string;
	quantity: number;
	unit: string;
	unitPrice: number;
	vatRate: SwedishVatRate;
	accountNumber: string;
	total: number;
}

export interface ExpenseAttachment {
	id: string;
	name: string;
	size: number;
	type: string;
	uploadedAt: string;
	url?: string;
}

export interface ExpenseTimeReportItem {
	id: string;
	date: string;
	referenceName: string;
	workedHours: number;
	unit: string;
	hourlyRate: number;
	total: number;
	comments?: string;
	included: boolean;
}

export interface RegisterExpenseFormData {
	supplier: string;
	fakturaNo: string;
	date: string;
	dueDate: string;
	category: ExpenseCategory;
	project: string;
	costCenter: string;
	lineItems: ExpenseLineItem[];
	attachments: ExpenseAttachment[];
	notes: string;
	timeReportItems: ExpenseTimeReportItem[];
	comments?: string;
}

export interface VatRateBreakdown {
	rate: SwedishVatRate;
	basisAmount: number;
	vatAmount: number;
}

export interface RegisterExpenseCalculations {
	subtotal: number;
	vatBreakdown: VatRateBreakdown[];
	totalVat: number;
	grandTotal: number;
}

export interface RegisterExpenseErrors {
	supplier?: string;
	fakturaNo?: string;
	date?: string;
	dueDate?: string;
	category?: string;
	lineItems?: string;
	general?: string;
}

export interface ExpenseItem {
	id: string;
	expenseNo: string;
	fakturaNo?: string;
	supplier: string;
	category: ExpenseCategory;
	amount: number;
	vatAmount: number;
	status: ExpenseStatus;
	date: string;
	invoiceDate?: string;
	dueDate: string;
	project: string;
	projectNumber: string;
	costCenter: string;
	attestResponsible?: string;
	invoiceRef?: string;
	notes?: string;
	receiptUrl?: string;
	isInboxItem?: boolean;
	lineItems?: ExpenseLineItem[];
	attachments?: ExpenseAttachment[];
}

export type ExpenseSortField =
	| "date"
	| "fakturaNo"
	| "expenseNo"
	| "supplier"
	| "project"
	| "amount"
	| "invoiceDate"
	| "dueDate"
	| "attestResponsible"
	| "status"
	| "category";

export interface ExpenseSummaryStats {
	totalExpenses: number;
	pendingApprovalCount: number;
	pendingApprovalAmount: number;
	thisMonthAmount: number;
	budgetUtilizationPercentage: number;
}

export interface ExpenseFilterState {
	search: string;
	status: ExpenseStatus | "all";
	category: ExpenseCategory | "all";
	project: string | "all";
	sortBy: ExpenseSortField;
	sortOrder: "asc" | "desc";
	page: number;
	pageSize: number;
}

