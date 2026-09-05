"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { FileText, Scale, FileSpreadsheet } from "lucide-react";
import {
	REPORT_TAB_ACTIVE_CLASS,
	REPORT_TAB_INACTIVE_CLASS,
	financialReportsBreadcrumbs,
} from "../../constants/financialReports.constants";
import { useFinancialReports } from "../../hooks/useFinancialReports";
import { ReportPeriodSelector } from "./ReportPeriodSelector";
import { ReportExportActions } from "./ReportExportActions";
import { ReportSummaryCards } from "./ReportSummaryCards";
import { IncomeStatementReport } from "./IncomeStatementReport";
import { BalanceSheetReport } from "./BalanceSheetReport";
import { VatReport } from "./VatReport";
import { TransactionDetailDrawer } from "./TransactionDetailDrawer";

export function FinancialReportsPage() {
	const {
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
	} = useFinancialReports();

	return (
		<div className="flex flex-1 flex-col bg-slate-50/50 min-h-screen">
			{/* Top Page Header with Breadcrumbs */}
			<PageHeader
				title={localizationConstants.financialReportsTitle}
				breadcrumbs={financialReportsBreadcrumbs}
				className="border-b-0 px-4 sm:px-8 pt-6 pb-2"
			/>

			{/* Main Content Area */}
			<div className="px-4 sm:px-8 py-4 flex-1 max-w-7xl mx-auto w-full space-y-6">
				{/* 1. Primary Report Statement Tab Navigation */}
				<div className="flex items-center gap-2 sm:gap-4 border-b border-slate-200 overflow-x-auto pb-0">
					<button
						type="button"
						onClick={() => handleTabChange("income_statement")}
						className={activeTab === "income_statement" ? REPORT_TAB_ACTIVE_CLASS : REPORT_TAB_INACTIVE_CLASS}
					>
						<FileText className="w-4 h-4 shrink-0" />
						<Translate text={localizationConstants.reportTabIncomeStatement} />
					</button>

					<button
						type="button"
						onClick={() => handleTabChange("balance_sheet")}
						className={activeTab === "balance_sheet" ? REPORT_TAB_ACTIVE_CLASS : REPORT_TAB_INACTIVE_CLASS}
					>
						<Scale className="w-4 h-4 shrink-0" />
						<Translate text={localizationConstants.reportTabBalanceSheet} />
					</button>

					<button
						type="button"
						onClick={() => handleTabChange("vat_report")}
						className={activeTab === "vat_report" ? REPORT_TAB_ACTIVE_CLASS : REPORT_TAB_INACTIVE_CLASS}
					>
						<FileSpreadsheet className="w-4 h-4 shrink-0" />
						<Translate text={localizationConstants.reportTabVatReport} />
					</button>
				</div>

				{/* 2. Controls Row: Period Selector & Export Actions */}
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

				{/* 3. Summary KPI Overview Cards */}
				<ReportSummaryCards
					kpiSummary={kpiSummary}
					activeTab={activeTab}
					vatReportData={vatReportData}
				/>

				{/* 4. Active Financial Report Statement */}
				{isLoading ? (
					<div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
						<div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mb-3" />
						<p className="text-sm font-semibold text-slate-600">
							<Translate text={localizationConstants.reportLoading} />
						</p>
					</div>
				) : (
					<div>
						{activeTab === "income_statement" && (
							<IncomeStatementReport
								data={incomeStatementData}
								onAccountClick={handleAccountClick}
							/>
						)}
						{activeTab === "balance_sheet" && (
							<BalanceSheetReport
								data={balanceSheetData}
								onAccountClick={handleAccountClick}
							/>
						)}
						{activeTab === "vat_report" && (
							<VatReport
								data={vatReportData}
								onVatBoxClick={handleVatBoxClick}
							/>
						)}
					</div>
				)}
			</div>

			{/* Slide-over Transaction Drilldown Drawer */}
			<TransactionDetailDrawer
				isOpen={isDrawerOpen}
				target={drilldownTarget}
				periodLabel={periodLabel}
				transactions={drilldownTransactions}
				onClose={handleCloseDrawer}
			/>
		</div>
	);
}

export default FinancialReportsPage;
