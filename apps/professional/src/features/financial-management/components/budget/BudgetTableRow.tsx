"use client";

import React from "react";
import { Star, Eye, MoreVertical, Edit2, CheckCircle, Ban, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { EconomyBudgetItem } from "../../types/budget.types";

interface BudgetTableRowProps {
	item: EconomyBudgetItem;
	isSelected: boolean;
	onToggleSelect: (id: string) => void;
	onToggleFavorite: (id: string) => void;
	onToggleStatus: (id: string) => void;
	onView: (item: EconomyBudgetItem) => void;
	onEdit: (item: EconomyBudgetItem) => void;
	onDelete: (item: EconomyBudgetItem) => void;
}

export function BudgetTableRow({
	item,
	isSelected,
	onToggleSelect,
	onToggleFavorite,
	onToggleStatus,
	onView,
	onEdit,
	onDelete,
}: BudgetTableRowProps) {
	const formatCurrency = (val: number) => {
		return val.toLocaleString("sv-SE");
	};

	return (
		<tr
			className={`border-b border-slate-100 hover:bg-slate-50/70 transition-colors ${
				isSelected ? "bg-slate-50/90" : ""
			}`}
		>
			{/* Star Favorite */}
			<td className="w-10 px-3 py-3.5 text-center">
				<button
					type="button"
					onClick={() => onToggleFavorite(item.id)}
					className="text-slate-300 hover:text-amber-400 focus:outline-hidden transition-colors cursor-pointer"
					aria-label={
						item.isFavorite
							? localizationConstants.ariaUnfavoriteBudget
							: localizationConstants.ariaFavoriteBudget
					}
				>
					<Star
						className={`w-4 h-4 ${
							item.isFavorite
								? "fill-amber-400 text-amber-400"
								: "text-slate-300 hover:text-amber-400"
						}`}
					/>
				</button>
			</td>

			{/* Checkbox */}
			<td className="w-10 px-2 py-3.5 text-center">
				<Checkbox
					checked={isSelected}
					onCheckedChange={() => onToggleSelect(item.id)}
					aria-label={`${localizationConstants.ariaSelectRow} ${item.budgetnr}`}
					className="cursor-pointer"
				/>
			</td>

			{/* Budget nr */}
			<td className="px-4 py-3.5 text-sm font-medium text-slate-900 whitespace-nowrap">
				{item.budgetnr}
			</td>

			{/* Budget name */}
			<td className="px-4 py-3.5 text-sm text-slate-800 font-medium whitespace-nowrap">
				<button
					type="button"
					onClick={() => onView(item)}
					className="hover:underline text-left cursor-pointer hover:text-slate-900"
				>
					{item.budgetName}
				</button>
			</td>

			{/* Datum */}
			<td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">
				{item.datum}
			</td>

			{/* Total kostnad */}
			<td className="px-4 py-3.5 text-sm text-slate-800 font-medium whitespace-nowrap">
				{formatCurrency(item.totalKostnad)}
			</td>

			{/* Total inkomst */}
			<td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">
				{item.totalInkomst ? formatCurrency(item.totalInkomst) : "info"}
			</td>

			{/* Actions */}
			<td className="px-4 py-3.5 text-right whitespace-nowrap">
				<div className="flex items-center justify-end gap-1">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={() => onView(item)}
						className="h-8 w-8 text-slate-400 hover:text-slate-800 cursor-pointer"
						aria-label={localizationConstants.ariaViewBudgetDetails}
					>
						<Eye className="w-4 h-4" />
					</Button>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="h-8 w-8 text-slate-400 hover:text-slate-800 cursor-pointer"
								aria-label={localizationConstants.actionsAriaLabel}
							>
								<MoreVertical className="w-4 h-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-40">
							<DropdownMenuItem
								onClick={() => onEdit(item)}
								className="gap-2 cursor-pointer text-slate-700"
							>
								<Edit2 className="w-3.5 h-3.5 text-slate-500" />
								<Translate text={localizationConstants.btnEditBudget} />
							</DropdownMenuItem>

							<DropdownMenuItem
								onClick={() => onToggleStatus(item.id)}
								className="gap-2 cursor-pointer text-slate-700"
							>
								{item.status === "active" ? (
									<>
										<Ban className="w-3.5 h-3.5 text-slate-500" />
										<Translate text={localizationConstants.btnDeactivateBudget} />
									</>
								) : (
									<>
										<CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
										<Translate text={localizationConstants.btnActivateBudget} />
									</>
								)}
							</DropdownMenuItem>

							<DropdownMenuSeparator />

							<DropdownMenuItem
								onClick={() => onDelete(item)}
								className="gap-2 cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50"
							>
								<Trash2 className="w-3.5 h-3.5" />
								<Translate text={localizationConstants.btnDeleteBudget} />
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</td>
		</tr>
	);
}
