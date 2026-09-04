export type ReportTabType = "income_statement" | "balance_sheet" | "vat_report";
export type ReportMainTab = "all" | "income_statement" | "balance_sheet" | "vat_report";
export type ReportViewMode = "hub" | "detail";

export type ReportPeriodType = "monthly" | "quarterly" | "yearly";

export interface ReportPeriodFilter {
	periodType: ReportPeriodType;
	year: number;
	month?: number; // 1-12 for monthly
	quarter?: number; // 1-4 for quarterly
}

export interface IncomeStatementRow {
	id: string;
	accountCode?: string;
	labelKey: string;
	amount: number;
	previousPeriodAmount: number;
	varianceSek: number;
	variancePercent: number;
	isSubtotal?: boolean;
	isHeader?: boolean;
	category?: "revenue" | "direct_costs" | "operating_costs" | "financial" | "taxes";
}

export interface ProjectRevenueBreakdown {
	project: string;
	clientName: string;
	amount: number;
	previousPeriodAmount: number;
	varianceSek: number;
	variancePercent: number;
}

export interface ExpenseCategoryBreakdown {
	category: string;
	labelKey: string;
	amount: number;
	previousPeriodAmount: number;
	varianceSek: number;
	variancePercent: number;
}

export interface IncomeStatementData {
	filter: ReportPeriodFilter;
	comparisonYear: number;
	totalRevenue: number;
	totalDirectCosts: number;
	grossProfit: number;
	totalOperatingExpenses: number;
	operatingResult: number; // EBIT / Rörelseresultat
	financialIncome: number;
	financialCosts: number;
	netProfitBeforeTax: number;
	taxCost: number;
	netResult: number; // Årets resultat
	revenueRows: IncomeStatementRow[];
	projectRevenueRows: ProjectRevenueBreakdown[];
	directCostRows: IncomeStatementRow[];
	categoryExpenseRows: ExpenseCategoryBreakdown[];
	operatingCostRows: IncomeStatementRow[];
	financialRows: IncomeStatementRow[];
}

export interface BalanceSheetRow {
	id: string;
	accountCode?: string;
	labelKey: string;
	amount: number;
	previousPeriodAmount: number;
	isSubtotal?: boolean;
	isHeader?: boolean;
	category?: "fixed_assets" | "current_assets" | "equity" | "long_term_liabilities" | "short_term_liabilities";
}

export interface BalanceSheetData {
	filter: ReportPeriodFilter;
	comparisonYear: number;
	totalAssets: number;
	totalFixedAssets: number;
	totalCurrentAssets: number;
	fixedAssetRows: BalanceSheetRow[];
	currentAssetRows: BalanceSheetRow[];
	totalEquity: number;
	equityRows: BalanceSheetRow[];
	totalLongTermLiabilities: number;
	longTermLiabilityRows: BalanceSheetRow[];
	totalShortTermLiabilities: number;
	shortTermLiabilityRows: BalanceSheetRow[];
	totalLiabilities: number;
	totalEquityAndLiabilities: number;
	isBalanced: boolean;
	difference: number;
}

export interface VatReportBox {
	boxNumber: string; // e.g., "05", "10", "11", "12", "48", "49"
	boxNameKey: string;
	vatRate?: number; // 0.25, 0.12, 0.06
	baseAmount?: number;
	vatAmount: number;
	descriptionKey: string;
	isResultBox?: boolean;
}

export interface VatReportData {
	filter: ReportPeriodFilter;
	comparisonYear: number;
	totalSalesMomspliktig: number;
	outputVat25: number;
	outputVat12: number;
	outputVat06: number;
	totalOutputVat: number;
	totalInputVatDeductible: number;
	netVatPayable: number; // Positive = to pay Skatteverket, negative = refund
	boxes: VatReportBox[];
}

export interface GeneratedReportListItem {
	id: string;
	reportType: ReportTabType;
	title: string;
	periodLabel: string;
	generatedDate: string;
	generatedBy: string;
	status: "ready" | "pending" | "archived";
	downloadUrl?: string;
}

export interface ReportKpiSummary {
	totalRevenueSek: number;
	totalExpensesSek: number;
	operatingMarginPercent: number;
	netResultSek: number;
	vatBalanceSek: number;
}
