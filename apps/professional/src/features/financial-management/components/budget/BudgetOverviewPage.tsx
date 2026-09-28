"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import localizationConstants from "@/utils/translation/constants";
import { budgetRoutes } from "../../constants/budget.constants";
import { useBudgets } from "../../hooks/useBudgets";
import type { EconomyBudgetItem } from "../../types/budget.types";
import { EconomySubTabs } from "../common/EconomySubTabs";
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

	const tabs = [{ id: "budgetlista", labelKey: localizationConstants.tabBudgetList }];

	return (
		<div className="p-6 w-full space-y-6">
			{/* Sub-navigation Tabs: Budgetlista */}
			<EconomySubTabs
				tabs={tabs}
				activeTab="budgetlista"
				onTabChange={() => {}}
			/>

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
