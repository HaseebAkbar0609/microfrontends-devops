import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { ExpenseCategory, ExpenseSortField, ExpenseStatus } from "../types/expense.types";

export const EXPENSES_STORAGE_KEY = "tfs_professional_expenses_v1";

export const DEFAULT_ANNUAL_EXPENSE_BUDGET = 1500000; // 1.5M SEK reference budget

export interface ExpenseColumnConfig {
	field: ExpenseSortField;
	labelKey: TranslationKeys;
	align?: "left" | "right" | "center";
}

export const EXPENSE_TABLE_COLUMNS: ExpenseColumnConfig[] = [
	{ field: "expenseNo", labelKey: localizationConstants.expenseColId },
	{ field: "supplier", labelKey: localizationConstants.expenseColSupplier },
	{ field: "category", labelKey: localizationConstants.expenseColCategory },
	{ field: "amount", labelKey: localizationConstants.expenseColAmount, align: "right" },
	{ field: "status", labelKey: localizationConstants.expenseColStatus },
	{ field: "date", labelKey: localizationConstants.expenseColDate },
	{ field: "dueDate", labelKey: localizationConstants.expenseColDueDate },
	{ field: "project", labelKey: localizationConstants.expenseColProject },
];

export const expenseBreadcrumbs = [
	{ label: localizationConstants.home, href: "/home" },
	{ label: localizationConstants.moduleItem, href: "/module/financial-management" },
	{ label: localizationConstants.economy, href: "/module/financial-management/economy" },
	{ label: localizationConstants.expenseOverviewTitle },
];

export const EXPENSE_CATEGORIES: { value: ExpenseCategory; labelKey: TranslationKeys }[] = [
	{ value: "material", labelKey: localizationConstants.expenseCategoryMaterial },
	{ value: "labor", labelKey: localizationConstants.expenseCategoryLabor },
	{ value: "equipment", labelKey: localizationConstants.expenseCategoryEquipment },
	{ value: "travel", labelKey: localizationConstants.expenseCategoryTravel },
	{ value: "other", labelKey: localizationConstants.expenseCategoryOther },
];

export const EXPENSE_STATUSES: { value: ExpenseStatus; labelKey: TranslationKeys }[] = [
	{ value: "pending", labelKey: localizationConstants.expenseStatusPending },
	{ value: "approved", labelKey: localizationConstants.expenseStatusApproved },
	{ value: "paid", labelKey: localizationConstants.expenseStatusPaid },
	{ value: "rejected", labelKey: localizationConstants.expenseStatusRejected },
];
