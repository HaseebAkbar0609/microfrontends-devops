"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { orderBreadcrumbs } from "@/features/orders/data/orderNav.config";
import localizationConstants from "@/utils/translation/constants";
import { OrderArchiveTable } from "./components/OrderArchiveTable";
import { useOrderArchive } from "./hooks/useOrderArchive";

export function OrderArchivePage() {
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
		categoryFilter,
		setCategoryFilter,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		totalPages,
		totalRows,
		restoreOrder,
		deleteArchivedOrder,
	} = useOrderArchive();

	return (
		<div className="flex flex-1 flex-col bg-slate-50/50">
			{/* Page Title with Breadcrumbs directly below it */}
			<PageHeader
				title={localizationConstants.archive}
				breadcrumbs={orderBreadcrumbs(localizationConstants.archive)}
				className="border-b-0 px-6 pt-5 pb-2"
			/>

			{/* Archive Datatable */}
			<OrderArchiveTable
				rows={paginatedRows}
				selectedIds={selectedIds}
				onToggleSelectAll={toggleSelectAll}
				onToggleSelectRow={toggleSelectRow}
				sortField={sortField}
				sortOrder={sortOrder}
				onSort={handleSort}
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
				categoryFilter={categoryFilter}
				onCategoryFilterChange={setCategoryFilter}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				pageSize={pageSize}
				setPageSize={setPageSize}
				totalPages={totalPages}
				totalRows={totalRows}
				onRestoreOrder={restoreOrder}
				onDeleteOrder={deleteArchivedOrder}
			/>
		</div>
	);
}
