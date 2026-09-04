"use client";

import { ArrowLeft, FileSpreadsheet, FileText, Scale } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	REPORT_TAB_ACTIVE_CLASS,
	REPORT_TAB_INACTIVE_CLASS,
} from "../../constants/financialReports.constants";
import type {
	BalanceSheetData,
	IncomeStatementData,
	ReportKpiSummary,
	ReportPeriodFilter,
	ReportPeriodType,
	ReportTabType,
	VatReportData,
} from "../../types/financialReports.types";
import { ReportPeriodSelector } from "./ReportPeriodSelector";
import { ReportExportActions } from "./ReportExportActions";
import { ReportSummaryCards } from "./ReportSummaryCards";
import { IncomeStatementReport } from "./IncomeStatementReport";
import { BalanceSheetReport } from "./BalanceSheetReport";
import { VatReport } from "./VatReport";

interface FinancialReportsDetailViewProps {
	activeTab: ReportTabType;
	periodFilter: ReportPeriodFilter;
	isLoading: boolean;
	isExporting: boolean;
	kpiSummary: ReportKpiSummary;
	incomeStatementData: IncomeStatementData;
	balanceSheetData: BalanceSheetData;
	vatReportData: VatReportData;
	onBackToHub: () => void;
	onTabChange: (tab: ReportTabType) => void;
	onPeriodTypeChange: (periodType: ReportPeriodType) => void;
	onYearChange: (year: number) => void;
	onMonthChange: (month: number) => void;
	onQuarterChange: (quarter: number) => void;
	onExportExcel: () => void;
	onPrint: () => void;
}

export function FinancialReportsDetailView({
	activeTab,
	periodFilter,
	isLoading,
	isExporting,
	kpiSummary,
	incomeStatementData,
	balanceSheetData,
	vatReportData,
	onBackToHub,
	onTabChange,
	onPeriodTypeChange,
	onYearChange,
	onMonthChange,
	onQuarterChange,
	onExportExcel,
	onPrint,
}: FinancialReportsDetailViewProps) {
	return (
		<div className="space-y-6">
			{/* Top Navigation: Back to Hub & Statement Tabs */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-2">
				<div className="flex items-center gap-6">
					<button
						type="button"
						onClick={onBackToHub}
						className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
					>
						<ArrowLeft className="w-4 h-4" />
						<Translate text={localizationConstants.reportBackToList} />
					</button>

					<div className="h-5 w-px bg-slate-200 hidden md:block" />

					{/* Statement Tabs */}
					<div className="flex items-center gap-4">
						<button
							type="button"
							onClick={() => onTabChange("income_statement")}
							className={activeTab === "income_statement" ? REPORT_TAB_ACTIVE_CLASS : REPORT_TAB_INACTIVE_CLASS}
						>
							<FileText className="w-4 h-4" />
							<Translate text={localizationConstants.reportTabIncomeStatement} />
						</button>

						<button
							type="button"
							onClick={() => onTabChange("balance_sheet")}
							className={activeTab === "balance_sheet" ? REPORT_TAB_ACTIVE_CLASS : REPORT_TAB_INACTIVE_CLASS}
						>
							<Scale className="w-4 h-4" />
							<Translate text={localizationConstants.reportTabBalanceSheet} />
						</button>

						<button
							type="button"
							onClick={() => onTabChange("vat_report")}
							className={activeTab === "vat_report" ? REPORT_TAB_ACTIVE_CLASS : REPORT_TAB_INACTIVE_CLASS}
						>
							<FileSpreadsheet className="w-4 h-4" />
							<Translate text={localizationConstants.reportTabVatReport} />
						</button>
					</div>
				</div>
			</div>

			{/* Controls Row: Period Selector & Export Actions */}
			<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
				<ReportPeriodSelector
					periodFilter={periodFilter}
					onPeriodTypeChange={onPeriodTypeChange}
					onYearChange={onYearChange}
					onMonthChange={onMonthChange}
					onQuarterChange={onQuarterChange}
				/>

				<ReportExportActions
					onExportExcel={onExportExcel}
					onPrint={onPrint}
					isExporting={isExporting}
				/>
			</div>

			{/* KPI Summary Cards */}
			<ReportSummaryCards kpiSummary={kpiSummary} activeTab={activeTab} />

			{/* Active Report Statement */}
			{isLoading ? (
				<div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
					<div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mb-3" />
					<p className="text-sm font-semibold text-slate-600">
						<Translate text={localizationConstants.reportLoading} />
					</p>
				</div>
			) : (
				<div>
					{activeTab === "income_statement" && (
						<IncomeStatementReport data={incomeStatementData} />
					)}
					{activeTab === "balance_sheet" && (
						<BalanceSheetReport data={balanceSheetData} />
					)}
					{activeTab === "vat_report" && (
						<VatReport data={vatReportData} />
					)}
				</div>
			)}
		</div>
	);
}
