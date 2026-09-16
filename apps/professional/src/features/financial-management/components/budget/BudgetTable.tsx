"use client";

import React from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import type {
	EconomyBudgetItem,
	BudgetSortField,
	SortOrder,
} from "../../types/budget.types";
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
	const { t } = useTranslation();
	const allSelected =
		items.length > 0 && items.every((i) => selectedIds.includes(i.id));
	const someSelected =
		items.some((i) => selectedIds.includes(i.id)) && !allSelected;

	const renderSortIcon = (field: BudgetSortField) => {
		if (sortBy !== field) {
			return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />;
		}
		return sortOrder === "asc" ? (
			<ArrowUp className="w-3.5 h-3.5 text-slate-700" />
		) : (
			<ArrowDown className="w-3.5 h-3.5 text-slate-700" />
		);
	};

	return (
		<div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden flex flex-col">
			<div className="overflow-x-auto">
				<table className="w-full border-collapse text-left">
					<thead>
						<tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold text-slate-600 uppercase tracking-wider select-none">
							{/* Star */}
							<th className="w-10 px-3 py-3 text-center">
								<span className="sr-only">Favorit</span>
							</th>

							{/* Select All Checkbox */}
							<th className="w-10 px-2 py-3 text-center">
								<Checkbox
									checked={allSelected ? true : someSelected ? "indeterminate" : false}
									onCheckedChange={onToggleSelectAll}
									aria-label={t(localizationConstants.ariaSelectRow)}
									className="cursor-pointer"
								/>
							</th>

							{/* Budgetnr */}
							<th className="px-4 py-3">
								<button
									type="button"
									onClick={() => onSort("budgetnr")}
									className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer font-semibold"
								>
									<Translate text={localizationConstants.colBudgetNr} />
									{renderSortIcon("budgetnr")}
								</button>
							</th>

							{/* Budget name */}
							<th className="px-4 py-3">
								<button
									type="button"
									onClick={() => onSort("budgetName")}
									className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer font-semibold"
								>
									<Translate text={localizationConstants.colBudgetName} />
									{renderSortIcon("budgetName")}
								</button>
							</th>

							{/* Datum */}
							<th className="px-4 py-3">
								<button
									type="button"
									onClick={() => onSort("datum")}
									className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer font-semibold"
								>
									<Translate text={localizationConstants.colBudgetDate} />
									{renderSortIcon("datum")}
								</button>
							</th>

							{/* Total kostnad */}
							<th className="px-4 py-3">
								<button
									type="button"
									onClick={() => onSort("totalKostnad")}
									className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer font-semibold"
								>
									<Translate text={localizationConstants.colBudgetTotalCost} />
									{renderSortIcon("totalKostnad")}
								</button>
							</th>

							{/* Total inkomst */}
							<th className="px-4 py-3">
								<button
									type="button"
									onClick={() => onSort("totalInkomst")}
									className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer font-semibold"
								>
									<Translate text={localizationConstants.colBudgetTotalIncome} />
									{renderSortIcon("totalInkomst")}
								</button>
							</th>

							{/* Actions */}
							<th className="px-4 py-3 text-right">
								<Translate text={localizationConstants.colBudgetActions} />
							</th>
						</tr>
					</thead>

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
