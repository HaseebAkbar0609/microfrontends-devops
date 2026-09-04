import {
	BAS_ACCOUNTS,
	CORPORATE_TAX_RATE,
	MONTH_NAMES_MAP,
	QUARTER_NAMES_MAP,
	SKATTEVERKET_BOXES,
	STANDARD_VAT_RATE_06,
	STANDARD_VAT_RATE_12,
	STANDARD_VAT_RATE_25,
} from "../constants/financialReports.constants";
import type {
	BalanceSheetData,
	GeneratedReportListItem,
	IncomeStatementData,
	ReportKpiSummary,
	ReportPeriodFilter,
	ReportTabType,
	VatReportData,
} from "../types/financialReports.types";

function formatPeriodLabel(filter: ReportPeriodFilter): string {
	if (filter.periodType === "monthly" && filter.month) {
		const monthObj = MONTH_NAMES_MAP.find((m) => m.value === filter.month);
		return `${monthObj?.sv ?? "Månad"} ${filter.year}`;
	}
	if (filter.periodType === "quarterly" && filter.quarter) {
		const qObj = QUARTER_NAMES_MAP.find((q) => q.value === filter.quarter);
		return `${qObj?.label ?? "Q"} ${filter.year}`;
	}
	return `Helår ${filter.year}`;
}

function formatComparisonPeriodLabel(filter: ReportPeriodFilter): string {
	const prevYear = filter.year - 1;
	if (filter.periodType === "monthly" && filter.month) {
		const monthObj = MONTH_NAMES_MAP.find((m) => m.value === filter.month);
		return `${monthObj?.sv ?? "Månad"} ${prevYear}`;
	}
	if (filter.periodType === "quarterly" && filter.quarter) {
		const qObj = QUARTER_NAMES_MAP.find((q) => q.value === filter.quarter);
		return `${qObj?.label ?? "Q"} ${prevYear}`;
	}
	return `Helår ${prevYear}`;
}

export function getIncomeStatementData(filter: ReportPeriodFilter): IncomeStatementData {
	// Factor scale based on period (Monthly = ~1/12, Quarterly = ~1/4, Yearly = 1.0)
	const multiplier =
		filter.periodType === "monthly"
			? 0.0833
			: filter.periodType === "quarterly"
				? 0.25
				: 1.0;

	// Year adjustment factor (2025 vs 2026 baseline)
	const yearFactor = filter.year === 2026 ? 1.0 : filter.year === 2025 ? 0.91 : 0.82;

	// Baseline annual figures in SEK
	const baseSales25 = Math.round(4850000 * multiplier * yearFactor);
	const baseSalesServices = Math.round(2340000 * multiplier * yearFactor);
	const baseOtherIncome = Math.round(185000 * multiplier * yearFactor);

	const prevSales25 = Math.round(baseSales25 * 0.92);
	const prevSalesServices = Math.round(baseSalesServices * 0.94);
	const prevOtherIncome = Math.round(baseOtherIncome * 0.88);

	const totalRevenue = baseSales25 + baseSalesServices + baseOtherIncome;

	// Direct costs
	const baseMaterial = Math.round(1850000 * multiplier * yearFactor);
	const baseSubcontractors = Math.round(1120000 * multiplier * yearFactor);
	const baseOtherDirect = Math.round(95000 * multiplier * yearFactor);

	const prevMaterial = Math.round(baseMaterial * 0.9);
	const prevSubcontractors = Math.round(baseSubcontractors * 0.95);
	const prevOtherDirect = Math.round(baseOtherDirect * 0.91);

	const totalDirectCosts = baseMaterial + baseSubcontractors + baseOtherDirect;
	const grossProfit = totalRevenue - totalDirectCosts;

	// Operating expenses
	const baseRent = Math.round(360000 * multiplier * yearFactor);
	const baseTravel = Math.round(145000 * multiplier * yearFactor);
	const baseAdmin = Math.round(220000 * multiplier * yearFactor);
	const baseSalaries = Math.round(1950000 * multiplier * yearFactor);
	const baseSocialFees = Math.round(612690 * multiplier * yearFactor); // ~31.42% social fees
	const baseDepreciation = Math.round(180000 * multiplier * yearFactor);

	const prevRent = Math.round(baseRent * 0.97);
	const prevTravel = Math.round(baseTravel * 0.92);
	const prevAdmin = Math.round(baseAdmin * 0.94);
	const prevSalaries = Math.round(baseSalaries * 0.93);
	const prevSocialFees = Math.round(baseSocialFees * 0.93);
	const prevDepreciation = Math.round(baseDepreciation * 0.95);

	const totalOperatingExpenses =
		baseRent + baseTravel + baseAdmin + baseSalaries + baseSocialFees + baseDepreciation;

	const operatingResult = grossProfit - totalOperatingExpenses;

	// Financials
	const financialIncome = Math.round(24000 * multiplier * yearFactor);
	const financialCosts = Math.round(78000 * multiplier * yearFactor);
	const prevFinancialIncome = Math.round(financialIncome * 0.9);
	const prevFinancialCosts = Math.round(financialCosts * 1.05);

	const netProfitBeforeTax = operatingResult + financialIncome - financialCosts;
	const taxCost = Math.max(0, Math.round(netProfitBeforeTax * CORPORATE_TAX_RATE));
	const netResult = netProfitBeforeTax - taxCost;

	function createRow(
		id: string,
		accountCode: string,
		labelKey: string,
		amount: number,
		prevAmount: number,
		category: "revenue" | "direct_costs" | "operating_costs" | "financial" | "taxes",
	) {
		const varianceSek = amount - prevAmount;
		const variancePercent =
			prevAmount !== 0 ? Math.round((varianceSek / prevAmount) * 1000) / 10 : 0;
		return {
			id,
			accountCode,
			labelKey,
			amount,
			previousPeriodAmount: prevAmount,
			varianceSek,
			variancePercent,
			category,
		};
	}

	return {
		periodLabel: formatPeriodLabel(filter),
		comparisonPeriodLabel: formatComparisonPeriodLabel(filter),
		totalRevenue,
		totalDirectCosts,
		grossProfit,
		totalOperatingExpenses,
		operatingResult,
		financialIncome,
		financialCosts,
		netProfitBeforeTax,
		taxCost,
		netResult,
		revenueRows: [
			createRow("rev_1", BAS_ACCOUNTS.SALES_25, "incomeStatementSecRevenue", baseSales25, prevSales25, "revenue"),
			createRow("rev_2", BAS_ACCOUNTS.SALES_SERVICES, "registerArtiklar", baseSalesServices, prevSalesServices, "revenue"),
			createRow("rev_3", BAS_ACCOUNTS.OTHER_OPERATING_INCOME, "categoryLopande", baseOtherIncome, prevOtherIncome, "revenue"),
		],
		directCostRows: [
			createRow("dc_1", BAS_ACCOUNTS.MATERIAL_PURCHASE, "expenseCategoryMaterial", baseMaterial, prevMaterial, "direct_costs"),
			createRow("dc_2", BAS_ACCOUNTS.SUBCONTRACTORS, "expenseCategorySubcontractor", baseSubcontractors, prevSubcontractors, "direct_costs"),
			createRow("dc_3", BAS_ACCOUNTS.OTHER_DIRECT_COSTS, "expenseCategoryOther", baseOtherDirect, prevOtherDirect, "direct_costs"),
		],
		operatingCostRows: [
			createRow("oc_1", BAS_ACCOUNTS.RENT_PREMISES, "expenseCategoryRent", baseRent, prevRent, "operating_costs"),
			createRow("oc_2", BAS_ACCOUNTS.TRAVEL_VEHICLES, "expenseCategoryTravel", baseTravel, prevTravel, "operating_costs"),
			createRow("oc_3", BAS_ACCOUNTS.ADMIN_OTHER, "expenseCategoryAdmin", baseAdmin, prevAdmin, "operating_costs"),
			createRow("oc_4", BAS_ACCOUNTS.SALARIES_WAGES, "wageTypes", baseSalaries, prevSalaries, "operating_costs"),
			createRow("oc_5", BAS_ACCOUNTS.SOCIAL_SECURITY, "adminGroupsManagement", baseSocialFees, prevSocialFees, "operating_costs"),
			createRow("oc_6", BAS_ACCOUNTS.DEPRECIATION, "tools", baseDepreciation, prevDepreciation, "operating_costs"),
		],
		financialRows: [
			createRow("fin_1", BAS_ACCOUNTS.FINANCIAL_INCOME, "incomeStatementSecFinancial", financialIncome, prevFinancialIncome, "financial"),
			createRow("fin_2", BAS_ACCOUNTS.FINANCIAL_EXPENSES, "incomeStatementSecFinancial", financialCosts, prevFinancialCosts, "financial"),
		],
	};
}

export function getBalanceSheetData(filter: ReportPeriodFilter): BalanceSheetData {
	const yearFactor = filter.year === 2026 ? 1.0 : filter.year === 2025 ? 0.92 : 0.85;

	// Fixed assets
	const machinery = Math.round(920000 * yearFactor);
	const prevMachinery = Math.round(machinery * 1.08);
	const totalFixedAssets = machinery;

	// Current assets
	const accountsReceivable = Math.round(1150000 * yearFactor);
	const prevAccountsReceivable = Math.round(accountsReceivable * 0.91);

	const taxAccount = Math.round(145000 * yearFactor);
	const prevTaxAccount = Math.round(taxAccount * 0.88);

	const bankChecking = Math.round(1840000 * yearFactor);
	const prevBankChecking = Math.round(bankChecking * 0.94);

	const pettyCash = Math.round(15000 * yearFactor);
	const prevPettyCash = Math.round(pettyCash);

	const totalCurrentAssets = accountsReceivable + taxAccount + bankChecking + pettyCash;
	const totalAssets = totalFixedAssets + totalCurrentAssets;

	// Equity
	const shareCapital = 50000;
	const retainedEarnings = Math.round(1820000 * yearFactor);
	// Income statement result for the period
	const isData = getIncomeStatementData(filter);
	const currentYearResult = isData.netResult;
	const totalEquity = shareCapital + retainedEarnings + currentYearResult;

	// Long-term liabilities
	const bankLoans = Math.round(950000 * yearFactor);
	const prevBankLoans = Math.round(bankLoans * 1.15);
	const totalLongTermLiabilities = bankLoans;

	// Short-term liabilities
	const accountsPayable = Math.round(620000 * yearFactor);
	const prevAccountsPayable = Math.round(accountsPayable * 0.92);

	const vatLiability = Math.round(380000 * yearFactor);
	const prevVatLiability = Math.round(vatLiability * 0.95);

	// Balancing figure for short-term liabilities so balance strictly holds
	const totalLiabilities = totalAssets - totalEquity;
	const shortTermLiabilitiesSum = totalLiabilities - totalLongTermLiabilities;
	const personnelTaxes = shortTermLiabilitiesSum - accountsPayable - vatLiability;
	const prevPersonnelTaxes = Math.round(personnelTaxes * 0.93);

	const totalShortTermLiabilities = accountsPayable + vatLiability + personnelTaxes;
	const totalEquityAndLiabilities = totalEquity + totalLongTermLiabilities + totalShortTermLiabilities;

	const difference = totalAssets - totalEquityAndLiabilities;
	const isBalanced = difference === 0;

	return {
		periodLabel: formatPeriodLabel(filter),
		totalAssets,
		totalFixedAssets,
		totalCurrentAssets,
		fixedAssetRows: [
			{
				id: "fa_1",
				accountCode: BAS_ACCOUNTS.MACHINERY_EQUIPMENT,
				labelKey: "machine",
				amount: machinery,
				previousPeriodAmount: prevMachinery,
			},
		],
		currentAssetRows: [
			{
				id: "ca_1",
				accountCode: BAS_ACCOUNTS.ACCOUNTS_RECEIVABLE,
				labelKey: "expenseTopTabCustomerInvoice",
				amount: accountsReceivable,
				previousPeriodAmount: prevAccountsReceivable,
			},
			{
				id: "ca_2",
				accountCode: BAS_ACCOUNTS.TAX_ACCOUNT,
				labelKey: "vatReportTitle",
				amount: taxAccount,
				previousPeriodAmount: prevTaxAccount,
			},
			{
				id: "ca_3",
				accountCode: BAS_ACCOUNTS.BANK_CHECKING,
				labelKey: "expenseDetailBank",
				amount: bankChecking,
				previousPeriodAmount: prevBankChecking,
			},
			{
				id: "ca_4",
				accountCode: BAS_ACCOUNTS.PETTY_CASH,
				labelKey: "commonCash",
				amount: pettyCash,
				previousPeriodAmount: prevPettyCash,
			},
		],
		totalEquity,
		equityRows: [
			{
				id: "eq_1",
				accountCode: BAS_ACCOUNTS.SHARE_CAPITAL,
				labelKey: "companyItem",
				amount: shareCapital,
				previousPeriodAmount: shareCapital,
			},
			{
				id: "eq_2",
				accountCode: BAS_ACCOUNTS.RETAINED_EARNINGS,
				labelKey: "incomeStatementGrossProfit",
				amount: retainedEarnings,
				previousPeriodAmount: Math.round(retainedEarnings * 0.9),
			},
			{
				id: "eq_3",
				accountCode: BAS_ACCOUNTS.CURRENT_YEAR_RESULT,
				labelKey: "incomeStatementNetResult",
				amount: currentYearResult,
				previousPeriodAmount: Math.round(currentYearResult * 0.85),
			},
		],
		totalLongTermLiabilities,
		longTermLiabilityRows: [
			{
				id: "ltl_1",
				accountCode: BAS_ACCOUNTS.BANK_LOANS,
				labelKey: "balanceSheetSecLongTermLiab",
				amount: bankLoans,
				previousPeriodAmount: prevBankLoans,
			},
		],
		totalShortTermLiabilities,
		shortTermLiabilityRows: [
			{
				id: "stl_1",
				accountCode: BAS_ACCOUNTS.ACCOUNTS_PAYABLE,
				labelKey: "expenseTopTabSupplierInvoice",
				amount: accountsPayable,
				previousPeriodAmount: prevAccountsPayable,
			},
			{
				id: "stl_2",
				accountCode: BAS_ACCOUNTS.VAT_SETTLEMENT,
				labelKey: "vatReportBox49",
				amount: vatLiability,
				previousPeriodAmount: prevVatLiability,
			},
			{
				id: "stl_3",
				accountCode: BAS_ACCOUNTS.PERSONNEL_TAXES,
				labelKey: "balanceSheetSecShortTermLiab",
				amount: personnelTaxes,
				previousPeriodAmount: prevPersonnelTaxes,
			},
		],
		totalLiabilities,
		totalEquityAndLiabilities,
		isBalanced,
		difference,
	};
}

export function getVatReportData(filter: ReportPeriodFilter): VatReportData {
	const multiplier =
		filter.periodType === "monthly"
			? 0.0833
			: filter.periodType === "quarterly"
				? 0.25
				: 1.0;
	const yearFactor = filter.year === 2026 ? 1.0 : filter.year === 2025 ? 0.92 : 0.85;

	// Sales
	const totalSalesMomspliktig = Math.round(6400000 * multiplier * yearFactor);
	const sales25 = Math.round(totalSalesMomspliktig * 0.85);
	const sales12 = Math.round(totalSalesMomspliktig * 0.1);
	const sales06 = Math.round(totalSalesMomspliktig * 0.05);

	// Output VAT
	const outputVat25 = Math.round(sales25 * STANDARD_VAT_RATE_25);
	const outputVat12 = Math.round(sales12 * STANDARD_VAT_RATE_12);
	const outputVat06 = Math.round(sales06 * STANDARD_VAT_RATE_06);
	const totalOutputVat = outputVat25 + outputVat12 + outputVat06;

	// Input VAT
	const totalInputVatDeductible = Math.round(totalOutputVat * 0.62);

	// Net VAT payable (Ruta 49)
	const netVatPayable = totalOutputVat - totalInputVatDeductible;

	return {
		periodLabel: formatPeriodLabel(filter),
		totalSalesMomspliktig,
		outputVat25,
		outputVat12,
		outputVat06,
		totalOutputVat,
		totalInputVatDeductible,
		netVatPayable,
		boxes: [
			{
				boxNumber: SKATTEVERKET_BOXES.BOX_05,
				boxNameKey: "vatReportBox05",
				baseAmount: totalSalesMomspliktig,
				vatAmount: 0,
				descriptionKey: "vatReportSecOutput",
			},
			{
				boxNumber: SKATTEVERKET_BOXES.BOX_10,
				boxNameKey: "vatReportBox10",
				vatRate: STANDARD_VAT_RATE_25,
				baseAmount: sales25,
				vatAmount: outputVat25,
				descriptionKey: "vatReportBox10",
			},
			{
				boxNumber: SKATTEVERKET_BOXES.BOX_11,
				boxNameKey: "vatReportBox11",
				vatRate: STANDARD_VAT_RATE_12,
				baseAmount: sales12,
				vatAmount: outputVat12,
				descriptionKey: "vatReportBox11",
			},
			{
				boxNumber: SKATTEVERKET_BOXES.BOX_12,
				boxNameKey: "vatReportBox12",
				vatRate: STANDARD_VAT_RATE_06,
				baseAmount: sales06,
				vatAmount: outputVat06,
				descriptionKey: "vatReportBox12",
			},
			{
				boxNumber: SKATTEVERKET_BOXES.BOX_48,
				boxNameKey: "vatReportBox48",
				vatAmount: totalInputVatDeductible,
				descriptionKey: "vatReportBox48",
			},
			{
				boxNumber: SKATTEVERKET_BOXES.BOX_49,
				boxNameKey: "vatReportBox49",
				vatAmount: netVatPayable,
				descriptionKey: "vatReportBox49",
				isResultBox: true,
			},
		],
	};
}

export function getReportKpis(filter: ReportPeriodFilter): ReportKpiSummary {
	const isData = getIncomeStatementData(filter);
	const vatData = getVatReportData(filter);

	const totalRevenueSek = isData.totalRevenue;
	const totalExpensesSek = isData.totalDirectCosts + isData.totalOperatingExpenses;
	const operatingMarginPercent =
		totalRevenueSek > 0
			? Math.round((isData.operatingResult / totalRevenueSek) * 1000) / 10
			: 0;

	return {
		totalRevenueSek,
		totalExpensesSek,
		operatingMarginPercent,
		netResultSek: isData.netResult,
		vatBalanceSek: vatData.netVatPayable,
	};
}

export function getGeneratedReportsList(
	tab: ReportTabType,
	filter: ReportPeriodFilter,
): GeneratedReportListItem[] {
	const periodStr = formatPeriodLabel(filter);
	const reports: GeneratedReportListItem[] = [
		{
			id: "rep-1",
			reportType: "income_statement",
			title: `Resultaträkning - ${periodStr}`,
			periodLabel: periodStr,
			generatedDate: `${filter.year}-06-30`,
			generatedBy: "System (Automatisk)",
			status: "ready",
		},
		{
			id: "rep-2",
			reportType: "balance_sheet",
			title: `Balansräkning - ${periodStr}`,
			periodLabel: periodStr,
			generatedDate: `${filter.year}-06-30`,
			generatedBy: "System (Automatisk)",
			status: "ready",
		},
		{
			id: "rep-3",
			reportType: "vat_report",
			title: `Momsrapport - ${periodStr}`,
			periodLabel: periodStr,
			generatedDate: `${filter.year}-06-30`,
			generatedBy: "Skatteverket API Sync",
			status: "ready",
		},
	];

	if (tab === "income_statement") {
		return [reports[0]];
	}
	if (tab === "balance_sheet") {
		return [reports[1]];
	}
	return [reports[2]];
}
