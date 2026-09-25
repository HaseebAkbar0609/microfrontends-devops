"use client";

import React, { useMemo, useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	DISTRIBUTION_OPTIONS,
	MONTHS_COUNT,
} from "../../constants/budget.constants";
import type { BudgetFormData, BudgetLineItem } from "../../types/budget.types";
import { emptyBudgetRow } from "../../utils/budgetRows";
import { formatNumber } from "../../utils/economyFormatters";
import { BudgetSpreadsheetHead } from "./spreadsheet/BudgetSpreadsheetHead";
import { BudgetSpreadsheetRow } from "./spreadsheet/BudgetSpreadsheetRow";

export interface CreateBudgetSpreadsheetProps {
	formData: BudgetFormData;
	onChange: (updates: Partial<BudgetFormData>) => void;
}

const SPREADSHEET_ID = "budget-spreadsheet";

export function CreateBudgetSpreadsheet({ formData, onChange }: CreateBudgetSpreadsheetProps) {
	const { t } = useTranslation();
	const [isOpen, setIsOpen] = useState(true);

	const handleAddRow = () => {
		onChange({ rows: [...(formData.rows || []), emptyBudgetRow()] });
	};

	const handleRemoveRow = (id: string) => {
		onChange({ rows: (formData.rows || []).filter((row) => row.id !== id) });
	};

	const handleRowChange = (id: string, updates: Partial<BudgetLineItem>) => {
		const updatedRows = (formData.rows || []).map((row) => {
			if (row.id !== id) return row;
			const updated = { ...row, ...updates };

			// If annual budget was modified and distribution is active, recalculate months
			if (updates.arsbudget !== undefined && formData.distributionType === "even") {
				const monthlyVal = Math.round(Number(updates.arsbudget) / MONTHS_COUNT);
				const newMonths: Record<number, number> = {};
				for (let month = 0; month < MONTHS_COUNT; month++) {
					newMonths[month] = monthlyVal;
				}
				updated.months = newMonths;
			}

			return updated;
		});

		onChange({ rows: updatedRows });
	};

	const handleMonthChange = (rowId: string, monthIdx: number, value: number) => {
		const updatedRows = (formData.rows || []).map((row) =>
			row.id === rowId ? { ...row, months: { ...row.months, [monthIdx]: value } } : row,
		);
		onChange({ rows: updatedRows });
	};

	// Monthly column totals
	const monthlySums = useMemo(() => {
		const sums: number[] = new Array(MONTHS_COUNT).fill(0);
		for (const row of formData.rows || []) {
			for (let month = 0; month < MONTHS_COUNT; month++) {
				sums[month] += Number(row.months?.[month]) || 0;
			}
		}
		return sums;
	}, [formData.rows]);

	return (
		<div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
			<div className="flex items-center justify-between border-b border-slate-100 pb-3">
				<h2 className="text-base font-semibold text-slate-900">
					<Translate text={localizationConstants.sectionBudgetDetails} />
				</h2>
				<button
					type="button"
					onClick={() => setIsOpen((prev) => !prev)}
					aria-expanded={isOpen}
					aria-controls={SPREADSHEET_ID}
					aria-label={t(localizationConstants.ariaToggleBudgetSection)}
					className="cursor-pointer rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
				>
					<ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
				</button>
			</div>

			{isOpen && (
				<div id={SPREADSHEET_ID} className="space-y-4">
					{/* Fördelning dropdown */}
					<div className="max-w-xs space-y-1">
						<label className="block text-xs font-semibold text-slate-700">
							<Translate text={localizationConstants.fieldBudgetDistribution} />
						</label>
						<Select
							value={formData.distributionType}
							onValueChange={(value) => onChange({ distributionType: value })}
						>
							<SelectTrigger className="h-10 cursor-pointer rounded-lg border-slate-200 bg-white text-sm">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{DISTRIBUTION_OPTIONS.map((option) => (
									<SelectItem
										key={option.value}
										value={option.value}
										className="cursor-pointer text-sm"
									>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Spreadsheet Table */}
					<div className="overflow-x-auto rounded-lg border border-slate-200">
						<table className="w-full min-w-[1000px] border-collapse text-left text-xs">
							<BudgetSpreadsheetHead />

							<tbody className="divide-y divide-slate-100">
								{(!formData.rows || formData.rows.length === 0) && (
									<tr>
										<td colSpan={18} className="py-6 text-center text-slate-400">
											<Translate text={localizationConstants.emptyBudgetsDesc} />
										</td>
									</tr>
								)}

								{formData.rows?.map((row) => (
									<BudgetSpreadsheetRow
										key={row.id}
										row={row}
										onRowChange={handleRowChange}
										onMonthChange={handleMonthChange}
										onRemove={handleRemoveRow}
									/>
								))}

								{/* Month sums row */}
								{formData.rows && formData.rows.length > 0 && (
									<tr className="border-t border-slate-200 bg-slate-100/70 font-semibold text-slate-900">
										<td colSpan={5} className="px-3 py-2 text-right">
											<Translate text={localizationConstants.summaryMonthlyTotal} />:
										</td>
										{monthlySums.map((sum, monthIdx) => (
											<td
												key={monthIdx}
												className="px-2 py-2 text-right font-mono whitespace-nowrap"
											>
												{formatNumber(sum)}
											</td>
										))}
										<td />
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
							className="h-8 cursor-pointer gap-1.5 border-slate-200 bg-white text-xs font-medium shadow-2xs hover:bg-slate-50"
						>
							<Plus className="h-3.5 w-3.5 text-slate-600" />
							<Translate text={localizationConstants.btnAddBudgetRow} />
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}

export default CreateBudgetSpreadsheet;
