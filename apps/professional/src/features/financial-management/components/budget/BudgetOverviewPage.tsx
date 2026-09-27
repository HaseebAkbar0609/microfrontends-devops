"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { budgetRoutes } from "../../constants/budget.constants";
import { useBudgets } from "../../hooks/useBudgets";
import type { EconomyBudgetItem } from "../../types/budget.types";
import { BudgetBulkActionBar } from "./BudgetBulkActionBar";
import { BudgetDeleteDialog } from "./BudgetDeleteDialog";
import { BudgetTable } from "./BudgetTable";
import { BudgetToolbar } from "./BudgetToolbar";

export interface BudgetOverviewPageProps {
	/** Which module the register is mounted in; every link is built from it. */
	basePath?: string;
}

export function BudgetOverviewPage({ basePath }: BudgetOverviewPageProps) {
	const router = useRouter();
	const routes = budgetRoutes(basePath);
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

	const handleView = (item: EconomyBudgetItem) => router.push(routes.detail(item.id));
	const handleEdit = (item: EconomyBudgetItem) => router.push(routes.edit(item.id));
	const handleCreate = () => router.push(routes.create);

	return (
		<div className="flex min-h-screen min-w-0 flex-1 flex-col bg-slate-50/50 px-6 pt-4 pb-8">
			{/* Sub-navigation Tabs: Budgetlista */}
			<div className="mb-5 flex items-center gap-6 border-b border-slate-200">
				<button
					type="button"
					className="cursor-pointer border-b-2 border-slate-900 pb-3 text-sm font-semibold text-slate-900"
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
