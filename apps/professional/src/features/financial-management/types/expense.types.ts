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

export type ExpenseCategory = "material" | "labor" | "equipment" | "travel" | "other";

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
