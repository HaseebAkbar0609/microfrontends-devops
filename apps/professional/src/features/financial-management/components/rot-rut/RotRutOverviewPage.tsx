"use client";

import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import localizationConstants from "@/utils/translation/constants";
import { rotRutBreadcrumbs } from "../../constants/rotRut.constants";
import { useRotRut } from "../../hooks/useRotRut";
import { RotRutSummaryCards } from "./RotRutSummaryCards";
import { RotRutRulesCard } from "./RotRutRulesCard";
import { RotRutToolbar } from "./RotRutToolbar";
import { RotRutTable } from "./RotRutTable";
import { RotRutDetailModal } from "./RotRutDetailModal";
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
		toggleSelect,
		toggleSelectAll,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		totalPages,
		detailItem,
		setDetailItem,
		isSubmitDialogOpen,
		setIsSubmitDialogOpen,
		handleBatchSubmit,
		executeBatchSubmit,
		handleResubmit,
		handleExportExcel,
		handlePrint,
	} = useRotRut();

	const selectedAmount = React.useMemo(() => {
		return items
			.filter((i) => selectedIds.has(i.id))
			.reduce((acc, curr) => acc + curr.deductionAmount, 0);
	}, [items, selectedIds]);

	return (
		<div className="flex flex-1 flex-col bg-slate-50/50 min-h-screen">
			{/* Top Page Header with Breadcrumbs */}
			<PageHeader
				title={localizationConstants.rotRutTitle}
				breadcrumbs={rotRutBreadcrumbs}
				className="border-b-0 px-8 pt-6 pb-2"
			/>

			{/* Main Content Area */}
			<div className="px-8 py-4 flex-1 max-w-7xl mx-auto w-full">
				{/* 1. Summary KPI Cards */}
				<RotRutSummaryCards summary={kpiSummary} />

				{/* 2. Rules & Customer Quotas Display */}
				<RotRutRulesCard customerLimits={customerLimits} />

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
					onSubmitSelected={handleBatchSubmit}
					onExportExcel={handleExportExcel}
					onPrint={handlePrint}
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
					onViewDetails={(item) => setDetailItem(item)}
					onSubmitSingle={(id) => {
						toggleSelect(id);
						setIsSubmitDialogOpen(true);
					}}
					customerLimits={customerLimits}
				/>
			</div>

			{/* Modal: View Details & Resubmit */}
			<RotRutDetailModal
				item={detailItem}
				isOpen={detailItem !== null}
				onClose={() => setDetailItem(null)}
				onResubmit={handleResubmit}
			/>

			{/* Dialog: Batch Submit to Skatteverket */}
			<RotRutSubmitDialog
				isOpen={isSubmitDialogOpen}
				onClose={() => setIsSubmitDialogOpen(false)}
				onConfirm={executeBatchSubmit}
				selectedCount={selectedIds.size}
				totalAmount={selectedAmount}
			/>
		</div>
	);
}

export default RotRutOverviewPage;
