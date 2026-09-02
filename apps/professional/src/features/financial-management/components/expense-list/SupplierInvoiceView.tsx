"use client";

import React, { useState } from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useExpenseList, ExpenseActiveSubTab } from "../../hooks/useExpenseList";
import {
	EXPENSE_SUB_TAB_CONTAINER_CLASS,
	EXPENSE_SUB_TAB_ACTIVE_CLASS,
	EXPENSE_SUB_TAB_INACTIVE_CLASS,
} from "../../constants/expense.constants";
import { ExpenseToolbar } from "./ExpenseToolbar";
import { ExpenseListTable } from "./ExpenseListTable";

export function SupplierInvoiceView() {
	const [activeSubTab, setActiveSubTab] = useState<ExpenseActiveSubTab>("supplier_list");

	const {
		expenses,
		totalCount,
		availableProjects,
		selectedExpenseIds,
		toggleSelectExpense,
		toggleSelectAll,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		categoryFilter,
		setCategoryFilter,
		projectFilter,
		setProjectFilter,
		sortField,
		sortOrder,
		handleSort,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		totalPages,
		confirmDeleteId,
		setConfirmDeleteId,
		executeDelete,
	} = useExpenseList(activeSubTab);

	return (
		<>
			{/* Sub-tabs: Leverantörs lista / Inbox */}
			<div className="mb-4">
				<div className={EXPENSE_SUB_TAB_CONTAINER_CLASS}>
					<button
						type="button"
						onClick={() => {
							setActiveSubTab("supplier_list");
							setCurrentPage(1);
						}}
						className={
							activeSubTab === "supplier_list"
								? EXPENSE_SUB_TAB_ACTIVE_CLASS
								: EXPENSE_SUB_TAB_INACTIVE_CLASS
						}
					>
						<Translate text={localizationConstants.expenseSubTabSupplierList} />
					</button>
					<button
						type="button"
						onClick={() => {
							setActiveSubTab("inbox");
							setCurrentPage(1);
						}}
						className={
							activeSubTab === "inbox"
								? EXPENSE_SUB_TAB_ACTIVE_CLASS
								: EXPENSE_SUB_TAB_INACTIVE_CLASS
						}
					>
						<Translate text={localizationConstants.expenseSubTabInbox} />
					</button>
				</div>
			</div>

			{/* Search & Filters Toolbar */}
			<ExpenseToolbar
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
				statusFilter={statusFilter}
				onStatusFilterChange={setStatusFilter}
				categoryFilter={categoryFilter}
				onCategoryFilterChange={setCategoryFilter}
				projectFilter={projectFilter}
				onProjectFilterChange={setProjectFilter}
				availableProjects={availableProjects}
			/>

			{/* Expense List Table matching Figma 1:1 */}
			<ExpenseListTable
				expenses={expenses}
				totalCount={totalCount}
				selectedIds={selectedExpenseIds}
				onToggleSelect={toggleSelectExpense}
				onToggleSelectAll={toggleSelectAll}
				sortField={sortField}
				sortOrder={sortOrder}
				onSort={handleSort}
				currentPage={currentPage}
				pageSize={pageSize}
				onPageSizeChange={setPageSize}
				totalPages={totalPages}
				onPageChange={setCurrentPage}
				onDelete={(id) => setConfirmDeleteId(id)}
			/>

			{/* UX Confirmation Dialog: Delete (Standard #5) */}
			<Dialog
				open={confirmDeleteId !== null}
				onOpenChange={(open) => {
					if (!open) setConfirmDeleteId(null);
				}}
			>
				<DialogContent className="max-w-md bg-white p-6 rounded-xl shadow-2xl">
					<DialogHeader>
						<DialogTitle className="text-base font-bold text-slate-900">
							<Translate text={localizationConstants.expenseConfirmDeleteTitle} />
						</DialogTitle>
						<DialogDescription className="text-xs text-slate-600 mt-2">
							<Translate text={localizationConstants.expenseConfirmDeleteDesc} />
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="mt-4 flex justify-end gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setConfirmDeleteId(null)}
							className="text-xs border-slate-200 cursor-pointer"
						>
							<Translate text={localizationConstants.createInvoiceBtnCancel} />
						</Button>
						<Button
							size="sm"
							onClick={executeDelete}
							className="text-xs bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
						>
							<Translate text={localizationConstants.expenseActionDelete} />
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}

export default SupplierInvoiceView;
