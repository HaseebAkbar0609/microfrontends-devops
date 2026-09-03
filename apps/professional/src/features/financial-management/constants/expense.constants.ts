import localizationConstants from "@/utils/translation/constants";
import { ExpenseCategory, ExpenseStatus, ExpenseSortField } from "../types/expense.types";

export const DEFAULT_ANNUAL_EXPENSE_BUDGET = 1500000; // 1.5 Mkr in SEK
export const EXPENSE_DEFAULT_ATTEST_RESPONSIBLE = "-";
export const EXPENSE_DEFAULT_PAGE_SIZE = 10;

// Shared Tab Style Constants (Standard #1 - Zero Hardcoding)
export const EXPENSE_TOP_TAB_ACTIVE_CLASS = "py-3 text-xs font-bold border-b-2 text-slate-900 border-slate-900 transition-colors cursor-pointer";
export const EXPENSE_TOP_TAB_INACTIVE_CLASS = "py-3 text-xs font-medium border-b-2 text-slate-500 hover:text-slate-900 border-transparent transition-colors cursor-pointer";

export const EXPENSE_SUB_TAB_CONTAINER_CLASS = "inline-flex items-center bg-[#F3F4F6] p-1 rounded-lg gap-1 border border-slate-200/60 shadow-2xs";
export const EXPENSE_SUB_TAB_ACTIVE_CLASS = "px-4 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer bg-white text-slate-900 shadow-xs border border-slate-200/80";
export const EXPENSE_SUB_TAB_INACTIVE_CLASS = "px-4 py-1.5 text-xs font-normal rounded-md transition-all cursor-pointer text-slate-600 hover:text-slate-900 hover:bg-white/40 border border-transparent";

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
