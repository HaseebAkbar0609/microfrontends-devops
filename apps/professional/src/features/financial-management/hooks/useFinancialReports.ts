"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import {
	DEFAULT_REPORT_PERIOD_TYPE,
	DEFAULT_REPORT_TAB,
	DEFAULT_REPORT_YEAR,
} from "../constants/financialReports.constants";
import {
	formatPeriodLabel,
	getBalanceSheetData,
	getIncomeStatementData,
	getReportKpiSummary,
	getTransactionsForAccount,
	getTransactionsForVatBox,
	getVatReportData,
} from "../services/financialReports.service";
import type {
	DrilldownTarget,
	ReportPeriodFilter,
	ReportPeriodType,
	ReportTabType,
	TransactionDetailItem,
} from "../types/financialReports.types";
import { invoiceRepository } from "../utils/invoiceRepository";
import { expenseRepository } from "../utils/expenseRepository";

export function useFinancialReports() {
	const { t } = useTranslation();
	const [activeTab, setActiveTab] = useState<ReportTabType>(DEFAULT_REPORT_TAB);

	const [periodFilter, setPeriodFilter] = useState<ReportPeriodFilter>({
		periodType: DEFAULT_REPORT_PERIOD_TYPE,
		year: DEFAULT_REPORT_YEAR,
		month: 3,
		quarter: 1,
	});

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isExporting, setIsExporting] = useState<boolean>(false);
	const [repoRevision, setRepoRevision] = useState<number>(0);

	// Drill-down drawer state
	const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
	const [drilldownTarget, setDrilldownTarget] = useState<DrilldownTarget | null>(null);

	// Reactive subscription to operational repositories
	useEffect(() => {
		const unsubInvoice = invoiceRepository.subscribe(() => {
			setRepoRevision((prev) => prev + 1);
		});
		const unsubExpense = expenseRepository.subscribe(() => {
			setRepoRevision((prev) => prev + 1);
		});
		return () => {
			unsubInvoice();
			unsubExpense();
		};
	}, []);

	const handleTabChange = useCallback((tab: ReportTabType) => {
		setIsLoading(true);
		setActiveTab(tab);
		setTimeout(() => setIsLoading(false), 60);
	}, []);

	const handlePeriodTypeChange = useCallback((periodType: ReportPeriodType) => {
		setIsLoading(true);
		setPeriodFilter((prev) => ({
			...prev,
			periodType,
		}));
		setTimeout(() => setIsLoading(false), 60);
	}, []);

	const handleYearChange = useCallback((year: number) => {
		setIsLoading(true);
		setPeriodFilter((prev) => ({
			...prev,
			year,
		}));
		setTimeout(() => setIsLoading(false), 60);
	}, []);

	const handleMonthChange = useCallback((month: number) => {
		setIsLoading(true);
		setPeriodFilter((prev) => ({
			...prev,
			month,
		}));
		setTimeout(() => setIsLoading(false), 60);
	}, []);

	const handleQuarterChange = useCallback((quarter: number) => {
		setIsLoading(true);
		setPeriodFilter((prev) => ({
			...prev,
			quarter,
		}));
		setTimeout(() => setIsLoading(false), 60);
	}, []);

	// Granular memoization for financial reports
	const incomeStatementData = useMemo(() => {
		void repoRevision;
		return getIncomeStatementData(periodFilter);
	}, [periodFilter, repoRevision]);

	const balanceSheetData = useMemo(() => {
		void repoRevision;
		return getBalanceSheetData(periodFilter);
	}, [periodFilter, repoRevision]);

	const vatReportData = useMemo(() => {
		void repoRevision;
		return getVatReportData(periodFilter);
	}, [periodFilter, repoRevision]);

	const kpiSummary = useMemo(() => {
		void repoRevision;
		return getReportKpiSummary(periodFilter);
	}, [periodFilter, repoRevision]);

	const periodLabel = useMemo(() => {
		return formatPeriodLabel(periodFilter, t);
	}, [periodFilter, t]);

	// Drilldown actions
	const handleAccountClick = useCallback(
		(accountCode: string, labelKey: string, amount: number) => {
			setDrilldownTarget({
				accountCode,
				labelKey,
				totalAmount: amount,
			});
			setIsDrawerOpen(true);
		},
		[],
	);

	const handleVatBoxClick = useCallback(
		(boxNumber: string, boxNameKey: string, amount: number) => {
			setDrilldownTarget({
				boxNumber,
				labelKey: boxNameKey,
				totalAmount: amount,
			});
			setIsDrawerOpen(true);
		},
		[],
	);

	const handleCloseDrawer = useCallback(() => {
		setIsDrawerOpen(false);
		setDrilldownTarget(null);
	}, []);

	const drilldownTransactions = useMemo<TransactionDetailItem[]>(() => {
		void repoRevision;
		if (!drilldownTarget) return [];
		if (drilldownTarget.boxNumber) {
			return getTransactionsForVatBox(drilldownTarget.boxNumber, periodFilter);
		}
		return getTransactionsForAccount(drilldownTarget.accountCode, periodFilter);
	}, [drilldownTarget, periodFilter, repoRevision]);

	// Export to Excel / CSV
	const handleExportExcel = useCallback(() => {
		setIsExporting(true);
		try {
			let csvContent = "\uFEFF"; // UTF-8 BOM for Excel
			const currentPeriodStr = formatPeriodLabel(periodFilter, t);

			if (activeTab === "income_statement") {
				csvContent += `${t(localizationConstants.incomeStatementTitle)};${currentPeriodStr}\r\n`;
				csvContent += `${t(localizationConstants.incomeStatementColAccount)};${t(localizationConstants.incomeStatementColDescription)};${t(localizationConstants.incomeStatementColCurrentPeriod)};${t(localizationConstants.incomeStatementColPreviousPeriod)};${t(localizationConstants.incomeStatementColVarianceSek)};${t(localizationConstants.incomeStatementColVariancePercent)}\r\n`;
				for (const row of incomeStatementData.revenueRows) {
					csvContent += `${row.accountCode};${t(row.labelKey)};${row.amount};${row.previousPeriodAmount};${row.varianceSek};${row.variancePercent}%\r\n`;
				}
				for (const row of incomeStatementData.directCostRows) {
					csvContent += `${row.accountCode};${t(row.labelKey)};${row.amount};${row.previousPeriodAmount};${row.varianceSek};${row.variancePercent}%\r\n`;
				}
				for (const row of incomeStatementData.operatingCostRows) {
					csvContent += `${row.accountCode};${t(row.labelKey)};${row.amount};${row.previousPeriodAmount};${row.varianceSek};${row.variancePercent}%\r\n`;
				}
				csvContent += `;;${t(localizationConstants.incomeStatementOperatingResult)};${incomeStatementData.operatingResult};;;\r\n`;
				csvContent += `;;${t(localizationConstants.incomeStatementNetResult)};${incomeStatementData.netResult};;;\r\n`;
			} else if (activeTab === "balance_sheet") {
				csvContent += `${t(localizationConstants.balanceSheetTitle)};${currentPeriodStr}\r\n`;
				csvContent += `${t(localizationConstants.incomeStatementColAccount)};${t(localizationConstants.incomeStatementColDescription)};${t(localizationConstants.incomeStatementColCurrentPeriod)};${t(localizationConstants.incomeStatementColPreviousPeriod)}\r\n`;
				for (const row of balanceSheetData.fixedAssetRows) {
					csvContent += `${row.accountCode};${t(row.labelKey)};${row.amount};${row.previousPeriodAmount}\r\n`;
				}
				for (const row of balanceSheetData.currentAssetRows) {
					csvContent += `${row.accountCode};${t(row.labelKey)};${row.amount};${row.previousPeriodAmount}\r\n`;
				}
				csvContent += `;;${t(localizationConstants.balanceSheetTotalAssets)};${balanceSheetData.totalAssets};;\r\n`;
				for (const row of balanceSheetData.equityRows) {
					csvContent += `${row.accountCode};${t(row.labelKey)};${row.amount};${row.previousPeriodAmount}\r\n`;
				}
				for (const row of balanceSheetData.longTermLiabilityRows) {
					csvContent += `${row.accountCode};${t(row.labelKey)};${row.amount};${row.previousPeriodAmount}\r\n`;
				}
				for (const row of balanceSheetData.shortTermLiabilityRows) {
					csvContent += `${row.accountCode};${t(row.labelKey)};${row.amount};${row.previousPeriodAmount}\r\n`;
				}
				csvContent += `;;${t(localizationConstants.balanceSheetTotalEquityAndLiab)};${balanceSheetData.totalEquityAndLiabilities};;\r\n`;
			} else {
				csvContent += `${t(localizationConstants.vatReportTitle)};${currentPeriodStr}\r\n`;
				csvContent += `${t(localizationConstants.vatReportColBox)};${t(localizationConstants.vatReportColSpecification)};${t(localizationConstants.vatReportColBaseAmount)};${t(localizationConstants.vatReportColRate)};${t(localizationConstants.vatReportColVatAmount)}\r\n`;
				for (const box of vatReportData.boxes) {
					const rateStr = box.vatRate ? `${Math.round(box.vatRate * 100)}%` : "-";
					csvContent += `${box.boxNumber};${t(box.boxNameKey)};${box.baseAmount ?? 0};${rateStr};${box.vatAmount}\r\n`;
				}
			}

			const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.setAttribute("href", url);
			link.setAttribute("download", `${activeTab}_${periodFilter.year}.csv`);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		} finally {
			setIsExporting(false);
		}
	}, [activeTab, periodFilter, incomeStatementData, balanceSheetData, vatReportData, t]);

	const handlePrint = useCallback(() => {
		if (typeof window !== "undefined") {
			window.print();
		}
	}, []);

	return {
		activeTab,
		periodFilter,
		periodLabel,
		isLoading,
		isExporting,
		incomeStatementData,
		balanceSheetData,
		vatReportData,
		kpiSummary,
		isDrawerOpen,
		drilldownTarget,
		drilldownTransactions,
		handleTabChange,
		handlePeriodTypeChange,
		handleYearChange,
		handleMonthChange,
		handleQuarterChange,
		handleAccountClick,
		handleVatBoxClick,
		handleCloseDrawer,
		handleExportExcel,
		handlePrint,
	};
}

export default useFinancialReports;
