"use client";

import React from "react";
import { Edit2, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { EconomyBudgetItem } from "../../types/budget.types";

interface BudgetDetailInfoCardProps {
	item: EconomyBudgetItem;
	onEdit: (item: EconomyBudgetItem) => void;
}

export function BudgetDetailInfoCard({
	item,
	onEdit,
}: BudgetDetailInfoCardProps) {
	return (
		<div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
			<div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="p-1.5 bg-slate-100 rounded-md text-slate-700">
						<FileSpreadsheet className="w-4 h-4" />
					</div>
					<h2 className="text-base font-semibold text-slate-900">
						<Translate text={localizationConstants.sectionBudgetInfo} />
					</h2>
				</div>

				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={() => onEdit(item)}
					className="h-8 text-xs text-slate-600 hover:text-slate-900 gap-1.5 cursor-pointer"
				>
					<Edit2 className="w-3.5 h-3.5" />
					<Translate text={localizationConstants.btnEditBudget} />
				</Button>
			</div>

			<div className="p-6">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
					<div>
						<span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
							<Translate text={localizationConstants.fieldBudgetNr} />
						</span>
						<span className="text-sm font-medium text-slate-800">
							{item.budgetnr}
						</span>
					</div>

					<div>
						<span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
							<Translate text={localizationConstants.fieldBudgetName} />
						</span>
						<span className="text-sm font-medium text-slate-800">
							{item.budgetName}
						</span>
					</div>

					<div>
						<span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
							<Translate text={localizationConstants.fieldBudgetComment} />
						</span>
						<span className="text-sm font-medium text-slate-800">
							{item.comment || "—"}
						</span>
					</div>

					<div>
						<span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
							<Translate text={localizationConstants.fieldBudgetTags} />
						</span>
						<span className="text-sm font-medium text-slate-800">
							{item.tags || "—"}
						</span>
					</div>
				</div>

				{item.description && (
					<div className="pt-4 mt-4 border-t border-slate-100">
						<span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
							<Translate text={localizationConstants.fieldBudgetDescription} />
						</span>
						<span className="text-sm text-slate-700">{item.description}</span>
					</div>
				)}
			</div>
		</div>
	);
}
