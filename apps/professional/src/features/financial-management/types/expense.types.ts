export type ExpenseStatus = "pending" | "approved" | "paid" | "rejected";

export type ExpenseCategory = "material" | "labor" | "equipment" | "travel" | "other";

export interface ExpenseItem {
	id: string;
	expenseNo: string;
	supplier: string;
	category: ExpenseCategory;
	amount: number;
	vatAmount: number;
	status: ExpenseStatus;
	date: string;
	dueDate: string;
	project: string;
	projectNumber: string;
	costCenter: string;
	invoiceRef?: string;
	notes?: string;
	receiptUrl?: string;
}

export type ExpenseSortField =
	| "expenseNo"
	| "supplier"
	| "category"
	| "amount"
	| "status"
	| "date"
	| "dueDate"
	| "project";

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
