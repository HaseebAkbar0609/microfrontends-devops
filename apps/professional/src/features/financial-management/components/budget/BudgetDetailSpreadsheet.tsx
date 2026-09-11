"use client";

import React, { useMemo } from "react";
import { Edit2, Table } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { MONTH_KEYS } from "../../constants/budget.constants";
import type { EconomyBudgetItem } from "../../types/budget.types";

interface BudgetDetailSpreadsheetProps {
	item: EconomyBudgetItem;
	onEdit: (item: EconomyBudgetItem) => void;
}

export function BudgetDetailSpreadsheet({
	item,
	onEdit,
}: BudgetDetailSpreadsheetProps) {
	const formatCurrency = (val: number | undefined) => {
		if (val === undefined || val === null || isNaN(val)) return "0";
		return val.toLocaleString("sv-SE");
	};

	// Calculate monthly column sums
	const monthlySums = useMemo(() => {
		const sums: number[] = new Array(12).fill(0);
		for (const row of item.rows || []) {
			for (let m = 0; m < 12; m++) {
				sums[m] += row.months?.[m] || 0;
			}
		}
		return sums;
	}, [item.rows]);

	return (
		<div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
			<div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="p-1.5 bg-slate-100 rounded-md text-slate-700">
						<Table className="w-4 h-4" />
					</div>
					<h2 className="text-base font-semibold text-slate-900">
						<Translate text={localizationConstants.sectionBudgetDetails} />
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

			<div className="p-6 space-y-4">
				{/* Fördelning Label */}
				<div>
					<span className="block text-xs font-semibold text-slate-500 mb-1">
						<Translate text={localizationConstants.fieldBudgetDistribution} />
					</span>
					<span className="text-sm font-semibold text-slate-900">
						{item.distributionType || "KR"}
					</span>
				</div>

				{/* 12-Month Spreadsheet Table */}
				<div className="overflow-x-auto border border-slate-200 rounded-lg">
					<table className="w-full border-collapse text-left text-xs min-w-[950px]">
						<thead>
							<tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
								<th className="px-3 py-2.5 whitespace-nowrap">
									<Translate text={localizationConstants.colBudgetKonto} />
								</th>
								<th className="px-3 py-2.5 whitespace-nowrap">
									<Translate
										text={localizationConstants.colBudgetKostnadsstalle}
									/>
								</th>
								<th className="px-3 py-2.5 text-right whitespace-nowrap">
									<Translate text={localizationConstants.colBudgetAnnual} />
								</th>
								<th className="px-3 py-2.5 text-center whitespace-nowrap">
									<Translate text={localizationConstants.colBudgetFordelning} />
								</th>
								<th className="px-3 py-2.5 text-center whitespace-nowrap">
									<Translate text={localizationConstants.colBudgetPercent} />
								</th>
								{MONTH_KEYS.map((monthKey, idx) => (
									<th
										key={idx}
										className="px-2.5 py-2.5 text-right whitespace-nowrap font-medium text-slate-700"
									>
										<Translate text={monthKey} />
									</th>
								))}
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100">
							{(!item.rows || item.rows.length === 0) && (
								<tr>
									<td colSpan={17} className="py-6 text-center text-slate-400">
										<Translate text={localizationConstants.emptyBudgetsDesc} />
									</td>
								</tr>
							)}

							{item.rows?.map((row) => (
								<tr key={row.id} className="hover:bg-slate-50/50">
									<td className="px-3 py-2.5 font-medium text-slate-900 whitespace-nowrap">
										{row.konto}
									</td>
									<td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">
										{row.kostnadsstalle || "—"}
									</td>
									<td className="px-3 py-2.5 text-right font-medium text-slate-900 whitespace-nowrap">
										{formatCurrency(row.arsbudget)}
									</td>
									<td className="px-3 py-2.5 text-center text-slate-600 whitespace-nowrap">
										{row.fordelning ?? 0}
									</td>
									<td className="px-3 py-2.5 text-center text-slate-600 whitespace-nowrap">
										{row.procent ?? 0}
									</td>
									{Array.from({ length: 12 }).map((_, mIdx) => (
										<td
											key={mIdx}
											className="px-2.5 py-2.5 text-right text-slate-700 font-mono whitespace-nowrap"
										>
											{formatCurrency(row.months?.[mIdx])}
										</td>
									))}
								</tr>
							))}

							{/* Monthly Column Sums Row */}
							{item.rows && item.rows.length > 0 && (
								<tr className="bg-slate-100/70 font-semibold text-slate-900 border-t border-slate-200">
									<td colSpan={5} className="px-3 py-2 text-right">
										<Translate text={localizationConstants.summaryMonthlyTotal} />:
									</td>
									{monthlySums.map((sum, mIdx) => (
										<td
											key={mIdx}
											className="px-2.5 py-2 text-right font-mono whitespace-nowrap"
										>
											{formatCurrency(sum)}
										</td>
									))}
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
