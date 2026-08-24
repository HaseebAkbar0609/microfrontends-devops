"use client";

import { ModulePageHeader } from "@/components/layout/navigation";
import {
	ORDER_MODULE_TABS,
	ORDER_MODULE_TITLE,
	orderBreadcrumbs,
} from "@/features/orders/data/orderNav.config";
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
				<ModulePageHeader
					title={ORDER_MODULE_TITLE}
					tabs={ORDER_MODULE_TABS}
					breadcrumbs={orderBreadcrumbs(localizationConstants.warrantyCommitments)}
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
