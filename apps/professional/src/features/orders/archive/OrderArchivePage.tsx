"use client";

import { ModulePageHeader } from "@/components/layout/navigation";
import {
	ORDER_MODULE_TABS,
	ORDER_MODULE_TITLE,
	orderBreadcrumbs,
} from "@/features/orders/data/orderNav.config";
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
			{/* Page Header with Breadcrumbs matching Figma */}
			<ModulePageHeader
				title={ORDER_MODULE_TITLE}
				tabs={ORDER_MODULE_TABS}
				breadcrumbs={orderBreadcrumbs(localizationConstants.archive)}
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
