"use client";

import { useMemo } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { FileSpreadsheet, FileText, Scale } from "lucide-react";
import {
	REPORT_TAB_ACTIVE_CLASS,
	REPORT_TAB_INACTIVE_CLASS,
} from "../../constants/financialReports.constants";
import { useFinancialReports } from "../../hooks/useFinancialReports";
import { ReportSummaryCards } from "./ReportSummaryCards";
import { ReportPeriodSelector } from "./ReportPeriodSelector";
import { ReportExportActions } from "./ReportExportActions";
import { IncomeStatementReport } from "./IncomeStatementReport";
import { BalanceSheetReport } from "./BalanceSheetReport";
import { VatReport } from "./VatReport";
import { ReportsListTable } from "./ReportsListTable";

export function FinancialReportsPage() {
	const {
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
	} = useFinancialReports();

	const breadcrumbs = useMemo(
		() => [
			{ label: localizationConstants.home, href: "/" },
			{ label: localizationConstants.module, href: "/module" },
			{ label: localizationConstants.economy, href: "/module/financial-management/economy" },
			{
				label: localizationConstants.financialReportsBreadcrumb,
				href: "/module/financial-management/economy/reports",
			},
		],
		[]
	);

	return (
		<div className="flex flex-1 flex-col bg-slate-50/50 min-h-screen">
			{/* Top Page Header */}
			<PageHeader
				title={localizationConstants.financialReportsTitle}
				breadcrumbs={breadcrumbs}
				className="border-b-0 px-8 pt-6 pb-2"
			/>

			{/* Top Category Tabs matching Figma: Resultaträkning | Balansräkning | Momsrapport */}
			<div className="px-8 border-b border-slate-200 bg-white">
				<div className="flex items-center gap-8">
					<button
						type="button"
						onClick={() => handleTabChange("income_statement")}
						className={
							activeTab === "income_statement"
								? REPORT_TAB_ACTIVE_CLASS
								: REPORT_TAB_INACTIVE_CLASS
						}
					>
						<FileText className="w-4 h-4" />
						<Translate text={localizationConstants.reportTabIncomeStatement} />
					</button>

					<button
						type="button"
						onClick={() => handleTabChange("balance_sheet")}
						className={
							activeTab === "balance_sheet"
								? REPORT_TAB_ACTIVE_CLASS
								: REPORT_TAB_INACTIVE_CLASS
						}
					>
						<Scale className="w-4 h-4" />
						<Translate text={localizationConstants.reportTabBalanceSheet} />
					</button>

					<button
						type="button"
						onClick={() => handleTabChange("vat_report")}
						className={
							activeTab === "vat_report"
								? REPORT_TAB_ACTIVE_CLASS
								: REPORT_TAB_INACTIVE_CLASS
						}
					>
						<FileSpreadsheet className="w-4 h-4" />
						<Translate text={localizationConstants.reportTabVatReport} />
					</button>
				</div>
			</div>

			{/* Main Content Area */}
			<div className="px-8 py-6 flex-1 max-w-7xl mx-auto w-full space-y-6">
				{/* Top Controls: Period Selector & Export Actions */}
				<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
					<ReportPeriodSelector
						periodFilter={periodFilter}
						onPeriodTypeChange={handlePeriodTypeChange}
						onYearChange={handleYearChange}
						onMonthChange={handleMonthChange}
						onQuarterChange={handleQuarterChange}
					/>

					<ReportExportActions
						onExportExcel={handleExportExcel}
						onPrint={handlePrint}
						isExporting={isExporting}
					/>
				</div>

				{/* Quick Financial Summary KPI Cards */}
				<ReportSummaryCards kpiSummary={kpiSummary} activeTab={activeTab} />

				{/* Report View Area with Loading State */}
				{isLoading ? (
					<div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
						<div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mb-3" />
						<p className="text-sm font-semibold text-slate-600">
							<Translate text={localizationConstants.reportLoading} />
						</p>
					</div>
				) : (
					<div className="space-y-6">
						{activeTab === "income_statement" && (
							<IncomeStatementReport data={incomeStatementData} />
						)}

						{activeTab === "balance_sheet" && (
							<BalanceSheetReport data={balanceSheetData} />
						)}

						{activeTab === "vat_report" && (
							<VatReport data={vatReportData} />
						)}

						{/* Document History / Generated Report Downloads matching Figma left board */}
						<ReportsListTable
							reports={reportList}
							onDownload={handleExportExcel}
							onPrint={handlePrint}
						/>
					</div>
				)}
			</div>
		</div>
	);
}

export default FinancialReportsPage;
