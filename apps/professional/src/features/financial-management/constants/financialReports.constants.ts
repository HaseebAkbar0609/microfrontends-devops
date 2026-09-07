import localizationConstants from "@/utils/translation/constants";
import type { ReportPeriodType, ReportTabType } from "../types/financialReports.types";

export const FINANCIAL_REPORTS_ROUTE = "/module/financial-management/forecast";

import { economyBreadcrumbs } from "./economyNav.config";

export const financialReportsBreadcrumbs = economyBreadcrumbs(
	localizationConstants.financialReportsTitle,
);


export const DEFAULT_REPORT_TAB: ReportTabType = "income_statement";
export const DEFAULT_REPORT_PERIOD_TYPE: ReportPeriodType = "yearly";
export const DEFAULT_REPORT_YEAR = 2026;

export const AVAILABLE_REPORT_YEARS = [2026, 2025, 2024] as const;

export const STANDARD_VAT_RATE_25 = 0.25;
export const STANDARD_VAT_RATE_12 = 0.12;
export const STANDARD_VAT_RATE_06 = 0.06;

export const CORPORATE_TAX_RATE = 0.206; // Swedish standard bolagsskatt 20.6%

export const REPORT_TAB_ACTIVE_CLASS =
	"border-b-2 border-primary text-primary font-semibold py-3.5 px-2 text-sm flex items-center gap-2 transition-colors";
export const REPORT_TAB_INACTIVE_CLASS =
	"border-b-2 border-transparent text-slate-500 hover:text-slate-800 font-medium py-3.5 px-2 text-sm flex items-center gap-2 transition-colors";

export const REPORT_PERIOD_BTN_ACTIVE =
	"px-3 py-1.5 text-xs font-semibold rounded-md bg-white text-slate-900 shadow-sm border border-slate-200 transition-all";
export const REPORT_PERIOD_BTN_INACTIVE =
	"px-3 py-1.5 text-xs font-medium rounded-md text-slate-600 hover:text-slate-900 transition-all";

// Swedish BAS-kontoplan account numbers
export const BAS_ACCOUNTS = {
	SALES_25: "3001",
	SALES_SERVICES: "3040",
	OTHER_OPERATING_INCOME: "3900",
	MATERIAL_PURCHASE: "4010",
	SUBCONTRACTORS: "4600",
	OTHER_DIRECT_COSTS: "4900",
	RENT_PREMISES: "5010",
	TRAVEL_VEHICLES: "5600",
	ADMIN_OTHER: "6000",
	MARKETING_SALES: "6072",
	SALARIES: "7010",
	SALARIES_WAGES: "7010",
	SOCIAL_SECURITY: "7510",
	DEPRECIATION: "7830",
	FINANCIAL_INCOME: "8310",
	FINANCIAL_EXPENSES: "8410",
	MACHINERY_EQUIPMENT: "1220",
	ACCOUNTS_RECEIVABLE: "1510",
	TAX_ACCOUNT: "1630",
	BANK_CHECKING: "1930",
	PETTY_CASH: "1910",
	SHARE_CAPITAL: "2081",
	RETAINED_EARNINGS: "2091",
	CURRENT_YEAR_RESULT: "2099",
	BANK_LOANS: "2350",
	ACCOUNTS_PAYABLE: "2440",
	VAT_SETTLEMENT: "2650",
	PERSONNEL_TAXES: "2710",
} as const;

// Skatteverket declaration box identifiers
export const SKATTEVERKET_BOXES = {
	BOX_05: "05",
	BOX_10: "10",
	BOX_11: "11",
	BOX_12: "12",
	BOX_48: "48",
	BOX_49: "49",
} as const;

export const MONTH_TRANSLATION_KEYS = [
	{ value: 1, key: localizationConstants.monthJanuary },
	{ value: 2, key: localizationConstants.monthFebruary },
	{ value: 3, key: localizationConstants.monthMarch },
	{ value: 4, key: localizationConstants.monthApril },
	{ value: 5, key: localizationConstants.monthMay },
	{ value: 6, key: localizationConstants.monthJune },
	{ value: 7, key: localizationConstants.monthJuly },
	{ value: 8, key: localizationConstants.monthAugust },
	{ value: 9, key: localizationConstants.monthSeptember },
	{ value: 10, key: localizationConstants.monthOctober },
	{ value: 11, key: localizationConstants.monthNovember },
	{ value: 12, key: localizationConstants.monthDecember },
] as const;

export const QUARTER_TRANSLATION_KEYS = [
	{ value: 1, key: localizationConstants.quarterQ1 },
	{ value: 2, key: localizationConstants.quarterQ2 },
	{ value: 3, key: localizationConstants.quarterQ3 },
	{ value: 4, key: localizationConstants.quarterQ4 },
] as const;
