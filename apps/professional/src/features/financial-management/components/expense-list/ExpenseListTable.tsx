"use client";

import React from "react";
import {
	MoreVertical,
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
	Eye,
	CheckCircle,
	XCircle,
	CreditCard,
	Trash2,
	Inbox,
} from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	ExpenseItem,
	ExpenseSortField,
} from "../../types/expense.types";
import { EXPENSE_TABLE_COLUMNS } from "../../constants/expense.constants";
import { ExpenseStatusBadge, ExpenseCategoryBadge } from "./ExpenseBadges";

interface ExpenseListTableProps {
	expenses: ExpenseItem[];
	totalCount: number;
	sortField: ExpenseSortField;
	sortOrder: "asc" | "desc";
	onSort: (field: ExpenseSortField) => void;
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	onView: (item: ExpenseItem) => void;
	onApprove: (id: string) => void;
	onReject: (id: string) => void;
	onMarkPaid: (id: string) => void;
	onDelete: (id: string) => void;
}

function formatSEK(num: number): string {
	return num.toLocaleString("sv-SE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function ExpenseListTable({
	expenses,
	totalCount,
	sortField,
	sortOrder,
	onSort,
	currentPage,
	totalPages,
	onPageChange,
	onView,
	onApprove,
	onReject,
	onMarkPaid,
	onDelete,
}: ExpenseListTableProps) {
	const renderSortIcon = (field: ExpenseSortField) => {
		if (sortField !== field) {
			return <ArrowUpDown className="h-3 w-3 text-slate-300 ml-1 inline" />;
		}
		return sortOrder === "asc" ? (
			<ArrowUp className="h-3 w-3 text-slate-900 ml-1 inline" />
		) : (
			<ArrowDown className="h-3 w-3 text-slate-900 ml-1 inline" />
		);
	};

	return (
		<div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
			{/* Table Container */}
			<div className="overflow-x-auto min-h-[350px]">
				<table className="w-full text-left border-collapse text-xs">
					<thead>
						<tr className="border-b border-slate-200 bg-slate-50/70 text-slate-700 font-semibold select-none">
							{EXPENSE_TABLE_COLUMNS.map((col) => (
								<th
									key={col.field}
									onClick={() => onSort(col.field)}
									className={`py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors ${
										col.align === "right" ? "text-right" : "text-left"
									}`}
								>
									<span className="inline-flex items-center">
										<Translate text={col.labelKey} />
										{renderSortIcon(col.field)}
									</span>
								</th>
							))}
							<th className="py-3 px-4 text-right w-16">
								<Translate text={localizationConstants.expenseColActions} />
							</th>
						</tr>
					</thead>

					<tbody className="divide-y divide-slate-100">
						{expenses.length === 0 ? (
							<tr>
								<td colSpan={EXPENSE_TABLE_COLUMNS.length + 1} className="py-16 text-center">
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
							expenses.map((item) => (
								<tr
									key={item.id}
									className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
									onClick={() => onView(item)}
								>
									{/* Expense ID */}
									<td className="py-3.5 px-4 font-semibold text-slate-900">
										{item.expenseNo}
									</td>

									{/* Supplier */}
									<td className="py-3.5 px-4 font-medium text-slate-800">
										{item.supplier}
										{item.invoiceRef && (
											<span className="block text-[10px] text-slate-400 font-normal">
												Ref: {item.invoiceRef}
											</span>
										)}
									</td>

									{/* Category */}
									<td className="py-3.5 px-4">
										<ExpenseCategoryBadge category={item.category} />
									</td>

									{/* Amount */}
									<td className="py-3.5 px-4 text-right font-semibold text-slate-900">
										{formatSEK(item.amount)}
									</td>

									{/* Status */}
									<td className="py-3.5 px-4">
										<ExpenseStatusBadge status={item.status} />
									</td>

									{/* Date */}
									<td className="py-3.5 px-4 text-slate-600">{item.date}</td>

									{/* Due Date */}
									<td className="py-3.5 px-4 text-slate-600">{item.dueDate}</td>

									{/* Project */}
									<td className="py-3.5 px-4 text-slate-700">
										<span className="font-medium">{item.project}</span>
										<span className="block text-[10px] text-slate-400">
											{item.projectNumber} &bull; {item.costCenter}
										</span>
									</td>

									{/* Actions Dropdown */}
									<td
										className="py-3.5 px-4 text-right"
										onClick={(e) => e.stopPropagation()}
									>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													aria-label="Actions"
													className="h-7 w-7 text-slate-500 hover:text-slate-900 cursor-pointer rounded-md"
												>
													<MoreVertical className="h-3.5 w-3.5" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end" className="w-44 bg-white border-slate-200">
												<DropdownMenuItem
													onClick={() => onView(item)}
													className="text-xs gap-2 cursor-pointer"
												>
													<Eye className="h-3.5 w-3.5 text-slate-500" />
													<Translate text={localizationConstants.expenseActionView} />
												</DropdownMenuItem>

												{item.status === "pending" && (
													<>
														<DropdownMenuItem
															onClick={() => onApprove(item.id)}
															className="text-xs gap-2 text-emerald-600 focus:text-emerald-700 cursor-pointer"
														>
															<CheckCircle className="h-3.5 w-3.5" />
															<Translate text={localizationConstants.expenseActionApprove} />
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() => onReject(item.id)}
															className="text-xs gap-2 text-rose-600 focus:text-rose-700 cursor-pointer"
														>
															<XCircle className="h-3.5 w-3.5" />
															<Translate text={localizationConstants.expenseActionReject} />
														</DropdownMenuItem>
													</>
												)}

												{item.status !== "paid" && item.status !== "rejected" && (
													<DropdownMenuItem
														onClick={() => onMarkPaid(item.id)}
														className="text-xs gap-2 text-blue-600 focus:text-blue-700 cursor-pointer"
													>
														<CreditCard className="h-3.5 w-3.5" />
														<Translate text={localizationConstants.expenseActionMarkAsPaid} />
													</DropdownMenuItem>
												)}

												<DropdownMenuSeparator />

												<DropdownMenuItem
													onClick={() => onDelete(item.id)}
													className="text-xs gap-2 text-rose-600 focus:text-rose-700 cursor-pointer"
												>
													<Trash2 className="h-3.5 w-3.5" />
													<Translate text={localizationConstants.expenseActionDelete} />
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* Pagination Footer */}
			<div className="border-t border-slate-200 px-4 py-3 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
				<div>
					Visar <span className="font-semibold text-slate-800">{expenses.length}</span> av{" "}
					<span className="font-semibold text-slate-800">{totalCount}</span> utlägg
				</div>
				<div className="flex items-center gap-1.5">
					<Button
						variant="outline"
						size="sm"
						disabled={currentPage <= 1}
						onClick={() => onPageChange(currentPage - 1)}
						className="h-7 px-2.5 text-xs border-slate-200 disabled:opacity-50 cursor-pointer"
					>
						Föregående
					</Button>
					<span className="px-2 text-slate-700 font-medium">
						{currentPage} / {totalPages}
					</span>
					<Button
						variant="outline"
						size="sm"
						disabled={currentPage >= totalPages}
						onClick={() => onPageChange(currentPage + 1)}
						className="h-7 px-2.5 text-xs border-slate-200 disabled:opacity-50 cursor-pointer"
					>
						Nästa
					</Button>
				</div>
			</div>
		</div>
	);
}

export default ExpenseListTable;
