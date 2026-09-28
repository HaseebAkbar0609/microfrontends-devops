"use client";

import React from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Checkbox } from "@/components/ui/checkbox";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { BudgetSortField, SortOrder } from "../../types/budget.types";

/** The five sortable columns, in the order the frame draws them. */
const SORTABLE_COLUMNS: { field: BudgetSortField; labelKey: TranslationKeys }[] = [
	{ field: "budgetnr", labelKey: localizationConstants.colBudgetNr },
	{ field: "budgetName", labelKey: localizationConstants.colBudgetName },
	{ field: "datum", labelKey: localizationConstants.colBudgetDate },
	{ field: "totalKostnad", labelKey: localizationConstants.colBudgetTotalCost },
	{ field: "totalInkomst", labelKey: localizationConstants.colBudgetTotalIncome },
];

export interface BudgetTableHeadProps {
	allSelected: boolean;
	someSelected: boolean;
	sortBy: BudgetSortField;
	sortOrder: SortOrder;
	onSort: (field: BudgetSortField) => void;
	onToggleSelectAll: () => void;
}

export function BudgetTableHead({
	allSelected,
	someSelected,
	sortBy,
	sortOrder,
	onSort,
	onToggleSelectAll,
}: BudgetTableHeadProps) {
	const { t } = useTranslation();

	const sortIcon = (field: BudgetSortField) => {
		if (sortBy !== field) return <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />;
		return sortOrder === "asc" ? (
			<ArrowUp className="h-3.5 w-3.5 text-slate-700" />
		) : (
			<ArrowDown className="h-3.5 w-3.5 text-slate-700" />
		);
	};

	return (
		<thead>
			<tr className="border-b border-slate-200 bg-white text-xs font-semibold text-slate-600 select-none">
				<th className="w-10 px-3 py-3 text-center">
					<span className="sr-only">
						<Translate text={localizationConstants.ariaFavoriteBudget} />
					</span>
				</th>

				<th className="w-10 px-2 py-3 text-center">
					<Checkbox
						checked={allSelected ? true : someSelected ? "indeterminate" : false}
						onCheckedChange={onToggleSelectAll}
						aria-label={t(localizationConstants.ariaSelectRow)}
						className="cursor-pointer"
					/>
				</th>

				{SORTABLE_COLUMNS.map(({ field, labelKey }) => (
					<th key={field} className="px-4 py-3">
						<button
							type="button"
							onClick={() => onSort(field)}
							className="flex cursor-pointer items-center gap-1.5 font-semibold hover:text-slate-900"
						>
							<Translate text={labelKey} />
							{sortIcon(field)}
						</button>
					</th>
				))}

				<th className="px-4 py-3 text-right">
					<Translate text={localizationConstants.colBudgetActions} />
				</th>
			</tr>
		</thead>
	);
}

export default BudgetTableHead;
