"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { FileText, Scale, FileSpreadsheet } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { financialReportsBreadcrumbs } from "../../constants/financialReports.constants";

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
				className="border-b-0 px-6 pt-5 pb-2"
			/>

			{/* Main Content Area */}
			<div className="flex flex-1 flex-col px-6 pt-2 pb-8 overflow-y-auto space-y-6">
				{/* 1. Primary Report Statement Tab Navigation */}
				<Tabs
					value={activeTab}
					onValueChange={(val) => handleTabChange(val as "income_statement" | "balance_sheet" | "vat_report")}
					className="w-full"
				>
					<div className="flex items-center border-b border-slate-200 mb-2 bg-white px-4 rounded-t-lg h-[44px]">
						<TabsList variant="line" className="h-[36px]">
							<TabsTrigger value="income_statement" className="cursor-pointer gap-2">
								<FileText className="w-4 h-4 shrink-0" />
								<Translate text={localizationConstants.reportTabIncomeStatement} />
							</TabsTrigger>
							<TabsTrigger value="balance_sheet" className="cursor-pointer gap-2">
								<Scale className="w-4 h-4 shrink-0" />
								<Translate text={localizationConstants.reportTabBalanceSheet} />
							</TabsTrigger>
							<TabsTrigger value="vat_report" className="cursor-pointer gap-2">
								<FileSpreadsheet className="w-4 h-4 shrink-0" />
								<Translate text={localizationConstants.reportTabVatReport} />
							</TabsTrigger>
						</TabsList>
					</div>
				</Tabs>


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
