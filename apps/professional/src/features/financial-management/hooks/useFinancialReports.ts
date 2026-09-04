"use client";

import { useCallback, useMemo, useState } from "react";
import {
	DEFAULT_REPORT_PERIOD_TYPE,
	DEFAULT_REPORT_TAB,
	DEFAULT_REPORT_YEAR,
} from "../constants/financialReports.constants";
import {
	getBalanceSheetData,
	getGeneratedReportsList,
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
	const [activeTab, setActiveTab] = useState<ReportTabType>(DEFAULT_REPORT_TAB);
	const [periodFilter, setPeriodFilter] = useState<ReportPeriodFilter>({
		periodType: DEFAULT_REPORT_PERIOD_TYPE,
		year: DEFAULT_REPORT_YEAR,
		month: 6,
		quarter: 2,
	});
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isExporting, setIsExporting] = useState<boolean>(false);

	const handleTabChange = useCallback((tab: ReportTabType) => {
		setIsLoading(true);
		setActiveTab(tab);
		setTimeout(() => setIsLoading(false), 150);
	}, []);

	const handlePeriodTypeChange = useCallback((periodType: ReportPeriodType) => {
		setIsLoading(true);
		setPeriodFilter((prev) => ({
			...prev,
			periodType,
		}));
		setTimeout(() => setIsLoading(false), 150);
	}, []);

	const handleYearChange = useCallback((year: number) => {
		setIsLoading(true);
		setPeriodFilter((prev) => ({
			...prev,
			year,
		}));
		setTimeout(() => setIsLoading(false), 150);
	}, []);

	const handleMonthChange = useCallback((month: number) => {
		setIsLoading(true);
		setPeriodFilter((prev) => ({
			...prev,
			month,
		}));
		setTimeout(() => setIsLoading(false), 150);
	}, []);

	const handleQuarterChange = useCallback((quarter: number) => {
		setIsLoading(true);
		setPeriodFilter((prev) => ({
			...prev,
			quarter,
		}));
		setTimeout(() => setIsLoading(false), 150);
	}, []);

	// Granular memoization for report data
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

	const reportList = useMemo(() => {
		return getGeneratedReportsList(activeTab, periodFilter);
	}, [activeTab, periodFilter]);

	// Export functions
	const handleExportExcel = useCallback(() => {
		setIsExporting(true);
		try {
			let csvContent = "\uFEFF"; // UTF-8 BOM for Swedish characters in Excel

			if (activeTab === "income_statement") {
				csvContent += "Resultaträkning;" + incomeStatementData.periodLabel + "\r\n";
				csvContent += "Konto;Beskrivning;Utfall;Föregående år;Förändring SEK;Förändring %\r\n";
				for (const row of incomeStatementData.revenueRows) {
					csvContent += `${row.accountCode};${row.labelKey};${row.amount};${row.previousPeriodAmount};${row.varianceSek};${row.variancePercent}%\r\n`;
				}
				for (const row of incomeStatementData.directCostRows) {
					csvContent += `${row.accountCode};${row.labelKey};${row.amount};${row.previousPeriodAmount};${row.varianceSek};${row.variancePercent}%\r\n`;
				}
				for (const row of incomeStatementData.operatingCostRows) {
					csvContent += `${row.accountCode};${row.labelKey};${row.amount};${row.previousPeriodAmount};${row.varianceSek};${row.variancePercent}%\r\n`;
				}
				csvContent += `;;Rörelseresultat;${incomeStatementData.operatingResult};;;\r\n`;
				csvContent += `;;Årets resultat;${incomeStatementData.netResult};;;\r\n`;
			} else if (activeTab === "balance_sheet") {
				csvContent += "Balansräkning;" + balanceSheetData.periodLabel + "\r\n";
				csvContent += "Konto;Beskrivning;Belopp;Föregående år\r\n";
				for (const row of balanceSheetData.fixedAssetRows) {
					csvContent += `${row.accountCode};${row.labelKey};${row.amount};${row.previousPeriodAmount}\r\n`;
				}
				for (const row of balanceSheetData.currentAssetRows) {
					csvContent += `${row.accountCode};${row.labelKey};${row.amount};${row.previousPeriodAmount}\r\n`;
				}
				csvContent += `;;Summa tillgångar;${balanceSheetData.totalAssets};;\r\n`;
				for (const row of balanceSheetData.equityRows) {
					csvContent += `${row.accountCode};${row.labelKey};${row.amount};${row.previousPeriodAmount}\r\n`;
				}
				for (const row of balanceSheetData.longTermLiabilityRows) {
					csvContent += `${row.accountCode};${row.labelKey};${row.amount};${row.previousPeriodAmount}\r\n`;
				}
				for (const row of balanceSheetData.shortTermLiabilityRows) {
					csvContent += `${row.accountCode};${row.labelKey};${row.amount};${row.previousPeriodAmount}\r\n`;
				}
				csvContent += `;;Summa eget kapital och skulder;${balanceSheetData.totalEquityAndLiabilities};;\r\n`;
			} else {
				csvContent += "Momsrapport (Skatteverket);" + vatReportData.periodLabel + "\r\n";
				csvContent += "Ruta;Specifikation;Underlag;Momssats;Momsbelopp\r\n";
				for (const box of vatReportData.boxes) {
					const rateStr = box.vatRate ? `${Math.round(box.vatRate * 100)}%` : "-";
					csvContent += `${box.boxNumber};${box.boxNameKey};${box.baseAmount ?? 0};${rateStr};${box.vatAmount}\r\n`;
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
	}, [activeTab, periodFilter.year, incomeStatementData, balanceSheetData, vatReportData]);

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
		reportList,
		handleTabChange,
		handlePeriodTypeChange,
		handleYearChange,
		handleMonthChange,
		handleQuarterChange,
		handleExportExcel,
		handlePrint,
	};
}
