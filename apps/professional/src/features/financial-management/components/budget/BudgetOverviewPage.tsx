"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useBudgets } from "../../hooks/useBudgets";
import {
	BUDGETS_BASE_ROUTE,
	CREATE_BUDGET_ROUTE,
} from "../../constants/budget.constants";
import { BudgetToolbar } from "./BudgetToolbar";
import { BudgetTable } from "./BudgetTable";
import { BudgetBulkActionBar } from "./BudgetBulkActionBar";
import { BudgetDeleteDialog } from "./BudgetDeleteDialog";
import type { EconomyBudgetItem } from "../../types/budget.types";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export function BudgetOverviewPage() {
	const router = useRouter();
	const {
		items,
		totalCount,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		totalPages,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		selectedIds,
		toggleSelect,
		toggleSelectAll,
		sortBy,
		sortOrder,
		handleSort,
		deleteBudget,
		toggleFavorite,
		toggleStatus,
		bulkSetStatus,
	} = useBudgets();

	const [budgetToDelete, setBudgetToDelete] = useState<EconomyBudgetItem | null>(null);

	const handleView = (item: EconomyBudgetItem) => {
		router.push(`${BUDGETS_BASE_ROUTE}/${item.id}`);
	};

	const handleEdit = (item: EconomyBudgetItem) => {
		router.push(`${CREATE_BUDGET_ROUTE}?id=${item.id}`);
	};

	const handleCreate = () => {
		router.push(CREATE_BUDGET_ROUTE);
	};

	return (
		<div className="flex flex-1 flex-col bg-slate-50/50 px-6 pt-4 pb-8 min-h-screen">
			{/* Sub-navigation Tabs: Budgetlista */}
			<div className="flex items-center gap-6 border-b border-slate-200 mb-5">
				<button
					type="button"
					className="pb-3 border-b-2 border-slate-900 font-semibold text-sm text-slate-900 cursor-pointer"
				>
					<Translate text={localizationConstants.tabBudgetList} />
				</button>
			</div>

			{/* Toolbar (Search, Filter, Create CTA) */}
			<BudgetToolbar
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
				statusFilter={statusFilter}
				onStatusFilterChange={setStatusFilter}
				onCreateClick={handleCreate}
			/>

			{/* Main Table */}
			<BudgetTable
				items={items}
				totalCount={totalCount}
				currentPage={currentPage}
				pageSize={pageSize}
				totalPages={totalPages}
				selectedIds={selectedIds}
				sortBy={sortBy}
				sortOrder={sortOrder}
				onSort={handleSort}
				onPageChange={setCurrentPage}
				onPageSizeChange={setPageSize}
				onToggleSelect={toggleSelect}
				onToggleSelectAll={toggleSelectAll}
				onToggleFavorite={toggleFavorite}
				onToggleStatus={toggleStatus}
				onView={handleView}
				onEdit={handleEdit}
				onDelete={(item) => setBudgetToDelete(item)}
				onCreateClick={handleCreate}
			/>

			{/* Bulk Actions Bar */}
			<BudgetBulkActionBar
				selectedCount={selectedIds.length}
				onActivate={() => bulkSetStatus(selectedIds, "active")}
				onDeactivate={() => bulkSetStatus(selectedIds, "inactive")}
			/>

			{/* Delete Confirmation Dialog */}
			<BudgetDeleteDialog
				item={budgetToDelete}
				isOpen={budgetToDelete !== null}
				onClose={() => setBudgetToDelete(null)}
				onConfirm={(id) => deleteBudget(id)}
			/>
		</div>
	);
}

export default BudgetOverviewPage;
