"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import localizationConstants from "@/utils/translation/constants";
import { financialReportsBreadcrumbs } from "../../constants/financialReports.constants";
import { useFinancialReports } from "../../hooks/useFinancialReports";
import { FinancialReportsHubView } from "./FinancialReportsHubView";
import { FinancialReportsDetailView } from "./FinancialReportsDetailView";
import { CreateReportModal } from "./CreateReportModal";

export function FinancialReportsPage() {
	const {
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
	} = useFinancialReports();

	return (
		<div className="flex flex-1 flex-col bg-slate-50/50 min-h-screen">
			{/* Top Page Header */}
			<PageHeader
				title={localizationConstants.financialReportsTitle}
				breadcrumbs={financialReportsBreadcrumbs}
				className="border-b-0 px-8 pt-6 pb-2"
			/>

			{/* Main Content Area */}
			<div className="px-8 py-6 flex-1 max-w-7xl mx-auto w-full">
				{viewMode === "hub" ? (
					<FinancialReportsHubView
						activeMainTab={activeMainTab}
						searchQuery={searchQuery}
						reportList={reportList}
						kpiSummary={kpiSummary}
						onMainTabChange={handleMainTabChange}
						onSearchChange={handleSearchChange}
						onOpenCreateModal={handleOpenCreateModal}
						onViewReport={handleViewReport}
						onDownload={handleExportExcel}
						onPrint={handlePrint}
					/>
				) : (
					<FinancialReportsDetailView
						activeTab={activeDetailTab}
						periodFilter={periodFilter}
						isLoading={isLoading}
						isExporting={isExporting}
						kpiSummary={kpiSummary}
						incomeStatementData={incomeStatementData}
						balanceSheetData={balanceSheetData}
						vatReportData={vatReportData}
						onBackToHub={handleBackToHub}
						onTabChange={handleDetailTabChange}
						onPeriodTypeChange={handlePeriodTypeChange}
						onYearChange={handleYearChange}
						onMonthChange={handleMonthChange}
						onQuarterChange={handleQuarterChange}
						onExportExcel={handleExportExcel}
						onPrint={handlePrint}
					/>
				)}
			</div>

			{/* Modal for Creating Custom Reports */}
			<CreateReportModal
				isOpen={isCreateModalOpen}
				onClose={handleCloseCreateModal}
				onCreate={handleCreateReport}
			/>
		</div>
	);
}

export default FinancialReportsPage;
