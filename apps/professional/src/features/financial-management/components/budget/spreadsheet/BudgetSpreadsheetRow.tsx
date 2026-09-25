"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import localizationConstants from "@/utils/translation/constants";
import {
	ACCOUNT_OPTIONS,
	COST_CENTER_OPTIONS,
	MONTHS_COUNT,
} from "../../../constants/budget.constants";
import type { BudgetLineItem } from "../../../types/budget.types";

export interface BudgetSpreadsheetRowProps {
	row: BudgetLineItem;
	onRowChange: (id: string, updates: Partial<BudgetLineItem>) => void;
	onMonthChange: (id: string, monthIndex: number, value: number) => void;
	onRemove: (id: string) => void;
}

/** One editable budget line: its account, its centre, its year and its months. */
export function BudgetSpreadsheetRow({
	row,
	onRowChange,
	onMonthChange,
	onRemove,
}: BudgetSpreadsheetRowProps) {
	const { t } = useTranslation();

	return (
		<tr className="hover:bg-slate-50/40">
			<td className="p-1.5">
				<Select
					value={row.konto}
					onValueChange={(value) =>
						onRowChange(row.id, {
							konto: value,
							kontoName: ACCOUNT_OPTIONS.find((account) => account.value === value)?.label ?? value,
						})
					}
				>
					<SelectTrigger className="h-8 border-slate-200 bg-white text-xs">
						<SelectValue placeholder={t(localizationConstants.colBudgetKonto)} />
					</SelectTrigger>
					<SelectContent>
						{ACCOUNT_OPTIONS.map((account) => (
							<SelectItem key={account.value} value={account.value} className="cursor-pointer text-xs">
								{account.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</td>

			<td className="p-1.5">
				<Select
					value={row.kostnadsstalle}
					onValueChange={(value) => onRowChange(row.id, { kostnadsstalle: value })}
				>
					<SelectTrigger className="h-8 border-slate-200 bg-white text-xs">
						<SelectValue placeholder={t(localizationConstants.colBudgetKostnadsstalle)} />
					</SelectTrigger>
					<SelectContent>
						{COST_CENTER_OPTIONS.map((centre) => (
							<SelectItem key={centre.value} value={centre.value} className="cursor-pointer text-xs">
								{centre.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</td>

			<td className="p-1.5">
				<Input
					type="number"
					value={row.arsbudget || ""}
					onChange={(event) => onRowChange(row.id, { arsbudget: Number(event.target.value) || 0 })}
					aria-label={t(localizationConstants.colBudgetAnnual)}
					className="h-8 text-right font-mono text-xs"
				/>
			</td>

			<td className="p-1.5">
				<Input
					type="text"
					value={row.fordelning ?? 0}
					onChange={(event) => onRowChange(row.id, { fordelning: event.target.value })}
					aria-label={t(localizationConstants.colBudgetFordelning)}
					className="h-8 text-center font-mono text-xs"
				/>
			</td>

			<td className="p-1.5">
				<Input
					type="number"
					value={row.procent ?? 0}
					onChange={(event) => onRowChange(row.id, { procent: Number(event.target.value) || 0 })}
					aria-label={t(localizationConstants.colBudgetPercent)}
					className="h-8 text-center font-mono text-xs"
				/>
			</td>

			{Array.from({ length: MONTHS_COUNT }).map((_, monthIndex) => (
				<td key={monthIndex} className="p-1.5">
					<Input
						type="number"
						value={row.months?.[monthIndex] ?? 0}
						onChange={(event) => onMonthChange(row.id, monthIndex, Number(event.target.value) || 0)}
						className="h-8 px-1.5 text-right font-mono text-xs"
					/>
				</td>
			))}

			<td className="p-1.5 text-center">
				<button
					type="button"
					onClick={() => onRemove(row.id)}
					className="cursor-pointer p-1 text-slate-400 transition-colors hover:text-rose-600"
					aria-label={t(localizationConstants.btnDeleteBudget)}
				>
					<Trash2 className="h-3.5 w-3.5" />
				</button>
			</td>
		</tr>
	);
}

export default BudgetSpreadsheetRow;
