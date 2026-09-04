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
	addGeneratedReport,
	formatPeriodLabel,
	getBalanceSheetData,
	getGeneratedReportsList,
	getIncomeStatementData,
	getReportKpis,
	getVatReportData,
} from "../services/financialReports.service";
import type {
	GeneratedReportListItem,
	ReportMainTab,
	ReportPeriodFilter,
	ReportPeriodType,
	ReportTabType,
	ReportViewMode,
} from "../types/financialReports.types";

export function useFinancialReports() {
	const { t } = useTranslation();
	const [viewMode, setViewMode] = useState<ReportViewMode>("hub");
	const [activeMainTab, setActiveMainTab] = useState<ReportMainTab>("all");
	const [activeDetailTab, setActiveDetailTab] = useState<ReportTabType>(DEFAULT_REPORT_TAB);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

	const [periodFilter, setPeriodFilter] = useState<ReportPeriodFilter>({
		periodType: DEFAULT_REPORT_PERIOD_TYPE,
		year: DEFAULT_REPORT_YEAR,
		month: 6,
		quarter: 2,
	});

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isExporting, setIsExporting] = useState<boolean>(false);
	const [customReports, setCustomReports] = useState<GeneratedReportListItem[]>([]);

	const handleMainTabChange = useCallback((tab: ReportMainTab) => {
		setIsLoading(true);
		setActiveMainTab(tab);
		if (tab !== "all") {
			setActiveDetailTab(tab);
		}
		setTimeout(() => setIsLoading(false), 120);
	}, []);

	const handleDetailTabChange = useCallback((tab: ReportTabType) => {
		setIsLoading(true);
		setActiveDetailTab(tab);
		setTimeout(() => setIsLoading(false), 120);
	}, []);

	const handleViewReport = useCallback((report: GeneratedReportListItem) => {
		setIsLoading(true);
		setActiveDetailTab(report.reportType);
		setViewMode("detail");
		setTimeout(() => setIsLoading(false), 120);
	}, []);

	const handleBackToHub = useCallback(() => {
		setViewMode("hub");
	}, []);

	const handlePeriodTypeChange = useCallback((periodType: ReportPeriodType) => {
		setIsLoading(true);
		setPeriodFilter((prev) => ({
			...prev,
			periodType,
		}));
		setTimeout(() => setIsLoading(false), 120);
	}, []);

	const handleYearChange = useCallback((year: number) => {
		setIsLoading(true);
		setPeriodFilter((prev) => ({
			...prev,
			year,
		}));
		setTimeout(() => setIsLoading(false), 120);
	}, []);

	const handleMonthChange = useCallback((month: number) => {
		setIsLoading(true);
		setPeriodFilter((prev) => ({
			...prev,
			month,
		}));
		setTimeout(() => setIsLoading(false), 120);
	}, []);

	const handleQuarterChange = useCallback((quarter: number) => {
		setIsLoading(true);
		setPeriodFilter((prev) => ({
			...prev,
			quarter,
		}));
		setTimeout(() => setIsLoading(false), 120);
	}, []);

	const handleSearchChange = useCallback((query: string) => {
		setSearchQuery(query);
	}, []);

	const handleOpenCreateModal = useCallback(() => {
		setIsCreateModalOpen(true);
	}, []);

	const handleCloseCreateModal = useCallback(() => {
		setIsCreateModalOpen(false);
	}, []);

	const handleCreateReport = useCallback(
		(reportType: ReportTabType, periodType: ReportPeriodType, year: number, month?: number, quarter?: number) => {
			const filter: ReportPeriodFilter = { periodType, year, month, quarter };
			const periodStr = formatPeriodLabel(filter, t);
			const titlePrefix =
				reportType === "income_statement"
					? t(localizationConstants.reportTabIncomeStatement)
					: reportType === "balance_sheet"
						? t(localizationConstants.reportTabBalanceSheet)
						: t(localizationConstants.reportTabVatReport);

			const newReport: GeneratedReportListItem = {
				id: `rep-custom-${Date.now()}`,
				reportType,
				title: `${titlePrefix}_${year}.pdf`,
				periodLabel: periodStr,
				generatedDate: new Date().toISOString().split("T")[0],
				generatedBy: "System User",
				status: "ready",
			};

			addGeneratedReport(newReport);
			setCustomReports((prev) => [newReport, ...prev]);
			setPeriodFilter(filter);
			setActiveDetailTab(reportType);
			setIsCreateModalOpen(false);
			setViewMode("detail");
		},
		[t],
	);

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
		const raw = getGeneratedReportsList(activeMainTab, periodFilter);
		const combined = [...customReports, ...raw.filter((r) => !customReports.some((c) => c.id === r.id))];
		if (!searchQuery.trim()) {
			return combined;
		}
		const q = searchQuery.toLowerCase();
		return combined.filter(
			(r) =>
				r.title.toLowerCase().includes(q) ||
				r.periodLabel.toLowerCase().includes(q) ||
				r.generatedBy.toLowerCase().includes(q),
		);
	}, [activeMainTab, periodFilter, searchQuery, customReports]);

	// Export functions
	const handleExportExcel = useCallback(() => {
		setIsExporting(true);
		try {
			let csvContent = "\uFEFF"; // UTF-8 BOM for Excel
			const currentPeriodStr = formatPeriodLabel(periodFilter, t);

			if (activeDetailTab === "income_statement") {
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
			} else if (activeDetailTab === "balance_sheet") {
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
			link.setAttribute("download", `${activeDetailTab}_${periodFilter.year}.csv`);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		} finally {
			setIsExporting(false);
		}
	}, [activeDetailTab, periodFilter, incomeStatementData, balanceSheetData, vatReportData, t]);

	const handlePrint = useCallback(() => {
		if (typeof window !== "undefined") {
			window.print();
		}
	}, []);

	return {
		viewMode,
		activeMainTab,
		activeDetailTab,
		periodFilter,
		searchQuery,
		isCreateModalOpen,
		isLoading,
		isExporting,
		incomeStatementData,
		balanceSheetData,
		vatReportData,
		kpiSummary,
		reportList,
		handleMainTabChange,
		handleDetailTabChange,
		handleViewReport,
		handleBackToHub,
		handlePeriodTypeChange,
		handleYearChange,
		handleMonthChange,
		handleQuarterChange,
		handleSearchChange,
		handleOpenCreateModal,
		handleCloseCreateModal,
		handleCreateReport,
		handleExportExcel,
		handlePrint,
	};
}
