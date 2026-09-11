"use client";

import React, { useMemo } from "react";
import { Plus, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import {
	MONTH_KEYS,
	DISTRIBUTION_OPTIONS,
	ACCOUNT_OPTIONS,
	COST_CENTER_OPTIONS,
} from "../../constants/budget.constants";
import type {
	BudgetLineItem,
	BudgetFormData,
} from "../../types/budget.types";

interface CreateBudgetSpreadsheetProps {
	formData: BudgetFormData;
	onChange: (updates: Partial<BudgetFormData>) => void;
}

export function CreateBudgetSpreadsheet({
	formData,
	onChange,
}: CreateBudgetSpreadsheetProps) {
	const { t } = useTranslation();
	const handleAddRow = () => {
		const newRow: BudgetLineItem = {
			id: String(Date.now()),
			konto: "3011",
			kontoName: "3011 - Försäljning inom Sverige",
			kostnadsstalle: "10 - Stockholm",
			arsbudget: 0,
			fordelning: 12,
			procent: 0,
			months: {
				0: 0,
				1: 0,
				2: 0,
				3: 0,
				4: 0,
				5: 0,
				6: 0,
				7: 0,
				8: 0,
				9: 0,
				10: 0,
				11: 0,
			},
		};
		onChange({ rows: [...(formData.rows || []), newRow] });
	};

	const handleRemoveRow = (id: string) => {
		onChange({ rows: (formData.rows || []).filter((r) => r.id !== id) });
	};

	const handleRowChange = (id: string, updates: Partial<BudgetLineItem>) => {
		const updatedRows = (formData.rows || []).map((row) => {
			if (row.id !== id) return row;
			const updated = { ...row, ...updates };

			// If annual budget was modified and distribution is active, recalculate months
			if (
				updates.arsbudget !== undefined &&
				formData.distributionType === "even"
			) {
				const monthlyVal = Math.round(Number(updates.arsbudget) / 12);
				const newMonths: Record<number, number> = {};
				for (let m = 0; m < 12; m++) {
					newMonths[m] = monthlyVal;
				}
				updated.months = newMonths;
			}

			return updated;
		});

		onChange({ rows: updatedRows });
	};

	const handleMonthChange = (rowId: string, monthIdx: number, val: number) => {
		const updatedRows = (formData.rows || []).map((row) => {
			if (row.id !== rowId) return row;
			const newMonths = { ...row.months, [monthIdx]: val };
			return { ...row, months: newMonths };
		});
		onChange({ rows: updatedRows });
	};

	// Monthly column totals
	const monthlySums = useMemo(() => {
		const sums: number[] = new Array(12).fill(0);
		for (const row of formData.rows || []) {
			for (let m = 0; m < 12; m++) {
				sums[m] += Number(row.months?.[m]) || 0;
			}
		}
		return sums;
	}, [formData.rows]);

	return (
		<div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4">
			<div className="flex items-center justify-between border-b border-slate-100 pb-3">
				<h2 className="text-base font-semibold text-slate-900">
					<Translate text={localizationConstants.sectionBudgetDetails} />
				</h2>
				<ChevronDown className="w-4 h-4 text-slate-400" />
			</div>

			{/* Fördelning dropdown */}
			<div className="max-w-xs space-y-1">
				<label className="block text-xs font-semibold text-slate-700">
					<Translate text={localizationConstants.fieldBudgetDistribution} />
				</label>
				<Select
					value={formData.distributionType}
					onValueChange={(val) => onChange({ distributionType: val })}
				>
					<SelectTrigger className="h-10 bg-white border-slate-200 text-sm rounded-lg cursor-pointer">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{DISTRIBUTION_OPTIONS.map((opt) => (
							<SelectItem
								key={opt.value}
								value={opt.value}
								className="cursor-pointer text-sm"
							>
								{opt.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Spreadsheet Table */}
			<div className="overflow-x-auto border border-slate-200 rounded-lg">
				<table className="w-full border-collapse text-left text-xs min-w-[1000px]">
					<thead>
						<tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
							<th className="px-2.5 py-2.5 min-w-[130px]">
								<Translate text={localizationConstants.colBudgetKonto} />
							</th>
							<th className="px-2.5 py-2.5 min-w-[140px]">
								<Translate
									text={localizationConstants.colBudgetKostnadsstalle}
								/>
							</th>
							<th className="px-2.5 py-2.5 min-w-[100px] text-right">
								<Translate text={localizationConstants.colBudgetAnnual} />
							</th>
							<th className="px-2 py-2.5 min-w-[60px] text-center">
								<Translate text={localizationConstants.colBudgetFordelning} />
							</th>
							<th className="px-2 py-2.5 min-w-[50px] text-center">
								<Translate text={localizationConstants.colBudgetPercent} />
							</th>
							{MONTH_KEYS.map((monthKey, idx) => (
								<th
									key={idx}
									className="px-2 py-2.5 text-right font-medium text-slate-700 min-w-[80px]"
								>
									<Translate text={monthKey} />
								</th>
							))}
							<th className="w-10 px-2 py-2.5 text-center">
								<span className="sr-only">
									<Translate text={localizationConstants.btnDeleteBudget} />
								</span>
							</th>
						</tr>
					</thead>

					<tbody className="divide-y divide-slate-100">
						{(!formData.rows || formData.rows.length === 0) && (
							<tr>
								<td colSpan={18} className="py-6 text-center text-slate-400">
									<Translate text={localizationConstants.emptyBudgetsDesc} />
								</td>
							</tr>
						)}

						{formData.rows?.map((row) => (
							<tr key={row.id} className="hover:bg-slate-50/40">
								{/* Konto */}
								<td className="p-1.5">
									<Select
										value={row.konto}
										onValueChange={(val) =>
											handleRowChange(row.id, {
												konto: val,
												kontoName:
													ACCOUNT_OPTIONS.find((a) => a.value === val)?.label ||
													val,
											})
										}
									>
										<SelectTrigger className="h-8 text-xs bg-white border-slate-200">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{ACCOUNT_OPTIONS.map((acc) => (
												<SelectItem
													key={acc.value}
													value={acc.value}
													className="text-xs cursor-pointer"
												>
													{acc.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</td>

								{/* Kostnadsställe */}
								<td className="p-1.5">
									<Select
										value={row.kostnadsstalle}
										onValueChange={(val) =>
											handleRowChange(row.id, { kostnadsstalle: val })
										}
									>
										<SelectTrigger className="h-8 text-xs bg-white border-slate-200">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{COST_CENTER_OPTIONS.map((cc) => (
												<SelectItem
													key={cc.value}
													value={cc.value}
													className="text-xs cursor-pointer"
												>
													{cc.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</td>

								{/* Årsbudget */}
								<td className="p-1.5">
									<Input
										type="number"
										value={row.arsbudget || ""}
										onChange={(e) =>
											handleRowChange(row.id, {
												arsbudget: Number(e.target.value) || 0,
											})
										}
										className="h-8 text-xs text-right font-mono"
									/>
								</td>

								{/* Fördelning */}
								<td className="p-1.5">
									<Input
										type="text"
										value={row.fordelning ?? 0}
										onChange={(e) =>
											handleRowChange(row.id, {
												fordelning: e.target.value,
											})
										}
										className="h-8 text-xs text-center font-mono"
									/>
								</td>

								{/* % */}
								<td className="p-1.5">
									<Input
										type="number"
										value={row.procent ?? 0}
										onChange={(e) =>
											handleRowChange(row.id, {
												procent: Number(e.target.value) || 0,
											})
										}
										className="h-8 text-xs text-center font-mono"
									/>
								</td>

								{/* Months 0-11 */}
								{Array.from({ length: 12 }).map((_, mIdx) => (
									<td key={mIdx} className="p-1.5">
										<Input
											type="number"
											value={row.months?.[mIdx] ?? 0}
											onChange={(e) =>
												handleMonthChange(
													row.id,
													mIdx,
													Number(e.target.value) || 0,
												)
											}
											className="h-8 text-xs text-right font-mono px-1.5"
										/>
									</td>
								))}

								{/* Delete */}
								<td className="p-1.5 text-center">
									<button
										type="button"
										onClick={() => handleRemoveRow(row.id)}
										className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
										aria-label={t(localizationConstants.btnDeleteBudget)}
									>
										<Trash2 className="w-3.5 h-3.5" />
									</button>
								</td>
							</tr>
						))}

						{/* Month sums row */}
						{formData.rows && formData.rows.length > 0 && (
							<tr className="bg-slate-100/70 font-semibold text-slate-900 border-t border-slate-200">
								<td colSpan={5} className="px-3 py-2 text-right">
									<Translate text={localizationConstants.summaryMonthlyTotal} />:
								</td>
								{monthlySums.map((sum, mIdx) => (
									<td
										key={mIdx}
										className="px-2 py-2 text-right font-mono whitespace-nowrap"
									>
										{sum.toLocaleString("sv-SE")}
									</td>
								))}
								<td></td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{/* + Ny rad button */}
			<div>
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={handleAddRow}
					className="h-8 text-xs bg-white border-slate-200 hover:bg-slate-50 gap-1.5 cursor-pointer shadow-2xs font-medium"
				>
					<Plus className="w-3.5 h-3.5 text-slate-600" />
					<Translate text={localizationConstants.btnAddBudgetRow} />
				</Button>
			</div>
		</div>
	);
}
