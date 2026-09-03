"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ExpenseLineItem, SwedishVatRate } from "../../types/expense.types";
import {
	DEFAULT_EXPENSE_UNITS,
	SWEDISH_VAT_RATES,
	STANDARD_BAS_ACCOUNTS,
} from "../../constants/expense.constants";

interface RegisterExpenseLineItemsTableProps {
	items: ExpenseLineItem[];
	onAddItem: () => void;
	onUpdateItem: (id: string, updates: Partial<ExpenseLineItem>) => void;
	onRemoveItem: (id: string) => void;
	error?: string;
}

export function RegisterExpenseLineItemsTable({
	items,
	onAddItem,
	onUpdateItem,
	onRemoveItem,
	error,
}: RegisterExpenseLineItemsTableProps) {
	const { t } = useTranslation();
	const formatNum = (num: number) => {
		return num.toLocaleString("sv-SE", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	};

	return (
		<div className="bg-white rounded-lg border border-slate-200 p-6 mb-5 shadow-2xs overflow-hidden">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-sm font-semibold text-slate-900">
					<Translate text={localizationConstants.registerExpenseLineItemsTitle} />
				</h3>
				{error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
			</div>

			{/* Responsive Table Container */}
			<div className="w-full overflow-x-auto">
				<Table className="w-full min-w-[950px] border-collapse border border-slate-200">
					<TableHeader>
						<TableRow className="border-b border-slate-200 bg-slate-50/70 hover:bg-slate-50/70">
							<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 min-w-[220px] border-r border-slate-200">
								<Translate text={localizationConstants.registerExpenseLineColDesc} />
							</TableHead>
							<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 w-24 text-left border-r border-slate-200">
								<Translate text={localizationConstants.registerExpenseLineColQty} />
							</TableHead>
							<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 w-24 border-r border-slate-200">
								<Translate text={localizationConstants.registerExpenseLineColUnit} />
							</TableHead>
							<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 w-32 text-left border-r border-slate-200">
								<Translate text={localizationConstants.registerExpenseLineColPrice} />
							</TableHead>
							<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 w-24 border-r border-slate-200">
								<Translate text={localizationConstants.registerExpenseLineColVatRate} />
							</TableHead>
							<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 min-w-[180px] border-r border-slate-200">
								<Translate text={localizationConstants.registerExpenseLineColAccount} />
							</TableHead>
							<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 w-32 text-right border-r border-slate-200">
								<Translate text={localizationConstants.registerExpenseLineColTotal} />
							</TableHead>
							<TableHead className="py-2.5 px-2 w-12 text-center" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{items.map((row) => (
							<TableRow
								key={row.id}
								className="border-b border-slate-200 hover:bg-slate-50/50 transition-colors"
							>
								{/* Beskrivning */}
								<TableCell className="py-2 px-3 border-r border-slate-200">
									<Input
										value={row.description}
										onChange={(e) => onUpdateItem(row.id, { description: e.target.value })}
										placeholder={t(localizationConstants.registerExpenseLineColDescPlaceholder)}
										className="h-8 text-xs border-0 focus-visible:ring-0 px-0 shadow-none bg-transparent"
									/>
								</TableCell>

								{/* Antal */}
								<TableCell className="py-2 px-3 border-r border-slate-200">
									<Input
										type="number"
										min="0.01"
										step="any"
										value={row.quantity || ""}
										onChange={(e) =>
											onUpdateItem(row.id, { quantity: parseFloat(e.target.value) || 0 })
										}
										className="h-8 text-xs border-0 focus-visible:ring-0 px-0 shadow-none bg-transparent"
									/>
								</TableCell>

								{/* Enhet */}
								<TableCell className="py-2 px-3 border-r border-slate-200">
									<Select
										value={row.unit}
										onValueChange={(val) => onUpdateItem(row.id, { unit: val })}
									>
										<SelectTrigger className="h-8 text-xs border-0 focus:ring-0 px-0 bg-transparent shadow-none">
											<SelectValue />
										</SelectTrigger>
										<SelectContent className="bg-white">
											{DEFAULT_EXPENSE_UNITS.map((u) => (
												<SelectItem key={u.value} value={u.value} className="text-xs cursor-pointer">
													{u.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</TableCell>

								{/* Á-pris (exkl. moms) */}
								<TableCell className="py-2 px-3 border-r border-slate-200">
									<Input
										type="number"
										min="0"
										step="any"
										value={row.unitPrice || ""}
										onChange={(e) =>
											onUpdateItem(row.id, { unitPrice: parseFloat(e.target.value) || 0 })
										}
										className="h-8 text-xs border-0 focus-visible:ring-0 px-0 shadow-none bg-transparent"
									/>
								</TableCell>

								{/* Moms % */}
								<TableCell className="py-2 px-3 border-r border-slate-200">
									<Select
										value={String(row.vatRate)}
										onValueChange={(val) =>
											onUpdateItem(row.id, { vatRate: Number(val) as SwedishVatRate })
										}
									>
										<SelectTrigger className="h-8 text-xs border-0 focus:ring-0 px-0 bg-transparent shadow-none">
											<SelectValue />
										</SelectTrigger>
										<SelectContent className="bg-white">
											{SWEDISH_VAT_RATES.map((rate) => (
												<SelectItem key={rate} value={String(rate)} className="text-xs cursor-pointer">
													{rate} %
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</TableCell>

								{/* Bokföringskonto (BAS) */}
								<TableCell className="py-2 px-3 border-r border-slate-200">
									<Select
										value={row.accountNumber}
										onValueChange={(val) => onUpdateItem(row.id, { accountNumber: val })}
									>
										<SelectTrigger className="h-8 text-xs border-0 focus:ring-0 px-0 bg-transparent shadow-none">
											<SelectValue />
										</SelectTrigger>
										<SelectContent className="bg-white max-h-56">
											{STANDARD_BAS_ACCOUNTS.map((acc) => (
												<SelectItem
													key={acc.code}
													value={acc.code}
													className="text-xs cursor-pointer"
												>
													{acc.code} - {acc.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</TableCell>

								{/* Radsumma (exkl moms) */}
								<TableCell className="py-2 px-3 text-xs font-semibold text-slate-900 border-r border-slate-200 text-right whitespace-nowrap">
									{formatNum(row.total)}
								</TableCell>

								{/* Ta bort rad */}
								<TableCell className="py-2 px-2 text-center">
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() => onRemoveItem(row.id)}
										aria-label={t(localizationConstants.registerExpenseDeleteRow)}
										className="h-7 w-7 text-slate-400 hover:text-rose-600 cursor-pointer"
									>
										<Trash2 className="h-3.5 w-3.5" />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{/* Dashed "+ Lägg till rad" Button */}
			<div className="pt-4">
				<button
					type="button"
					onClick={onAddItem}
					className="h-8 px-4 border border-dashed border-slate-300 bg-slate-50 text-xs font-medium text-slate-800 hover:bg-slate-100 cursor-pointer rounded-md transition-colors inline-flex items-center justify-center gap-1.5"
				>
					<Translate text={localizationConstants.registerExpenseAddLineItemBtn} />
				</button>
			</div>
		</div>
	);
}

export default RegisterExpenseLineItemsTable;
