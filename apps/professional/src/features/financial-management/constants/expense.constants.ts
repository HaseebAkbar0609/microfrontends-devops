import localizationConstants from "@/utils/translation/constants";
import { ExpenseCategory, ExpenseStatus, ExpenseSortField } from "../types/expense.types";

export const EXPENSES_STORAGE_KEY = "tfs_prof_expenses_v1";

export const DEFAULT_ANNUAL_EXPENSE_BUDGET = 1500000; // 1.5 Mkr in SEK

export const expenseBreadcrumbs = [
	{ label: localizationConstants.home, href: "/" },
	{ label: localizationConstants.module, href: "/module" },
	{ label: localizationConstants.economy, href: "/module/financial-management/economy" },
	{ label: localizationConstants.expenseOverviewTitle, href: "/module/financial-management/economy" },
	{ label: localizationConstants.expenseTopTabSupplierInvoice, href: "/module/financial-management/economy" },
];

export const EXPENSE_CATEGORIES: { value: ExpenseCategory; labelKey: string }[] = [
	{ value: "material", labelKey: localizationConstants.expenseCategoryMaterial },
	{ value: "labor", labelKey: localizationConstants.expenseCategoryLabor },
	{ value: "equipment", labelKey: localizationConstants.expenseCategoryEquipment },
	{ value: "travel", labelKey: localizationConstants.expenseCategoryTravel },
	{ value: "other", labelKey: localizationConstants.expenseCategoryOther },
];

export const EXPENSE_STATUSES: { value: ExpenseStatus; labelKey: string }[] = [
	{ value: "klar", labelKey: localizationConstants.expenseStatusKlar },
	{ value: "ej_attesterad", labelKey: localizationConstants.expenseStatusEjAttesterad },
	{ value: "reklamerad", labelKey: localizationConstants.expenseStatusReklamerad },
	{ value: "aktiv", labelKey: localizationConstants.expenseStatusAktiv },
	{ value: "ledig", labelKey: localizationConstants.expenseStatusLedig },
	{ value: "ej_paborjad", labelKey: localizationConstants.expenseStatusEjPaborjad },
	{ value: "pending", labelKey: localizationConstants.expenseStatusPending },
	{ value: "approved", labelKey: localizationConstants.expenseStatusApproved },
	{ value: "paid", labelKey: localizationConstants.expenseStatusPaid },
	{ value: "rejected", labelKey: localizationConstants.expenseStatusRejected },
];

export const EXPENSE_TABLE_COLUMNS: {
	field: ExpenseSortField;
	labelKey: string;
	align?: "left" | "right" | "center";
}[] = [
	{ field: "date", labelKey: localizationConstants.expenseColDate },
	{ field: "fakturaNo", labelKey: localizationConstants.expenseColInvoiceNo },
	{ field: "supplier", labelKey: localizationConstants.expenseColSupplier },
	{ field: "project", labelKey: localizationConstants.expenseColObject },
	{ field: "amount", labelKey: localizationConstants.expenseColAmount, align: "right" },
	{ field: "invoiceDate", labelKey: localizationConstants.expenseColInvoiceDate },
	{ field: "dueDate", labelKey: localizationConstants.expenseColDueDate },
	{ field: "attestResponsible", labelKey: localizationConstants.expenseColAttestResponsible },
	{ field: "status", labelKey: localizationConstants.expenseColStatus },
];
