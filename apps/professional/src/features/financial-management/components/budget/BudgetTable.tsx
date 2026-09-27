"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type {
	EconomyBudgetItem,
	BudgetSortField,
	SortOrder,
} from "../../types/budget.types";
import { BudgetTableHead } from "./BudgetTableHead";
import { BudgetTableRow } from "./BudgetTableRow";
import { BudgetTablePagination } from "./BudgetTablePagination";

interface BudgetTableProps {
	items: EconomyBudgetItem[];
	totalCount: number;
	currentPage: number;
	pageSize: number;
	totalPages: number;
	selectedIds: string[];
	sortBy: BudgetSortField;
	sortOrder: SortOrder;
	onSort: (field: BudgetSortField) => void;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
	onToggleSelect: (id: string) => void;
	onToggleSelectAll: () => void;
	onToggleFavorite: (id: string) => void;
	onToggleStatus: (id: string) => void;
	onView: (item: EconomyBudgetItem) => void;
	onEdit: (item: EconomyBudgetItem) => void;
	onDelete: (item: EconomyBudgetItem) => void;
	onCreateClick: () => void;
}

export function BudgetTable({
	items,
	totalCount,
	currentPage,
	pageSize,
	totalPages,
	selectedIds,
	sortBy,
	sortOrder,
	onSort,
	onPageChange,
	onPageSizeChange,
	onToggleSelect,
	onToggleSelectAll,
	onToggleFavorite,
	onToggleStatus,
	onView,
	onEdit,
	onDelete,
	onCreateClick,
}: BudgetTableProps) {
	const allSelected =
		items.length > 0 && items.every((i) => selectedIds.includes(i.id));
	const someSelected =
		items.some((i) => selectedIds.includes(i.id)) && !allSelected;

	return (
		<div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
			<div className="overflow-x-auto">
				{/* Wider than the viewport on a narrow screen, so the frame’s sideways
				    scroll is real rather than a squeeze. */}
				<table className="w-full min-w-[60rem] border-collapse text-left">
					<BudgetTableHead
						allSelected={allSelected}
						someSelected={someSelected}
						sortBy={sortBy}
						sortOrder={sortOrder}
						onSort={onSort}
						onToggleSelectAll={onToggleSelectAll}
					/>

					<tbody className="divide-y divide-slate-100">
						{items.length === 0 ? (
							<tr>
								<td colSpan={8} className="py-12 text-center text-slate-500">
									<div className="flex flex-col items-center justify-center gap-2">
										<p className="font-semibold text-sm text-slate-700">
											<Translate text={localizationConstants.emptyBudgetsTitle} />
										</p>
										<p className="text-xs text-slate-500 max-w-sm">
											<Translate text={localizationConstants.emptyBudgetsDesc} />
										</p>
										<button
											type="button"
											onClick={onCreateClick}
											className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 underline cursor-pointer"
										>
											<Translate text={localizationConstants.btnCreateBudget} />
										</button>
									</div>
								</td>
							</tr>
						) : (
							items.map((item) => (
								<BudgetTableRow
									key={item.id}
									item={item}
									isSelected={selectedIds.includes(item.id)}
									onToggleSelect={onToggleSelect}
									onToggleFavorite={onToggleFavorite}
									onToggleStatus={onToggleStatus}
									onView={onView}
									onEdit={onEdit}
									onDelete={onDelete}
								/>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			{totalCount > 0 && (
				<BudgetTablePagination
					currentPage={currentPage}
					pageSize={pageSize}
					totalCount={totalCount}
					totalPages={totalPages}
					onPageChange={onPageChange}
					onPageSizeChange={onPageSizeChange}
				/>
			)}
		</div>
	);
}
