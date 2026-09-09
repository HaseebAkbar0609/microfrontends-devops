"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { orderBreadcrumbs } from "@/features/orders/data/orderNav.config";
import localizationConstants from "@/utils/translation/constants";
import { WarrantyOverviewTable } from "./components/WarrantyOverviewTable";
import { CreateVisitDateModal } from "./components/CreateVisitDateModal";
import { useWarranty } from "./hooks/useWarranty";

export function OrderWarrantyOverviewPage() {
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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
		addInspectionDate,
	} = useWarranty();

	return (
		<div className="flex flex-1 flex-col bg-white">
			{/* Page Title with Breadcrumbs directly below it */}
			<PageHeader
				title={localizationConstants.warrantyCommitments}
				breadcrumbs={orderBreadcrumbs(localizationConstants.warrantyCommitments)}
				className="border-b-0 px-6 pt-6 sm:pt-7 pb-2"
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
				onAddNew={() => setIsAddModalOpen(true)}
			/>

			{/* Modal for adding new entry */}
			<CreateVisitDateModal
				isOpen={isAddModalOpen}
				onClose={() => setIsAddModalOpen(false)}
				onSave={addInspectionDate}
			/>
		</div>
	);
}
