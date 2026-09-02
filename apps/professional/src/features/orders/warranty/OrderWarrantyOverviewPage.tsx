"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { orderBreadcrumbs } from "@/features/orders/data/orderNav.config";
import localizationConstants from "@/utils/translation/constants";
import { WarrantyOverviewTable } from "./components/WarrantyOverviewTable";
import { useWarranty } from "./hooks/useWarranty";

export function OrderWarrantyOverviewPage() {
	const {
		paginatedRows,
		selectedIds,
		toggleSelectAll,
		toggleSelectRow,
		sortField,
		sortOrder,
		handleSort,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		totalPages,
		totalRows,
	} = useWarranty();

	return (
		<div className="flex flex-1 flex-col bg-slate-50/50">
			{/* Page Title with Breadcrumbs directly below it */}
			<PageHeader
				title={localizationConstants.warrantyCommitments}
				breadcrumbs={orderBreadcrumbs(localizationConstants.warrantyCommitments)}
				className="border-b-0 px-6 pt-5 pb-2"
			/>

			{/* Overview Datatable */}
			<WarrantyOverviewTable
				rows={paginatedRows}
				selectedIds={selectedIds}
				onToggleSelectAll={toggleSelectAll}
				onToggleSelectRow={toggleSelectRow}
				sortField={sortField}
				sortOrder={sortOrder}
				onSort={handleSort}
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
				statusFilter={statusFilter}
				onStatusFilterChange={setStatusFilter}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				pageSize={pageSize}
				setPageSize={setPageSize}
				totalPages={totalPages}
				totalRows={totalRows}
			/>
		</div>
	);
}
