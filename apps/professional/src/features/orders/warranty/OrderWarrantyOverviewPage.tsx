"use client";

import { PageHeader } from "@/components/layout/PageHeader";
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
			{/* Page Header with Breadcrumbs */}
			<div className="print:hidden">
				<PageHeader
					title={localizationConstants.warrantyCommitments}
					breadcrumbs={[
						{ label: localizationConstants.home, href: "/dashboard" },
						{ label: localizationConstants.production },
						{ label: localizationConstants.orderModule, href: "/module/production/order" },
						{ label: localizationConstants.warrantyCommitments },
					]}
				/>
			</div>

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
