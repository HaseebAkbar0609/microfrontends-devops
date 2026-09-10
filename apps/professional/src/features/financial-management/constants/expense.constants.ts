import localizationConstants from "@/utils/translation/constants";
import { ECONOMY_SUPPLIER_INVOICES_BASE_URL } from "./economyNav.config";
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
	{ label: localizationConstants.expenseOverviewTitle, href: ECONOMY_SUPPLIER_INVOICES_BASE_URL },
	{ label: localizationConstants.expenseTopTabSupplierInvoice, href: ECONOMY_SUPPLIER_INVOICES_BASE_URL },
];

export const EXPENSE_CATEGORIES: { value: ExpenseCategory; labelKey: string }[] = [
	{ value: "material", labelKey: localizationConstants.expenseCategoryMaterial },
	{ value: "labor", labelKey: localizationConstants.expenseCategoryLabor },
	{ value: "equipment", labelKey: localizationConstants.expenseCategoryEquipment },
	{ value: "travel", labelKey: localizationConstants.expenseCategoryTravel },
	{ value: "subcontractor", labelKey: localizationConstants.expenseCategorySubcontractor },
	{ value: "other", labelKey: localizationConstants.expenseCategoryOther },
];

export const SWEDISH_VAT_RATES = [25, 12, 6, 0] as const;
export const DEFAULT_VAT_RATE = 25;

export const DEFAULT_EXPENSE_UNITS = [
	{ value: "st", label: "st" },
	{ value: "tim", label: "tim" },
	{ value: "km", label: "km" },
	{ value: "mån", label: "mån" },
	{ value: "dagar", label: "dagar" },
	{ value: "kg", label: "kg" },
	{ value: "m", label: "m" },
] as const;

export const STANDARD_BAS_ACCOUNTS = [
	{ code: "4010", name: "Inköp material och varor" },
	{ code: "4011", name: "Inköp underentreprenader" },
	{ code: "5010", name: "Lokalhyra" },
	{ code: "5410", name: "Förbrukningsinventarier" },
	{ code: "5610", name: "Personbilar och transportmedel" },
	{ code: "5800", name: "Resekostnader" },
	{ code: "6070", name: "Representation" },
	{ code: "6540", name: "IT-tjänster och programvaror" },
	{ code: "6990", name: "Övriga externa kostnader" },
] as const;

export const SUPPORTED_CURRENCIES = [
	{ code: "SEK", symbol: "kr", label: "SEK - Svenska Kronor" },
	{ code: "EUR", symbol: "€", label: "EUR - Euro" },
	{ code: "USD", symbol: "$", label: "USD - US Dollar" },
	{ code: "NOK", symbol: "kr", label: "NOK - Norska Kronor" },
	{ code: "DKK", symbol: "kr", label: "DKK - Danska Kronor" },
] as const;

export const DEFAULT_SUPPLIERS_LIST = [
	"Ahlsell Sverige AB",
	"Beijer Byggmaterial AB",
	"Bygg-Max AB",
	"Cleaning Services AB",
	"Cramo AB",
	"Ramirent AB",
	"Renta AB",
	"Würth Svenska AB",
	"Elektroskandia Sverige",
];

export const DEFAULT_SUPPLIERS_METADATA: Record<string, {
	name: string;
	orgNo: string;
	address: string;
	postalCity?: string;
	phone?: string;
	email?: string;
	bankgiro?: string;
	fTax?: boolean;
}> = {
	"Ahlsell Sverige AB": {
		name: "Ahlsell Sverige AB",
		orgNo: "556012-9205",
		address: "Rosterigränd 12",
		postalCity: "117 98 Stockholm",
		phone: "08-685 70 00",
		email: "ekonomi@ahlsell.se",
		bankgiro: "234-5678",
		fTax: true,
	},
	"Beijer Byggmaterial AB": {
		name: "Beijer Byggmaterial AB",
		orgNo: "556013-1234",
		address: "Kuskvägen 2",
		postalCity: "191 62 Sollentuna",
		phone: "075-241 10 00",
		email: "faktura@beijerbygg.se",
		bankgiro: "456-7890",
		fTax: true,
	},
	"Ramirent AB": {
		name: "Ramirent AB",
		orgNo: "556123-9876",
		address: "Depå Syd, Malmövägen 4",
		postalCity: "213 77 Malmö",
		phone: "031-57 84 00",
		email: "inbox@ramirent.se",
		bankgiro: "123-4567",
		fTax: true,
	},
	"Cramo AB": {
		name: "Cramo AB",
		orgNo: "556098-7654",
		address: "Industrigatan 10",
		postalCity: "417 56 Göteborg",
		phone: "08-623 54 00",
		email: "faktura@cramo.com",
		bankgiro: "567-8901",
		fTax: true,
	},
	"Würth Svenska AB": {
		name: "Würth Svenska AB",
		orgNo: "556100-3456",
		address: "Växthustorget 5",
		postalCity: "702 27 Örebro",
		phone: "019-35 10 00",
		email: "order@wuerth.se",
		bankgiro: "678-9012",
		fTax: true,
	},
	"Elektroskandia Sverige": {
		name: "Elektroskandia Sverige",
		orgNo: "556023-4567",
		address: "Norrviksvägen 15",
		postalCity: "191 83 Sollentuna",
		phone: "08-92 35 00",
		email: "support@elektroskandia.se",
		bankgiro: "789-0123",
		fTax: true,
	},
	"Bygg-Max AB": {
		name: "Bygg-Max AB",
		orgNo: "556656-3531",
		address: "Armégatan 38",
		postalCity: "171 71 Solna",
		phone: "0771-89 00 89",
		email: "info@byggmax.se",
		bankgiro: "890-1234",
		fTax: true,
	},
	"Cleaning Services AB": {
		name: "Cleaning Services AB",
		orgNo: "556789-4321",
		address: "Hantverkargatan 8",
		postalCity: "112 21 Stockholm",
		phone: "08-400 12 34",
		email: "faktura@cleaningservices.se",
		bankgiro: "901-2345",
		fTax: true,
	},
	"Renta AB": {
		name: "Renta AB",
		orgNo: "559123-5678",
		address: "Transportgatan 14",
		postalCity: "422 46 Hisings Backa",
		phone: "031-700 88 00",
		email: "faktura@renta.se",
		bankgiro: "345-6789",
		fTax: true,
	},
};

export const DEFAULT_PROJECTS_LIST = [
	{ id: "PROJ-2025-001", name: "Projekt 2025-001 - Storgatan" },
	{ id: "PROJ-2025-042", name: "PROJ-2025-042 - Kontorsstädning" },
	{ id: "OR5001", name: "OR5001 - Ombyggnad badrum" },
	{ id: "PROJ-2025-089", name: "PROJ-2025-089 - Fasader Renovering" },
];

export const DEFAULT_COST_CENTERS_LIST = [
	{ id: "10", name: "10 - Ledning / Administration" },
	{ id: "20", name: "20 - Produktion / Bygg" },
	{ id: "30", name: "30 - Installation / El" },
	{ id: "40", name: "40 - Fastighetsförvaltning" },
];

export const EXPENSE_LIST_ROUTE = ECONOMY_SUPPLIER_INVOICES_BASE_URL;
export const CREATE_EXPENSE_ROUTE = `${EXPENSE_LIST_ROUTE}/create`;
export const EXPENSE_LIST_TAB_QUERY_PARAM = "tab";
export const EXPENSE_INBOX_TAB = "inbox";
export const EXPENSE_SUPPLIER_LIST_TAB = "supplier_list";
export const EXPENSE_DETAIL_ROUTE = (expenseId: string) => `${EXPENSE_LIST_ROUTE}/${expenseId}`;

import { economyBreadcrumbs } from "./economyNav.config";

export const registerExpenseBreadcrumbs = economyBreadcrumbs(
	localizationConstants.registerExpenseBreadcrumb,
);


export const MAX_ATTACHMENT_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
export const ALLOWED_ATTACHMENT_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];


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
