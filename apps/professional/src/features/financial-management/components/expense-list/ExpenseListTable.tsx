"use client";

import React from "react";
import {
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
	Trash2,
	Inbox,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	FileText,
	Plus,
} from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	ExpenseItem,
	ExpenseSortField,
} from "../../types/expense.types";
import { EXPENSE_TABLE_COLUMNS, EXPENSE_DEFAULT_ATTEST_RESPONSIBLE } from "../../constants/expense.constants";
import { ExpenseStatusBadge } from "./ExpenseBadges";

interface ExpenseListTableProps {
	expenses?: ExpenseItem[];
	totalCount?: number;
	selectedIds?: string[];
	onToggleSelect?: (id: string) => void;
	onToggleSelectAll?: () => void;
	sortField?: ExpenseSortField;
	sortOrder?: "asc" | "desc";
	onSort?: (field: ExpenseSortField) => void;
	currentPage?: number;
	pageSize?: number;
	onPageSizeChange?: (size: number) => void;
	totalPages?: number;
	onPageChange?: (page: number) => void;
	onView?: (item: ExpenseItem) => void;
	onDelete?: (id: string) => void;
}

function formatAmountDisplay(item: ExpenseItem): string {
	if (typeof item.amount === "number") {
		return item.amount.toLocaleString("sv-SE", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
	}
	return String(item.amount || "");
}

export function ExpenseListTable({
	expenses = [],
	totalCount: _totalCount = 0,
	selectedIds = [],
	onToggleSelect = () => {},
	onToggleSelectAll = () => {},
	sortField = "date",
	sortOrder = "desc",
	onSort = () => {},
	currentPage = 1,
	pageSize = 10,
	onPageSizeChange = () => {},
	totalPages = 1,
	onPageChange = () => {},
	onView = () => {},
	onDelete = () => {},
}: ExpenseListTableProps) {
	const safeExpenses = expenses || [];
	const safeSelectedIds = selectedIds || [];
	const allSelected = safeExpenses.length > 0 && safeSelectedIds.length === safeExpenses.length;

	const renderSortIcon = (field: ExpenseSortField) => {
		if (sortField !== field) {
			return <ArrowUpDown className="h-3 w-3 text-slate-300 ml-1 inline opacity-60 group-hover:opacity-100 transition-opacity" />;
		}
		return sortOrder === "asc" ? (
			<ArrowUp className="h-3 w-3 text-slate-900 ml-1 inline" />
		) : (
			<ArrowDown className="h-3 w-3 text-slate-900 ml-1 inline" />
		);
	};

	return (
		<div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col">
			{/* Table Container */}
			<div className="overflow-x-auto min-h-[350px]">
				<table className="w-full text-left border-collapse text-xs">
					<thead>
						<tr className="border-b border-slate-200/80 bg-white text-slate-600 font-medium select-none">
							{/* Checkbox Column */}
							<th className="py-3.5 px-4 w-12 text-center">
								<Checkbox
									checked={allSelected}
									onCheckedChange={onToggleSelectAll}
									aria-label="Select all"
									className="rounded border-slate-300 data-[state=checked]:bg-zinc-950 data-[state=checked]:border-zinc-950"
								/>
							</th>

							{/* Dynamic Columns matching Figma */}
							{EXPENSE_TABLE_COLUMNS.map((col) => (
								<th
									key={col.field}
									onClick={() => onSort(col.field)}
									className={`py-3.5 px-3.5 cursor-pointer hover:text-slate-900 transition-colors group ${
										col.align === "right" ? "text-right" : "text-left"
									}`}
								>
									<span className="inline-flex items-center gap-1 font-medium text-slate-600">
										<Translate text={col.labelKey} />
										{renderSortIcon(col.field)}
									</span>
								</th>
							))}

							{/* Column customization + icon in header matching Figma */}
							<th className="py-3.5 px-4 text-center w-10 text-slate-400">
								<Plus className="h-3.5 w-3.5 mx-auto" />
							</th>
						</tr>
					</thead>

					<tbody className="divide-y divide-slate-100">
						{safeExpenses.length === 0 ? (
							<tr>
								<td colSpan={EXPENSE_TABLE_COLUMNS.length + 2} className="py-16 text-center">
									<div className="flex flex-col items-center justify-center gap-2">
										<div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
											<Inbox className="h-5 w-5" />
										</div>
										<p className="text-sm font-semibold text-slate-800">
											<Translate text={localizationConstants.expenseNoRecordsFound} />
										</p>
										<p className="text-xs text-slate-400 max-w-xs">
											<Translate text={localizationConstants.expenseNoRecordsSubtitle} />
										</p>
									</div>
								</td>
							</tr>
						) : (
							safeExpenses.map((item) => {
								const isSelected = safeSelectedIds.includes(item.id);

								return (
									<tr
										key={item.id}
										className={`hover:bg-slate-50/70 transition-colors group cursor-pointer ${
											isSelected ? "bg-slate-50/60" : ""
										}`}
										onClick={() => onView(item)}
									>
										{/* Checkbox */}
										<td
											className="py-3.5 px-4 text-center"
											onClick={(e) => e.stopPropagation()}
										>
											<Checkbox
												checked={isSelected}
												onCheckedChange={() => onToggleSelect(item.id)}
												aria-label={`Select ${item.expenseNo}`}
												className="rounded border-slate-300 data-[state=checked]:bg-zinc-950 data-[state=checked]:border-zinc-950"
											/>
										</td>

										{/* 1. Datum */}
										<td className="py-3.5 px-3.5 text-slate-600 font-normal">
											{item.date}
										</td>

										{/* 2. Faktura (Pill badge like Figma #456989 / Heltid) */}
										<td className="py-3.5 px-3.5">
											<span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-800 border border-slate-200">
												{item.fakturaNo || item.expenseNo.replace("EXP-2026-00", "#")}
											</span>
										</td>

										{/* 3. Leverantör */}
										<td className="py-3.5 px-3.5 font-normal text-slate-800">
											{item.supplier}
										</td>

										{/* 4. Objekt (Project / Object) - Bold text in Figma */}
										<td className="py-3.5 px-3.5 font-semibold text-slate-900">
											{item.project}
										</td>

										{/* 5. Belopp */}
										<td className="py-3.5 px-3.5 text-right font-normal text-slate-800">
											{formatAmountDisplay(item)}
										</td>

										{/* 6. Faktura datum */}
										<td className="py-3.5 px-3.5 text-slate-600">
											{item.invoiceDate || item.date}
										</td>

										{/* 7. Förfallodatum */}
										<td className="py-3.5 px-3.5 text-slate-600">
											{item.dueDate}
										</td>

										{/* 8. Attest ansvarig */}
										<td className="py-3.5 px-3.5 text-slate-700">
											{item.attestResponsible || EXPENSE_DEFAULT_ATTEST_RESPONSIBLE}
										</td>

										{/* 9. Status */}
										<td className="py-3.5 px-3.5">
											<ExpenseStatusBadge status={item.status} />
										</td>

										{/* 10. Actions Dropdown */}
										<td
											className="py-3.5 px-4 text-center"
											onClick={(e) => e.stopPropagation()}
										>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant="ghost"
														size="icon"
														aria-label="Actions"
														className="h-7 w-7 text-slate-400 hover:text-slate-900 hover:bg-slate-100 cursor-pointer rounded-md"
													>
														<span className="text-base leading-none font-bold">⋮</span>
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end" className="w-36 bg-white border-slate-200 shadow-lg p-1">
													<DropdownMenuItem
														onClick={() => onView(item)}
														className="text-xs gap-2 cursor-pointer text-slate-700 py-1.5"
													>
														<FileText className="h-3.5 w-3.5 text-slate-500" />
														<Translate text={localizationConstants.expenseActionSeeInvoice} />
													</DropdownMenuItem>

													<DropdownMenuSeparator className="my-1 border-slate-100" />

													<DropdownMenuItem
														onClick={() => onDelete(item.id)}
														className="text-xs gap-2 text-rose-600 focus:text-rose-700 cursor-pointer py-1.5"
													>
														<Trash2 className="h-3.5 w-3.5 text-rose-500" />
														<Translate text={localizationConstants.expenseActionDelete} />
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</td>
									</tr>
								);
							})
						)}
					</tbody>
				</table>
			</div>

			{/* Pagination Footer matching Figma */}
			<div className="border-t border-slate-200/80 px-4 py-3 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
				{/* Rows per page selector */}
				<div className="flex items-center gap-2">
					<span>
						<Translate text={localizationConstants.expenseRowsPerPage} />
					</span>
					<Select
						value={String(pageSize)}
						onValueChange={(val) => onPageSizeChange(Number(val))}
					>
						<SelectTrigger className="h-7 w-16 text-xs bg-white border-slate-200 rounded">
							<SelectValue />
						</SelectTrigger>
						<SelectContent className="bg-white border-slate-200">
							<SelectItem value="5" className="text-xs">5</SelectItem>
							<SelectItem value="10" className="text-xs">10</SelectItem>
							<SelectItem value="25" className="text-xs">25</SelectItem>
							<SelectItem value="50" className="text-xs">50</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Page Navigation Controls */}
				<div className="flex items-center gap-1.5">
					<span className="mr-3 text-slate-600">
						<Translate text={localizationConstants.expensePaginationPage} /> {currentPage} <Translate text={localizationConstants.expensePaginationOf} /> {totalPages}
					</span>

					<Button
						variant="outline"
						size="icon"
						disabled={currentPage <= 1}
						onClick={() => onPageChange(1)}
						className="h-7 w-7 text-xs border-slate-200 disabled:opacity-30 cursor-pointer bg-white rounded"
					>
						<ChevronsLeft className="h-3.5 w-3.5 text-slate-600" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						disabled={currentPage <= 1}
						onClick={() => onPageChange(currentPage - 1)}
						className="h-7 w-7 text-xs border-slate-200 disabled:opacity-30 cursor-pointer bg-white rounded"
					>
						<ChevronLeft className="h-3.5 w-3.5 text-slate-600" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						disabled={currentPage >= totalPages}
						onClick={() => onPageChange(currentPage + 1)}
						className="h-7 w-7 text-xs border-slate-200 disabled:opacity-30 cursor-pointer bg-white rounded"
					>
						<ChevronRight className="h-3.5 w-3.5 text-slate-600" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						disabled={currentPage >= totalPages}
						onClick={() => onPageChange(totalPages)}
						className="h-7 w-7 text-xs border-slate-200 disabled:opacity-30 cursor-pointer bg-white rounded"
					>
						<ChevronsRight className="h-3.5 w-3.5 text-slate-600" />
					</Button>
				</div>
			</div>
		</div>
	);
}

export default ExpenseListTable;
