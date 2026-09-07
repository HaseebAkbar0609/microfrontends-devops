import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { InvoiceSortField, ReminderSortField } from "../types/invoice.types";

export const VAT_RATE = 0.25;

export const INVOICES_STORAGE_KEY = "tfs_professional_invoices_v3";
export const DETAILS_STORAGE_KEY = "tfs_professional_invoice_details_v3";

export interface InvoiceColumnConfig {
	field: InvoiceSortField;
	labelKey: TranslationKeys;
	align?: "left" | "right" | "center";
}

export const INVOICE_TABLE_COLUMNS: InvoiceColumnConfig[] = [
	{ field: "invoiceNo", labelKey: localizationConstants.invoiceColumnInvoiceNo },
	{ field: "ocr", labelKey: localizationConstants.invoiceColumnOcr },
	{ field: "object", labelKey: localizationConstants.invoiceColumnObject },
	{ field: "type", labelKey: localizationConstants.invoiceColumnType },
	{ field: "customer", labelKey: localizationConstants.invoiceColumnCustomer },
	{ field: "invoiceDate", labelKey: localizationConstants.invoiceColumnInvoiceDate },
	{ field: "costCenter", labelKey: localizationConstants.invoiceColumnCostCenter },
	{ field: "projectLeader", labelKey: localizationConstants.invoiceColumnProjectLeader },
	{ field: "location", labelKey: localizationConstants.invoiceColumnLocation },
	{ field: "contractType", labelKey: localizationConstants.invoiceColumnContractType },
	{ field: "total", labelKey: localizationConstants.invoiceColumnTotal },
	{ field: "balance", labelKey: localizationConstants.invoiceColumnBalance },
	{ field: "dueDate", labelKey: localizationConstants.invoiceColumnDueDate },
	{ field: "fullyPaidDate", labelKey: localizationConstants.invoiceColumnFullyPaidDate },
	{ field: "status", labelKey: localizationConstants.invoiceColumnStatus },
];

export interface ReminderColumnConfig {
	field: ReminderSortField;
	labelKey: TranslationKeys;
	align?: "left" | "right" | "center";
}

export const REMINDER_TABLE_COLUMNS: ReminderColumnConfig[] = [
	{ field: "id", labelKey: localizationConstants.invoiceRemindersColId },
	{ field: "customer", labelKey: localizationConstants.invoiceRemindersColCustomer },
	{ field: "email", labelKey: localizationConstants.invoiceRemindersColEmail },
	{ field: "amount", labelKey: localizationConstants.invoiceRemindersColAmount },
	{ field: "latestReminder", labelKey: localizationConstants.invoiceRemindersColLatest },
	{ field: "remindersLeft", labelKey: localizationConstants.invoiceRemindersColLeft },
	{ field: "status", labelKey: localizationConstants.invoiceRemindersColStatus },
];

export const invoiceBreadcrumbs = [
	{ label: localizationConstants.home, href: "/home" },
	{ label: localizationConstants.moduleItem, href: "/module/financial-management" },
	{ label: localizationConstants.invoice, href: "/module/financial-management/invoice" },
	{ label: localizationConstants.invoiceOverviewTitle },
];
