"use client";

import React from "react";
import { useRotRut } from "../../hooks/useRotRut";
import { RotRutSummaryCards } from "./RotRutSummaryCards";
import { RotRutRulesCard } from "./RotRutRulesCard";
import { RotRutToolbar } from "./RotRutToolbar";
import { RotRutTable } from "./RotRutTable";
import { RotRutResubmitDialog } from "./RotRutResubmitDialog";
import { RotRutSubmitDialog } from "./RotRutSubmitDialog";

export function RotRutOverviewPage() {
	const {
		items,
		totalCount,
		kpiSummary,
		customerLimits,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		typeFilter,
		setTypeFilter,
		periodFilter,
		setPeriodFilter,
		sortBy,
		sortOrder,
		handleSort,
		selectedIds,
		submittableSelectedCount,
		toggleSelect,
		toggleSelectAll,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		totalPages,
		resubmitItem,
		setResubmitItem,
		isSubmitDialogOpen,
		setIsSubmitDialogOpen,
		handleBatchSubmit,
		handleSingleSubmit,
		executeBatchSubmit,
		submitSummary,
		handleResubmit,
		handleExportExcel,
		handlePrint,
		handleResetSeedData,
	} = useRotRut();

	return (
		<div className="flex flex-1 flex-col bg-slate-50/50 px-6 pt-5 pb-8">
			{/* 1. Summary KPI Cards */}
			<RotRutSummaryCards summary={kpiSummary} />

			{/* 2. Rules & Customer Quotas Display */}
			<RotRutRulesCard />

			{/* 3. Actions & Filters Toolbar */}
			<RotRutToolbar
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
				statusFilter={statusFilter}
				onStatusFilterChange={setStatusFilter}
				typeFilter={typeFilter}
				onTypeFilterChange={setTypeFilter}
				periodFilter={periodFilter}
				onPeriodFilterChange={setPeriodFilter}
				selectedCount={selectedIds.size}
				submittableCount={submittableSelectedCount}
				onSubmitSelected={handleBatchSubmit}
				onExportExcel={handleExportExcel}
				onPrint={handlePrint}
				onResetDemoData={handleResetSeedData}
			/>

			{/* 4. Deduction List Table */}
			<RotRutTable
				items={items}
				totalCount={totalCount}
				selectedIds={selectedIds}
				onToggleSelect={toggleSelect}
				onToggleSelectAll={toggleSelectAll}
				sortBy={sortBy}
				sortOrder={sortOrder}
				onSort={handleSort}
				currentPage={currentPage}
				pageSize={pageSize}
				totalPages={totalPages}
				onPageChange={setCurrentPage}
				onPageSizeChange={setPageSize}
				onResubmit={(item) => setResubmitItem(item)}
				onSubmitSingle={handleSingleSubmit}
				customerLimits={customerLimits}
			/>

			{/* Dialog: Resubmit Rejected Deduction */}
			<RotRutResubmitDialog
				item={resubmitItem}
				isOpen={resubmitItem !== null}
				onClose={() => setResubmitItem(null)}
				onResubmit={handleResubmit}
			/>

			{/* Dialog: Batch Submit to Skatteverket */}
			<RotRutSubmitDialog
				isOpen={isSubmitDialogOpen}
				onClose={() => setIsSubmitDialogOpen(false)}
				onConfirm={executeBatchSubmit}
				selectedCount={submitSummary.count}
				totalAmount={submitSummary.amount}
			/>
		</div>
	);
}

export default RotRutOverviewPage;
