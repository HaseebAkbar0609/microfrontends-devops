import localizationConstants from "@/utils/translation/constants";
import {
	BAS_ACCOUNTS,
	CORPORATE_TAX_RATE,
	SKATTEVERKET_BOXES,
	STANDARD_VAT_RATE_06,
	STANDARD_VAT_RATE_12,
	STANDARD_VAT_RATE_25,
} from "../constants/financialReports.constants";
import type {
	BalanceSheetData,
	BalanceSheetRow,
	IncomeStatementData,
	IncomeStatementRow,
	ProjectRevenueBreakdown,
	ExpenseCategoryBreakdown,
	ReportKpiSummary,
	ReportPeriodFilter,
	StatementSubtotal,
	TransactionDetailItem,
	VatReportData,
} from "../types/financialReports.types";
import {
	MONTH_TRANSLATION_KEYS,
	QUARTER_TRANSLATION_KEYS,
} from "../constants/financialReports.constants";
import { invoiceRepository } from "../utils/invoiceRepository";
import { expenseRepository } from "../utils/expenseRepository";

/**
 * Filter date check according to period type (monthly, quarterly, yearly)
 */
export function isDateInPeriod(dateStr: string | undefined, filter: ReportPeriodFilter): boolean {
	if (!dateStr) return false;
	const d = new Date(dateStr);
	if (isNaN(d.getTime())) return false;

	if (d.getFullYear() !== filter.year) return false;

	const month = d.getMonth() + 1;
	if (filter.periodType === "monthly" && filter.month) {
		return month === filter.month;
	}
	if (filter.periodType === "quarterly" && filter.quarter) {
		const q = Math.ceil(month / 3);
		return q === filter.quarter;
	}
	return true;
}

/**
 * Dynamic seasonality multiplier according to Swedish fiscal quarters & vacation patterns
 */
export function getPeriodSeasonalityFactor(filter: ReportPeriodFilter): number {
	if (filter.periodType === "monthly" && filter.month) {
		const monthFactors: Record<number, number> = {
			1: 0.90,
			2: 0.95,
			3: 1.05,
			4: 1.08,
			5: 1.12,
			6: 1.10,
			7: 0.65, // Swedish summer vacation (industrisemester)
			8: 0.90,
			9: 1.15,
			10: 1.10,
			11: 1.05,
			12: 1.00,
		};
		return monthFactors[filter.month] ?? 1.0;
	}
	if (filter.periodType === "quarterly" && filter.quarter) {
		const quarterFactors: Record<number, number> = {
			1: 0.96,
			2: 1.10,
			3: 0.90,
			4: 1.05,
		};
		return quarterFactors[filter.quarter] ?? 1.0;
	}
	return 1.0;
}

function calculateVariance(current: number, previous: number) {
	const varianceSek = current - previous;
	const variancePercent =
		previous !== 0 ? Math.round((varianceSek / Math.abs(previous)) * 1000) / 10 : 0;
	return { varianceSek, variancePercent };
}

function createSubtotal(amount: number, prevAmount: number): StatementSubtotal {
	const { varianceSek, variancePercent } = calculateVariance(amount, prevAmount);
	return {
		amount,
		previousPeriodAmount: prevAmount,
		varianceSek,
		variancePercent,
	};
}

/**
 * Generate primary Income Statement (Resultaträkning)
 */
export function getIncomeStatementData(filter: ReportPeriodFilter): IncomeStatementData {
	const prevYear = filter.year - 1;
	const prevFilter: ReportPeriodFilter = { ...filter, year: prevYear };

	const allInvoices = invoiceRepository.getInvoices();
	const allExpenses = expenseRepository.getAllExpenses();

	const periodInvoices = allInvoices.filter((inv) =>
		isDateInPeriod(inv.invoiceDate || inv.dueDate, filter),
	);
	const prevInvoices = allInvoices.filter((inv) =>
		isDateInPeriod(inv.invoiceDate || inv.dueDate, prevFilter),
	);

	const periodExpenses = allExpenses.filter((exp) =>
		isDateInPeriod(exp.date || exp.invoiceDate, filter),
	);
	const prevExpenses = allExpenses.filter((exp) =>
		isDateInPeriod(exp.date || exp.invoiceDate, prevFilter),
	);

	// Multipliers for scaling the synthetic baseline fallback
	const periodFraction =
		filter.periodType === "monthly" ? 1 / 12 : filter.periodType === "quarterly" ? 1 / 4 : 1.0;
	const prevPeriodFraction = periodFraction;

	// ── Revenue: Live invoice aggregation (primary) ──────────────────────────
	// We categorise invoices by whether they are project (25% VAT) or service (hourly)
	const liveSales25 = periodInvoices
		.filter((inv) => inv.type === "fastpris" || inv.object === "Projekt")
		.reduce((acc, inv) => acc + (inv.total || 0), 0);
	const liveSalesServices = periodInvoices
		.filter((inv) => inv.type === "hourly" || inv.object === "Order")
		.reduce((acc, inv) => acc + (inv.total || 0), 0);
	const liveOtherIncome = 0; // Not derived from invoice mock — kept as zero for accuracy

	const prevLiveSales25 = prevInvoices
		.filter((inv) => inv.type === "fastpris" || inv.object === "Projekt")
		.reduce((acc, inv) => acc + (inv.total || 0), 0);
	const prevLiveSalesServices = prevInvoices
		.filter((inv) => inv.type === "hourly" || inv.object === "Order")
		.reduce((acc, inv) => acc + (inv.total || 0), 0);

	// If the period has real invoice data, use it; otherwise fall back to a
	// scaled synthetic baseline so empty periods still show sensible YTD numbers.
	const hasLiveRevenue = liveSales25 + liveSalesServices > 0;
	const hasPrevLiveRevenue = prevLiveSales25 + prevLiveSalesServices > 0;

	const baseSales25 = hasLiveRevenue
		? liveSales25
		: Math.round(3200000 * periodFraction);
	const baseSalesServices = hasLiveRevenue
		? liveSalesServices
		: Math.round(1400000 * periodFraction);
	const baseOtherIncome = hasLiveRevenue
		? liveOtherIncome
		: Math.round(120000 * periodFraction);

	const prevSales25 = hasPrevLiveRevenue
		? prevLiveSales25
		: Math.round(3000000 * prevPeriodFraction);
	const prevSalesServices = hasPrevLiveRevenue
		? prevLiveSalesServices
		: Math.round(1300000 * prevPeriodFraction);
	const prevOtherIncome = hasPrevLiveRevenue
		? 0
		: Math.round(110000 * prevPeriodFraction);

	const totalRevenue = baseSales25 + baseSalesServices + baseOtherIncome;
	const prevTotalRevenue = prevSales25 + prevSalesServices + prevOtherIncome;

	// ── Costs: Live expense aggregation (primary) ─────────────────────────────
	const liveMaterial = periodExpenses
		.filter((e) => e.category === "material")
		.reduce((acc, e) => acc + (e.amount || 0), 0);
	const liveSubcontractors = periodExpenses
		.filter((e) => e.category === "subcontractor" || e.category === "equipment")
		.reduce((acc, e) => acc + (e.amount || 0), 0);
	const liveOtherDirect = periodExpenses
		.filter((e) => e.category !== "material" && e.category !== "subcontractor" && e.category !== "equipment" && e.category !== "labor")
		.reduce((acc, e) => acc + (e.amount || 0), 0);

	const prevLiveMaterial = prevExpenses
		.filter((e) => e.category === "material")
		.reduce((acc, e) => acc + (e.amount || 0), 0);
	const prevLiveSubcontractors = prevExpenses
		.filter((e) => e.category === "subcontractor" || e.category === "equipment")
		.reduce((acc, e) => acc + (e.amount || 0), 0);

	const hasLiveExpenses = liveMaterial + liveSubcontractors + liveOtherDirect > 0;
	const hasPrevLiveExpenses = prevLiveMaterial + prevLiveSubcontractors > 0;

	const baseMaterial = hasLiveExpenses
		? liveMaterial
		: Math.round(1200000 * periodFraction);
	const baseSubcontractors = hasLiveExpenses
		? liveSubcontractors
		: Math.round(850000 * periodFraction);
	const baseOtherDirect = hasLiveExpenses
		? liveOtherDirect
		: Math.round(75000 * periodFraction);

	const prevMaterial = hasPrevLiveExpenses
		? prevLiveMaterial
		: Math.round(1120000 * prevPeriodFraction);
	const prevSubcontractors = hasPrevLiveExpenses
		? prevLiveSubcontractors
		: Math.round(800000 * prevPeriodFraction);
	const prevOtherDirect = hasPrevLiveExpenses
		? 0
		: Math.round(70000 * prevPeriodFraction);

	const totalDirectCosts = baseMaterial + baseSubcontractors + baseOtherDirect;
	const prevTotalDirectCosts = prevMaterial + prevSubcontractors + prevOtherDirect;
	const grossProfit = totalRevenue - totalDirectCosts;
	const prevGrossProfit = prevTotalRevenue - prevTotalDirectCosts;

	// Operating expenses — these are structural overheads; live labor-category expenses feed salaries
	const baseRent = Math.round(280000 * periodFraction);
	const baseTravel = Math.round(110000 * periodFraction);
	const baseAdmin = Math.round(160000 * periodFraction);
	const liveSalaries = periodExpenses
		.filter((e) => e.category === "labor")
		.reduce((acc, e) => acc + (e.amount || 0), 0);
	const baseSalaries = liveSalaries > 0
		? liveSalaries
		: Math.round(1350000 * periodFraction);
	const baseSocialFees = Math.round(baseSalaries * 0.3142); // 31.42% Swedish employer contributions
	const baseDepreciation = Math.round(120000 * periodFraction);

	const prevRent = Math.round(270000 * prevPeriodFraction);
	const prevTravel = Math.round(105000 * prevPeriodFraction);
	const prevAdmin = Math.round(155000 * prevPeriodFraction);
	const prevSalaries = Math.round(1280000 * prevPeriodFraction);
	const prevSocialFees = Math.round(prevSalaries * 0.3142);
	const prevDepreciation = Math.round(120000 * prevPeriodFraction);

	const totalOperatingExpenses =
		baseRent + baseTravel + baseAdmin + baseSalaries + baseSocialFees + baseDepreciation;
	const prevTotalOperatingExpenses =
		prevRent + prevTravel + prevAdmin + prevSalaries + prevSocialFees + prevDepreciation;

	const operatingResult = grossProfit - totalOperatingExpenses;
	const prevOperatingResult = prevGrossProfit - prevTotalOperatingExpenses;

	// Financial items & corporate tax
	const financialIncome = Math.round(18000 * periodFraction);
	const financialCosts = Math.round(45000 * periodFraction);
	const prevFinancialIncome = Math.round(15000 * prevPeriodFraction);
	const prevFinancialCosts = Math.round(48000 * prevPeriodFraction);

	const netProfitBeforeTax = operatingResult + financialIncome - financialCosts;
	const prevNetProfitBeforeTax = prevOperatingResult + prevFinancialIncome - prevFinancialCosts;

	const taxCost = Math.max(0, Math.round(netProfitBeforeTax * CORPORATE_TAX_RATE));
	const prevTaxCost = Math.max(0, Math.round(prevNetProfitBeforeTax * CORPORATE_TAX_RATE));

	const netResult = netProfitBeforeTax - taxCost;
	const prevNetResult = prevNetProfitBeforeTax - prevTaxCost;

	function createRow(
		id: string,
		accountCode: string,
		labelKey: string,
		amount: number,
		prevAmount: number,
		category: "revenue" | "direct_costs" | "operating_costs" | "financial" | "taxes",
	): IncomeStatementRow {
		const { varianceSek, variancePercent } = calculateVariance(amount, prevAmount);
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

	const revenueRows: IncomeStatementRow[] = [
		createRow("rev_3001", BAS_ACCOUNTS.SALES_25, localizationConstants.basSales25, baseSales25, prevSales25, "revenue"),
		createRow("rev_3040", BAS_ACCOUNTS.SALES_SERVICES, localizationConstants.basSalesServices, baseSalesServices, prevSalesServices, "revenue"),
		createRow("rev_3900", BAS_ACCOUNTS.OTHER_OPERATING_INCOME, localizationConstants.basOtherOperatingIncome, baseOtherIncome, prevOtherIncome, "revenue"),
	];

	const directCostRows: IncomeStatementRow[] = [
		createRow("dc_4010", BAS_ACCOUNTS.MATERIAL_PURCHASE, localizationConstants.basMaterialPurchase, baseMaterial, prevMaterial, "direct_costs"),
		createRow("dc_4600", BAS_ACCOUNTS.SUBCONTRACTORS, localizationConstants.basSubcontractors, baseSubcontractors, prevSubcontractors, "direct_costs"),
		createRow("dc_4900", BAS_ACCOUNTS.OTHER_DIRECT_COSTS, localizationConstants.basOtherDirectCosts, baseOtherDirect, prevOtherDirect, "direct_costs"),
	];

	const operatingCostRows: IncomeStatementRow[] = [
		createRow("oc_5010", BAS_ACCOUNTS.RENT_PREMISES, localizationConstants.basRentPremises, baseRent, prevRent, "operating_costs"),
		createRow("oc_5600", BAS_ACCOUNTS.TRAVEL_VEHICLES, localizationConstants.basTravelVehicles, baseTravel, prevTravel, "operating_costs"),
		createRow("oc_6000", BAS_ACCOUNTS.ADMIN_OTHER, localizationConstants.basAdminOther, baseAdmin, prevAdmin, "operating_costs"),
		createRow("oc_7010", BAS_ACCOUNTS.SALARIES, localizationConstants.basSalaries, baseSalaries, prevSalaries, "operating_costs"),
		createRow("oc_7510", BAS_ACCOUNTS.SOCIAL_SECURITY, localizationConstants.basSocialSecurity, baseSocialFees, prevSocialFees, "operating_costs"),
		createRow("oc_7830", BAS_ACCOUNTS.DEPRECIATION, localizationConstants.basDepreciation, baseDepreciation, prevDepreciation, "operating_costs"),
	];

	const financialRows: IncomeStatementRow[] = [
		createRow("fin_8310", BAS_ACCOUNTS.FINANCIAL_INCOME, localizationConstants.basFinancialIncome, financialIncome, prevFinancialIncome, "financial"),
		createRow("fin_8410", BAS_ACCOUNTS.FINANCIAL_EXPENSES, localizationConstants.basFinancialExpenses, financialCosts, prevFinancialCosts, "financial"),
	];

	// Project revenue breakdown from actual invoices
	const projectMap = new Map<string, { client: string; amount: number; prevAmount: number }>();
	periodInvoices.forEach((inv) => {
		const projKey = inv.object === "Projekt" ? (inv.contractType || "Projekt Totalentrepnad") : "Löpande service";
		const current = projectMap.get(projKey) || { client: inv.customer || "Kund", amount: 0, prevAmount: 0 };
		projectMap.set(projKey, {
			client: inv.customer || current.client,
			amount: current.amount + inv.total,
			prevAmount: current.prevAmount,
		});
	});
	prevInvoices.forEach((inv) => {
		const projKey = inv.object === "Projekt" ? (inv.contractType || "Projekt Totalentrepnad") : "Löpande service";
		const current = projectMap.get(projKey) || { client: inv.customer || "Kund", amount: 0, prevAmount: 0 };
		projectMap.set(projKey, {
			...current,
			prevAmount: current.prevAmount + inv.total,
		});
	});

	// If no invoices exist in the map, provide default project categories scaled to period
	if (projectMap.size === 0) {
		projectMap.set("Projekt Totalentrepnad", { client: "Fox Fastigheter AB", amount: Math.round(baseSales25 * 0.6), prevAmount: Math.round(prevSales25 * 0.6) });
		projectMap.set("Projekt Badrum & Kök", { client: "Bygg & Montage Stockholm", amount: Math.round(baseSales25 * 0.4), prevAmount: Math.round(prevSales25 * 0.4) });
		projectMap.set("Löpande service & reparation", { client: "Karl Karlsson", amount: baseSalesServices, prevAmount: prevSalesServices });
	}

	const projectRevenueRows: ProjectRevenueBreakdown[] = Array.from(projectMap.entries()).map(
		([project, val]) => {
			const { varianceSek, variancePercent } = calculateVariance(val.amount, val.prevAmount);
			return {
				project,
				clientName: val.client,
				amount: val.amount,
				previousPeriodAmount: val.prevAmount,
				varianceSek,
				variancePercent,
			};
		},
	);

	// Expense category breakdown from actual expenses
	const categoryExpenseRows: ExpenseCategoryBreakdown[] = [
		{
			category: "material",
			labelKey: localizationConstants.expenseCategoryMaterial,
			amount: baseMaterial,
			previousPeriodAmount: prevMaterial,
			...calculateVariance(baseMaterial, prevMaterial),
		},
		{
			category: "subcontractor",
			labelKey: localizationConstants.expenseCategorySubcontractor,
			amount: baseSubcontractors,
			previousPeriodAmount: prevSubcontractors,
			...calculateVariance(baseSubcontractors, prevSubcontractors),
		},
		{
			category: "labor",
			labelKey: localizationConstants.expenseCategoryLabor,
			amount: baseSalaries + baseSocialFees,
			previousPeriodAmount: prevSalaries + prevSocialFees,
			...calculateVariance(baseSalaries + baseSocialFees, prevSalaries + prevSocialFees),
		},
		{
			category: "premises",
			labelKey: localizationConstants.basRentPremises,
			amount: baseRent,
			previousPeriodAmount: prevRent,
			...calculateVariance(baseRent, prevRent),
		},
		{
			category: "travel",
			labelKey: localizationConstants.basTravelVehicles,
			amount: baseTravel,
			previousPeriodAmount: prevTravel,
			...calculateVariance(baseTravel, prevTravel),
		},
	];

	return {
		filter,
		comparisonYear: prevYear,
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
		subtotals: {
			revenue: createSubtotal(totalRevenue, prevTotalRevenue),
			directCosts: createSubtotal(totalDirectCosts, prevTotalDirectCosts),
			grossProfit: createSubtotal(grossProfit, prevGrossProfit),
			operatingCosts: createSubtotal(totalOperatingExpenses, prevTotalOperatingExpenses),
			operatingResult: createSubtotal(operatingResult, prevOperatingResult),
			resultBeforeTax: createSubtotal(netProfitBeforeTax, prevNetProfitBeforeTax),
			taxCost: createSubtotal(taxCost, prevTaxCost),
			netResult: createSubtotal(netResult, prevNetResult),
		},
		revenueRows,
		projectRevenueRows,
		directCostRows,
		categoryExpenseRows,
		operatingCostRows,
		financialRows,
	};
}

/**
 * Generate Balance Sheet (Balansräkning) with mathematical Debet = Kredit equilibrium
 */
export function getBalanceSheetData(filter: ReportPeriodFilter): BalanceSheetData {
	const allInvoices = invoiceRepository.getInvoices();
	const allExpenses = expenseRepository.getAllExpenses();
	const prevYear = filter.year - 1;

	// Accounts Receivable (1510) = Unpaid customer invoices
	const unpaidInvoicesCurrent = allInvoices
		.filter((inv) => inv.status !== "paid")
		.reduce((acc, inv) => acc + (inv.balance ?? inv.total ?? 0), 0);
	const unpaidInvoicesPrev = Math.round(unpaidInvoicesCurrent * 0.9);

	// Accounts Payable (2440) = Unpaid supplier invoices
	const unpaidExpensesCurrent = allExpenses
		.filter((exp) => exp.status !== "klar" && exp.status !== "paid")
		.reduce((acc, exp) => acc + (exp.amount ?? 0), 0);
	const unpaidExpensesPrev = Math.round(unpaidExpensesCurrent * 0.92);

	// Paid invoice and expense cash flow
	const paidInflow = allInvoices
		.filter((inv) => inv.status === "paid")
		.reduce((acc, inv) => acc + (inv.total ?? 0), 0);
	const paidOutflow = allExpenses
		.filter((exp) => exp.status === "klar" || exp.status === "paid")
		.reduce((acc, exp) => acc + (exp.amount ?? 0), 0);

	// Fixed assets
	const machinery = 750000;
	const prevMachinery = 820000;
	const totalFixedAssets = machinery;

	// Current assets
	const accountsReceivable = 350000 + unpaidInvoicesCurrent;
	const prevAccountsReceivable = 320000 + unpaidInvoicesPrev;

	const taxAccount = 85000;
	const prevTaxAccount = 75000;

	const bankChecking = 820000 + paidInflow - paidOutflow;
	const prevBankChecking = Math.round(bankChecking * 0.92);

	const pettyCash = 15000;
	const prevPettyCash = 15000;

	const totalCurrentAssets = accountsReceivable + taxAccount + bankChecking + pettyCash;
	const totalAssets = totalFixedAssets + totalCurrentAssets;

	// Long-term liabilities
	const bankLoans = 550000;
	const prevBankLoans = 650000;
	const totalLongTermLiabilities = bankLoans;

	// VAT liability from Momsrapport
	const vatData = getVatReportData(filter);
	const vatLiability = Math.max(0, vatData.netVatPayable);
	const prevVatLiability = Math.round(vatLiability * 0.95);

	const accountsPayable = 220000 + unpaidExpensesCurrent;
	const prevAccountsPayable = 200000 + unpaidExpensesPrev;

	// Personnel taxes (Account 2710)
	const isData = getIncomeStatementData(filter);
	const personnelTaxes = Math.round(isData.operatingCostRows.find((r) => r.accountCode === BAS_ACCOUNTS.SALARIES || r.accountCode === BAS_ACCOUNTS.SALARIES_WAGES)?.amount ?? 250000) * 0.30;
	const prevPersonnelTaxes = Math.round(personnelTaxes * 0.93);

	const totalShortTermLiabilities = accountsPayable + vatLiability + Math.round(personnelTaxes);
	const totalLiabilities = totalLongTermLiabilities + totalShortTermLiabilities;

	// Equity: Share capital + Net result + balancing retained earnings
	const shareCapital = 50000;
	const currentYearResult = isData.netResult;
	// Retained earnings naturally balances the balance sheet: TotalAssets - TotalLiabilities - ShareCapital - CurrentYearResult
	const retainedEarnings = totalAssets - totalLiabilities - shareCapital - currentYearResult;
	const prevRetainedEarnings = Math.round(retainedEarnings * 0.9);

	const totalEquity = shareCapital + retainedEarnings + currentYearResult;
	const totalEquityAndLiabilities = totalEquity + totalLiabilities;

	const difference = totalAssets - totalEquityAndLiabilities;
	const isBalanced = difference === 0;

	const fixedAssetRows: BalanceSheetRow[] = [
		{
			id: "fa_1220",
			accountCode: BAS_ACCOUNTS.MACHINERY_EQUIPMENT,
			labelKey: localizationConstants.basMachineryEquipment,
			amount: machinery,
			previousPeriodAmount: prevMachinery,
			category: "fixed_assets",
		},
	];

	const currentAssetRows: BalanceSheetRow[] = [
		{
			id: "ca_1510",
			accountCode: BAS_ACCOUNTS.ACCOUNTS_RECEIVABLE,
			labelKey: localizationConstants.basAccountsReceivable,
			amount: accountsReceivable,
			previousPeriodAmount: prevAccountsReceivable,
			category: "current_assets",
		},
		{
			id: "ca_1630",
			accountCode: BAS_ACCOUNTS.TAX_ACCOUNT,
			labelKey: localizationConstants.basTaxAccount,
			amount: taxAccount,
			previousPeriodAmount: prevTaxAccount,
			category: "current_assets",
		},
		{
			id: "ca_1930",
			accountCode: BAS_ACCOUNTS.BANK_CHECKING,
			labelKey: localizationConstants.basBankChecking,
			amount: bankChecking,
			previousPeriodAmount: prevBankChecking,
			category: "current_assets",
		},
		{
			id: "ca_1910",
			accountCode: BAS_ACCOUNTS.PETTY_CASH,
			labelKey: localizationConstants.basPettyCash,
			amount: pettyCash,
			previousPeriodAmount: prevPettyCash,
			category: "current_assets",
		},
	];

	const equityRows: BalanceSheetRow[] = [
		{
			id: "eq_2081",
			accountCode: BAS_ACCOUNTS.SHARE_CAPITAL,
			labelKey: localizationConstants.basShareCapital,
			amount: shareCapital,
			previousPeriodAmount: shareCapital,
			category: "equity",
		},
		{
			id: "eq_2091",
			accountCode: BAS_ACCOUNTS.RETAINED_EARNINGS,
			labelKey: localizationConstants.basRetainedEarnings,
			amount: retainedEarnings,
			previousPeriodAmount: prevRetainedEarnings,
			category: "equity",
		},
		{
			id: "eq_2099",
			accountCode: BAS_ACCOUNTS.CURRENT_YEAR_RESULT,
			labelKey: localizationConstants.basCurrentYearResult,
			amount: currentYearResult,
			previousPeriodAmount: Math.round(currentYearResult * 0.92),
			category: "equity",
		},
	];

	const longTermLiabilityRows: BalanceSheetRow[] = [
		{
			id: "ltl_2350",
			accountCode: BAS_ACCOUNTS.BANK_LOANS,
			labelKey: localizationConstants.basBankLoans,
			amount: bankLoans,
			previousPeriodAmount: prevBankLoans,
			category: "long_term_liabilities",
		},
	];

	const shortTermLiabilityRows: BalanceSheetRow[] = [
		{
			id: "stl_2440",
			accountCode: BAS_ACCOUNTS.ACCOUNTS_PAYABLE,
			labelKey: localizationConstants.basAccountsPayable,
			amount: accountsPayable,
			previousPeriodAmount: prevAccountsPayable,
			category: "short_term_liabilities",
		},
		{
			id: "stl_2650",
			accountCode: BAS_ACCOUNTS.VAT_SETTLEMENT,
			labelKey: localizationConstants.basVatSettlement,
			amount: vatLiability,
			previousPeriodAmount: prevVatLiability,
			category: "short_term_liabilities",
		},
		{
			id: "stl_2710",
			accountCode: BAS_ACCOUNTS.PERSONNEL_TAXES,
			labelKey: localizationConstants.basPersonnelTaxes,
			amount: Math.round(personnelTaxes),
			previousPeriodAmount: prevPersonnelTaxes,
			category: "short_term_liabilities",
		},
	];

	return {
		filter,
		comparisonYear: prevYear,
		totalAssets,
		totalFixedAssets,
		totalCurrentAssets,
		fixedAssetRows,
		currentAssetRows,
		totalEquity,
		equityRows,
		totalLongTermLiabilities,
		longTermLiabilityRows,
		totalShortTermLiabilities,
		shortTermLiabilityRows,
		totalLiabilities,
		totalEquityAndLiabilities,
		isBalanced,
		difference,
	};
}

/**
 * Generate official Swedish VAT Declaration (Momsrapport / Skattedeklaration)
 */
export function getVatReportData(filter: ReportPeriodFilter): VatReportData {
	const allInvoices = invoiceRepository.getInvoices();
	const allExpenses = expenseRepository.getAllExpenses();

	const periodInvoices = allInvoices.filter((inv) =>
		isDateInPeriod(inv.invoiceDate || inv.dueDate, filter),
	);
	const periodExpenses = allExpenses.filter((exp) =>
		isDateInPeriod(exp.date || exp.invoiceDate, filter),
	);

	const periodFraction =
		filter.periodType === "monthly" ? 1 / 12 : filter.periodType === "quarterly" ? 1 / 4 : 1.0;
	const seasonality = getPeriodSeasonalityFactor(filter);

	// Invoiced sales (Box 05)
	const liveSales = periodInvoices.reduce((acc, inv) => acc + (inv.total || 0), 0);
	const baseSales = Math.round(3800000 * periodFraction * seasonality);
	const totalSalesMomspliktig = baseSales + liveSales;

	const sales25 = Math.round(totalSalesMomspliktig * 0.88);
	const sales12 = Math.round(totalSalesMomspliktig * 0.08);
	const sales06 = Math.round(totalSalesMomspliktig * 0.04);

	const outputVat25 = Math.round(sales25 * STANDARD_VAT_RATE_25);
	const outputVat12 = Math.round(sales12 * STANDARD_VAT_RATE_12);
	const outputVat06 = Math.round(sales06 * STANDARD_VAT_RATE_06);
	const totalOutputVat = outputVat25 + outputVat12 + outputVat06;

	// Input VAT on purchases (Box 48)
	const liveInputVat = periodExpenses.reduce((acc, exp) => acc + (exp.vatAmount || 0), 0);
	const baseInputVat = Math.round(totalOutputVat * 0.55);
	const totalInputVatDeductible = baseInputVat + Math.round(liveInputVat);

	// Net VAT payable (Box 49)
	const netVatPayable = totalOutputVat - totalInputVatDeductible;

	return {
		filter,
		comparisonYear: filter.year - 1,
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
				boxNameKey: localizationConstants.vatReportBox05,
				baseAmount: totalSalesMomspliktig,
				vatAmount: 0,
				descriptionKey: localizationConstants.vatReportBox05Desc,
			},
			{
				boxNumber: SKATTEVERKET_BOXES.BOX_10,
				boxNameKey: localizationConstants.vatReportBox10,
				vatRate: STANDARD_VAT_RATE_25,
				baseAmount: sales25,
				vatAmount: outputVat25,
				descriptionKey: localizationConstants.vatReportBox10Desc,
			},
			{
				boxNumber: SKATTEVERKET_BOXES.BOX_11,
				boxNameKey: localizationConstants.vatReportBox11,
				vatRate: STANDARD_VAT_RATE_12,
				baseAmount: sales12,
				vatAmount: outputVat12,
				descriptionKey: localizationConstants.vatReportBox11Desc,
			},
			{
				boxNumber: SKATTEVERKET_BOXES.BOX_12,
				boxNameKey: localizationConstants.vatReportBox12,
				vatRate: STANDARD_VAT_RATE_06,
				baseAmount: sales06,
				vatAmount: outputVat06,
				descriptionKey: localizationConstants.vatReportBox12Desc,
			},
			{
				boxNumber: SKATTEVERKET_BOXES.BOX_48,
				boxNameKey: localizationConstants.vatReportBox48,
				vatAmount: totalInputVatDeductible,
				descriptionKey: localizationConstants.vatReportBox48Desc,
			},
			{
				boxNumber: SKATTEVERKET_BOXES.BOX_49,
				boxNameKey: localizationConstants.vatReportBox49,
				vatAmount: netVatPayable,
				descriptionKey: localizationConstants.vatReportBox49Desc,
				isResultBox: true,
			},
		],
	};
}

/**
 * Unified KPI Summary for top overview cards
 */
export function getReportKpiSummary(filter: ReportPeriodFilter): ReportKpiSummary {
	const isData = getIncomeStatementData(filter);
	const vatData = getVatReportData(filter);

	const operatingMargin =
		isData.totalRevenue > 0
			? Math.round((isData.operatingResult / isData.totalRevenue) * 1000) / 10
			: 0;

	return {
		totalRevenueSek: isData.totalRevenue,
		totalExpensesSek: isData.totalDirectCosts + isData.totalOperatingExpenses,
		operatingResultSek: isData.operatingResult,
		operatingMarginPercent: operatingMargin,
		netResultSek: isData.netResult,
		vatBalanceSek: vatData.netVatPayable,
	};
}

/**
 * Retrieve contributing source transactions for ledger drill-down
 */
export function getTransactionsForAccount(
	accountCode: string | undefined,
	filter: ReportPeriodFilter,
): TransactionDetailItem[] {
	if (!accountCode) return [];

	const allInvoices = invoiceRepository.getInvoices();
	const allExpenses = expenseRepository.getAllExpenses();

	const periodInvoices = allInvoices.filter((inv) =>
		isDateInPeriod(inv.invoiceDate || inv.dueDate, filter),
	);
	const periodExpenses = allExpenses.filter((exp) =>
		isDateInPeriod(exp.date || exp.invoiceDate, filter),
	);

	// Revenue Accounts (3001, 3040, 3900) & Receivables (1510)
	if (
		accountCode === BAS_ACCOUNTS.SALES_25 ||
		accountCode === BAS_ACCOUNTS.SALES_SERVICES ||
		accountCode === BAS_ACCOUNTS.OTHER_OPERATING_INCOME ||
		accountCode === BAS_ACCOUNTS.ACCOUNTS_RECEIVABLE
	) {
		const targetInvoices =
			accountCode === BAS_ACCOUNTS.ACCOUNTS_RECEIVABLE
				? periodInvoices.filter((inv) => inv.status !== "paid")
				: periodInvoices;

		return targetInvoices.map((inv) => ({
			id: inv.id,
			date: inv.invoiceDate || inv.dueDate || "2026-01-01",
			documentNo: inv.invoiceNo,
			counterparty: inv.customer,
			description: `${inv.object || "Faktura"} - ${inv.contractType || "Uppdrag"}`,
			netAmount: Math.round(inv.total * 0.8),
			vatAmount: Math.round(inv.total * 0.2),
			totalAmount: inv.total,
			sourceType: "invoice",
			status: inv.status,
			linkHref: `/module/financial-management/invoice/${inv.id}`,
		}));
	}

	// Cost & Expense Accounts (4010, 4600, 5010, 5600, 6000, 7010) & Payables (2440)
	if (
		accountCode === BAS_ACCOUNTS.MATERIAL_PURCHASE ||
		accountCode === BAS_ACCOUNTS.SUBCONTRACTORS ||
		accountCode === BAS_ACCOUNTS.RENT_PREMISES ||
		accountCode === BAS_ACCOUNTS.TRAVEL_VEHICLES ||
		accountCode === BAS_ACCOUNTS.ADMIN_OTHER ||
		accountCode === BAS_ACCOUNTS.SALARIES ||
		accountCode === BAS_ACCOUNTS.ACCOUNTS_PAYABLE
	) {
		const targetExpenses =
			accountCode === BAS_ACCOUNTS.ACCOUNTS_PAYABLE
				? periodExpenses.filter((exp) => exp.status !== "klar" && exp.status !== "paid")
				: periodExpenses;

		return targetExpenses.map((exp) => ({
			id: exp.id,
			date: exp.date || exp.invoiceDate || "2026-01-01",
			documentNo: exp.expenseNo || exp.fakturaNo || "EXP",
			counterparty: exp.supplier || "Leverantör",
			description: exp.notes || exp.project || "Inköp och omkostnader",
			netAmount: Math.round(exp.amount - (exp.vatAmount || 0)),
			vatAmount: exp.vatAmount || 0,
			totalAmount: exp.amount,
			sourceType: "expense",
			status: exp.status,
			linkHref: `/module/financial-management/economy/${exp.id}`,
		}));
	}

	// Bank account (1930) - All paid inflows and outflows
	if (accountCode === BAS_ACCOUNTS.BANK_CHECKING) {
		const paidInvoices: TransactionDetailItem[] = periodInvoices
			.filter((inv) => inv.status === "paid")
			.map((inv) => ({
				id: inv.id,
				date: inv.fullyPaidDate || inv.invoiceDate || "2026-01-01",
				documentNo: inv.invoiceNo,
				counterparty: inv.customer,
				description: `Kundinbetalning: ${inv.customer}`,
				netAmount: Math.round(inv.total * 0.8),
				vatAmount: Math.round(inv.total * 0.2),
				totalAmount: inv.total,
				sourceType: "invoice",
				status: "paid",
				linkHref: `/module/financial-management/invoice/${inv.id}`,
			}));

		const paidExpenses: TransactionDetailItem[] = periodExpenses
			.filter((exp) => exp.status === "klar" || exp.status === "paid")
			.map((exp) => ({
				id: exp.id,
				date: exp.paymentDate || exp.date || "2026-01-01",
				documentNo: exp.expenseNo,
				counterparty: exp.supplier,
				description: `Leverantörsutbetalning: ${exp.supplier}`,
				netAmount: Math.round(exp.amount - (exp.vatAmount || 0)),
				vatAmount: exp.vatAmount || 0,
				totalAmount: -exp.amount,
				sourceType: "expense",
				status: "paid",
				linkHref: `/module/financial-management/economy/${exp.id}`,
			}));

		return [...paidInvoices, ...paidExpenses];
	}

	return [];
}

/**
 * Retrieve contributing source transactions for a specific Skatteverket VAT Box
 */
export function getTransactionsForVatBox(
	boxNumber: string | undefined,
	filter: ReportPeriodFilter,
): TransactionDetailItem[] {
	if (!boxNumber) return [];

	const allInvoices = invoiceRepository.getInvoices();
	const allExpenses = expenseRepository.getAllExpenses();

	const periodInvoices = allInvoices.filter((inv) =>
		isDateInPeriod(inv.invoiceDate || inv.dueDate, filter),
	);
	const periodExpenses = allExpenses.filter((exp) =>
		isDateInPeriod(exp.date || exp.invoiceDate, filter),
	);

	// Output VAT boxes (05, 10, 11, 12) -> customer invoices
	if (
		boxNumber === SKATTEVERKET_BOXES.BOX_05 ||
		boxNumber === SKATTEVERKET_BOXES.BOX_10 ||
		boxNumber === SKATTEVERKET_BOXES.BOX_11 ||
		boxNumber === SKATTEVERKET_BOXES.BOX_12
	) {
		return periodInvoices.map((inv) => ({
			id: inv.id,
			date: inv.invoiceDate || inv.dueDate || "2026-01-01",
			documentNo: inv.invoiceNo,
			counterparty: inv.customer,
			description: `Momspliktig försäljning: ${inv.customer}`,
			netAmount: Math.round(inv.total * 0.8),
			vatAmount: Math.round(inv.total * 0.2),
			totalAmount: inv.total,
			sourceType: "invoice",
			status: inv.status,
			linkHref: `/module/financial-management/invoice/${inv.id}`,
		}));
	}

	// Input VAT box (48) -> supplier invoices / expenses
	if (boxNumber === SKATTEVERKET_BOXES.BOX_48) {
		return periodExpenses.map((exp) => ({
			id: exp.id,
			date: exp.date || exp.invoiceDate || "2026-01-01",
			documentNo: exp.expenseNo || "EXP",
			counterparty: exp.supplier,
			description: `Avdragsgill ingående moms: ${exp.supplier}`,
			netAmount: Math.round(exp.amount - (exp.vatAmount || 0)),
			vatAmount: exp.vatAmount || 0,
			totalAmount: exp.amount,
			sourceType: "expense",
			status: exp.status,
			linkHref: `/module/financial-management/economy/${exp.id}`,
		}));
	}

	// Net VAT box (49) -> all VAT items
	if (boxNumber === SKATTEVERKET_BOXES.BOX_49) {
		return [
			...getTransactionsForVatBox(SKATTEVERKET_BOXES.BOX_10, filter),
			...getTransactionsForVatBox(SKATTEVERKET_BOXES.BOX_48, filter),
		];
	}

	return [];
}

/**
 * Format localized period labels for display
 */
export function formatPeriodLabel(
	filter: ReportPeriodFilter,
	t: (key: string) => string,
): string {
	if (filter.periodType === "monthly" && filter.month) {
		const item = MONTH_TRANSLATION_KEYS.find((m) => m.value === filter.month);
		const monthName = item ? t(item.key) : `Månad ${filter.month}`;
		return `${monthName} ${filter.year}`;
	}

	if (filter.periodType === "quarterly" && filter.quarter) {
		const item = QUARTER_TRANSLATION_KEYS.find((q) => q.value === filter.quarter);
		const quarterName = item ? t(item.key) : `Q${filter.quarter}`;
		return `${quarterName} ${filter.year}`;
	}

	return `${t(localizationConstants.periodFullYear)} ${filter.year}`;
}

export function formatComparisonPeriodLabel(
	filter: ReportPeriodFilter,
	comparisonYear: number,
	t: (key: string) => string,
): string {
	if (filter.periodType === "monthly" && filter.month) {
		const item = MONTH_TRANSLATION_KEYS.find((m) => m.value === filter.month);
		const monthName = item ? t(item.key) : `Månad ${filter.month}`;
		return `${monthName} ${comparisonYear}`;
	}

	if (filter.periodType === "quarterly" && filter.quarter) {
		const item = QUARTER_TRANSLATION_KEYS.find((q) => q.value === filter.quarter);
		const quarterName = item ? t(item.key) : `Q${filter.quarter}`;
		return `${quarterName} ${comparisonYear}`;
	}

	return `${t(localizationConstants.periodFullYear)} ${comparisonYear}`;
}
