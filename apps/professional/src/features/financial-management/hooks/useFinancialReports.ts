"use client";

import { useCallback, useMemo, useState } from "react";
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
	getReportKpis,
	getVatReportData,
} from "../services/financialReports.service";
import type {
	ReportPeriodFilter,
	ReportPeriodType,
	ReportTabType,
} from "../types/financialReports.types";

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

	const handleTabChange = useCallback((tab: ReportTabType) => {
		setIsLoading(true);
		setActiveTab(tab);
		setTimeout(() => setIsLoading(false), 80);
	}, []);

	const handlePeriodTypeChange = useCallback((periodType: ReportPeriodType) => {
		setIsLoading(true);
		setPeriodFilter((prev) => ({
			...prev,
			periodType,
		}));
		setTimeout(() => setIsLoading(false), 80);
	}, []);

	const handleYearChange = useCallback((year: number) => {
		setIsLoading(true);
		setPeriodFilter((prev) => ({
			...prev,
			year,
		}));
		setTimeout(() => setIsLoading(false), 80);
	}, []);

	const handleMonthChange = useCallback((month: number) => {
		setIsLoading(true);
		setPeriodFilter((prev) => ({
			...prev,
			month,
		}));
		setTimeout(() => setIsLoading(false), 80);
	}, []);

	const handleQuarterChange = useCallback((quarter: number) => {
		setIsLoading(true);
		setPeriodFilter((prev) => ({
			...prev,
			quarter,
		}));
		setTimeout(() => setIsLoading(false), 80);
	}, []);

	// Granular memoization for financial reports
	const incomeStatementData = useMemo(() => {
		return getIncomeStatementData(periodFilter);
	}, [periodFilter]);

	const balanceSheetData = useMemo(() => {
		return getBalanceSheetData(periodFilter);
	}, [periodFilter]);

	const vatReportData = useMemo(() => {
		return getVatReportData(periodFilter);
	}, [periodFilter]);

	const kpiSummary = useMemo(() => {
		return getReportKpis(periodFilter);
	}, [periodFilter]);

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
		isLoading,
		isExporting,
		incomeStatementData,
		balanceSheetData,
		vatReportData,
		kpiSummary,
		handleTabChange,
		handlePeriodTypeChange,
		handleYearChange,
		handleMonthChange,
		handleQuarterChange,
		handleExportExcel,
		handlePrint,
	};
}
