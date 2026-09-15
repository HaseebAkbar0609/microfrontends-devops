"use client";

import React from "react";
import { useYearEnd } from "../../hooks/useYearEnd";
import { YearEndHeader } from "./YearEndHeader";
import { YearEndToolbar } from "./YearEndToolbar";
import { YearEndYearSelector } from "./YearEndYearSelector";
import { YearEndTable } from "./YearEndTable";
import { YearEndPagination } from "./YearEndPagination";
import { AddYearEndItemModal } from "./AddYearEndItemModal";
import { YearEndDetailModal } from "./YearEndDetailModal";
import { YearEndDeleteDialog } from "./YearEndDeleteDialog";
import type { YearEndTabType } from "../../types/yearEnd.types";

interface YearEndOverviewPageProps {
	initialTab?: YearEndTabType;
}

export function YearEndOverviewPage({
	initialTab = "bokslut",
}: YearEndOverviewPageProps) {
	const {
		activeTab,
		setActiveTab,
		selectedYear,
		setSelectedYear,
		searchQuery,
		setSearchQuery,
		categoryFilter,
		setCategoryFilter,
		sortBy,
		sortOrder,
		handleSort,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		totalPages,
		totalCount,
		items,
		// Modals
		isAddModalOpen,
		setIsAddModalOpen,
		itemToEdit,
		setItemToEdit,
		itemToView,
		setItemToView,
		itemToDelete,
		setItemToDelete,
		// Actions
		createItem,
		updateItem,
		deleteItem,
	} = useYearEnd({ initialTab });

	return (
		<div className="flex flex-1 flex-col bg-white px-6 pt-5 pb-8 min-h-screen space-y-4">
			{/* Header with Breadcrumbs & Tabs */}
			<YearEndHeader activeTab={activeTab} onTabChange={setActiveTab} />

			{/* Search, Filter & Add New */}
			<YearEndToolbar
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
				categoryFilter={categoryFilter}
				onCategoryFilterChange={setCategoryFilter}
				onCreateClick={() => {
					setItemToEdit(null);
					setIsAddModalOpen(true);
				}}
			/>

			{/* Year Selector */}
			<YearEndYearSelector
				selectedYear={selectedYear}
				onYearChange={setSelectedYear}
			/>

			{/* Main Data Table */}
			<YearEndTable
				items={items}
				totalCount={totalCount}
				sortBy={sortBy}
				sortOrder={sortOrder}
				onSort={handleSort}
				onView={(item) => setItemToView(item)}
				onEdit={(item) => {
					setItemToEdit(item);
					setIsAddModalOpen(true);
				}}
				onDelete={(item) => setItemToDelete(item)}
				onCreateClick={() => {
					setItemToEdit(null);
					setIsAddModalOpen(true);
				}}
			/>

			{/* Bottom Pagination */}
			<YearEndPagination
				currentPage={currentPage}
				totalPages={totalPages}
				pageSize={pageSize}
				onPageChange={setCurrentPage}
				onPageSizeChange={setPageSize}
			/>

			{/* Add / Edit Modal */}
			<AddYearEndItemModal
				isOpen={isAddModalOpen}
				onClose={() => {
					setIsAddModalOpen(false);
					setItemToEdit(null);
				}}
				onSave={(data) => {
					if (itemToEdit) {
						updateItem(itemToEdit.id, data);
					} else {
						createItem(data);
					}
				}}
				editingItem={itemToEdit}
				activeTab={activeTab}
				selectedYear={selectedYear}
			/>

			{/* Detail Modal */}
			<YearEndDetailModal
				item={itemToView}
				isOpen={itemToView !== null}
				onClose={() => setItemToView(null)}
				onEdit={(item) => {
					setItemToEdit(item);
					setIsAddModalOpen(true);
				}}
			/>

			{/* Delete Confirmation Dialog */}
			<YearEndDeleteDialog
				item={itemToDelete}
				isOpen={itemToDelete !== null}
				onClose={() => setItemToDelete(null)}
				onConfirm={(id) => deleteItem(id)}
			/>
		</div>
	);
}

export default YearEndOverviewPage;
