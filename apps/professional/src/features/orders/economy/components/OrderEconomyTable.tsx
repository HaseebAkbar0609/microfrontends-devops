"use client";

import {
	ArrowUpDown,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	MoreVertical,
	Eye,
	Pencil,
	Trash2,
} from "lucide-react";
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
import type { OrderEconomyRow } from "../types/orderEconomy.types";
import type { SortField, SortOrder } from "../hooks/useOrderEconomy";

export interface OrderEconomyTableProps {
	rows: OrderEconomyRow[];
	selectedIds: string[];
	onToggleSelectAll: () => void;
	onToggleSelectRow: (id: string) => void;
	sortField: SortField;
	sortOrder: SortOrder;
	onSort: (field: SortField) => void;
	totalTBBidrag: number;
	currentPage: number;
	setCurrentPage: (page: number) => void;
	pageSize: number;
	setPageSize: (size: number) => void;
	totalPages: number;
}

export function OrderEconomyTable({
	rows,
	selectedIds,
	onToggleSelectAll,
	onToggleSelectRow,
	onSort,
	totalTBBidrag,
	currentPage,
	setCurrentPage,
	pageSize,
	setPageSize,
	totalPages,
}: OrderEconomyTableProps) {
	const allSelected = rows.length > 0 && selectedIds.length === rows.length;

	return (
		<div className="flex flex-col gap-6 p-6">
			{/* Top Summary Banner */}
			<div className="flex items-center justify-between">
				<h2 className="text-base font-bold text-slate-900 tracking-tight">
					<Translate text={localizationConstants.totalTBBidragLabel} />{" "}
					<span className="font-semibold text-slate-900">
						{totalTBBidrag.toLocaleString("sv-SE")}
					</span>
				</h2>
			</div>

			{/* Borderless Datatable Container (No outer border, no shadow matching direct table) */}
			<div className="w-full overflow-x-auto relative bg-white">
				<table className="w-full min-w-200 border-collapse text-left text-sm">
					<thead>
						<tr className="border-b border-slate-200 bg-white text-slate-600 font-medium">
							<th className="p-4 w-12 text-center">
								<input
									type="checkbox"
									checked={allSelected}
									onChange={onToggleSelectAll}
									className="h-4 w-4 rounded border-slate-300 accent-[#0F172A] cursor-pointer"
								/>
							</th>
							<th className="p-4 cursor-pointer select-none" onClick={() => onSort("projectNo")}>
								<div className="flex items-center gap-1 font-semibold text-slate-600">
									<Translate text={localizationConstants.colProjectNo} />
									<ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
								</div>
							</th>
							<th className="p-4 cursor-pointer select-none" onClick={() => onSort("projectName")}>
								<div className="flex items-center gap-1 font-semibold text-slate-600">
									<Translate text={localizationConstants.colProjectName} />
									<ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
								</div>
							</th>
							<th className="p-4 cursor-pointer select-none" onClick={() => onSort("revenueCategory")}>
								<div className="flex items-center gap-1 font-semibold text-slate-600">
									<Translate text={localizationConstants.colTotalRevenue} />
									<ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
								</div>
							</th>
							<th className="p-4 cursor-pointer select-none" onClick={() => onSort("costCategory")}>
								<div className="flex items-center gap-1 font-semibold text-slate-600">
									<Translate text={localizationConstants.colTotalCosts} />
									<ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
								</div>
							</th>
							<th className="p-4 cursor-pointer select-none text-right" onClick={() => onSort("tbBidrag")}>
								<div className="flex items-center justify-end gap-1 font-semibold text-slate-600">
									<Translate text={localizationConstants.colTBBidrag} />
									<ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
								</div>
							</th>
							{/* Action menu column matching direct table */}
							<th className="w-[50px] min-w-[50px] sticky right-0 bg-white shadow-[inset_1px_0_0_0_#e2e8f0] z-20 text-center py-3.5 px-2" />
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100 bg-white">
						{rows.map((row) => {
							const isChecked = selectedIds.includes(row.id);
							return (
								<tr
									key={row.id}
									className={`group border-b border-slate-100 transition-colors hover:bg-slate-50/60 ${
										isChecked ? "bg-slate-50/80" : ""
									}`}
								>
									<td className="p-4 text-center">
										<input
											type="checkbox"
											checked={isChecked}
											onChange={() => onToggleSelectRow(row.id)}
											className="h-4 w-4 rounded border-slate-300 accent-[#0F172A] cursor-pointer"
										/>
									</td>
									<td className="p-4 font-semibold text-slate-900 whitespace-nowrap">
										{row.projectNo}
									</td>
									<td className="p-4 font-normal text-slate-700 whitespace-nowrap">
										{row.projectName}
									</td>
									<td className="p-4 whitespace-nowrap">
										<span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-800 border border-slate-200/80">
											<Translate text={row.revenueCategoryKey} />
										</span>
									</td>
									<td className="p-4 font-normal text-slate-700 whitespace-nowrap">
										<Translate text={row.costCategoryKey} />
									</td>
									<td className="p-4 font-semibold text-slate-900 text-right whitespace-nowrap">
										{row.tbBidrag.toLocaleString("sv-SE")}
									</td>
									{/* Sticky Action Menu Column */}
									<td className="w-[50px] min-w-[50px] sticky right-0 bg-white shadow-[inset_1px_0_0_0_#e2e8f0] transition-colors group-hover:bg-slate-50 z-10 text-center py-3.5 px-2">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8 text-slate-500 hover:text-slate-900 rounded-md cursor-pointer"
												>
													<MoreVertical className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end" className="w-36 border border-slate-200 bg-white shadow-md rounded-md p-1">
												<DropdownMenuItem className="flex items-center gap-2 cursor-pointer w-full text-slate-700 hover:bg-slate-50">
													<Eye className="h-4 w-4 text-slate-500" />
													<span><Translate text={localizationConstants.actionView} /></span>
												</DropdownMenuItem>
												<DropdownMenuItem className="flex items-center gap-2 cursor-pointer w-full text-slate-700 hover:bg-slate-50">
													<Pencil className="h-4 w-4 text-slate-500" />
													<span><Translate text={localizationConstants.actionEdit} /></span>
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
													<Trash2 className="h-4 w-4 text-red-500" />
													<span><Translate text={localizationConstants.actionDelete} /></span>
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			{/* Pagination Footer matching screenshot */}
			<div className="flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-6 pt-4 text-xs text-slate-600">
				<div className="flex items-center gap-2">
					<span className="font-medium text-slate-700">
						<Translate text={localizationConstants.rowsPerPage} />
					</span>
					<select
						value={pageSize}
						onChange={(e) => {
							setPageSize(Number(e.target.value));
							setCurrentPage(1);
						}}
						className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 focus:outline-hidden cursor-pointer"
					>
						<option value={10}>10</option>
						<option value={20}>20</option>
						<option value={50}>50</option>
					</select>
				</div>

				<div className="font-medium text-slate-700">
					Page {currentPage} of {totalPages}
				</div>

				<div className="flex items-center gap-1">
					<Button
						variant="outline"
						size="icon"
						className="h-8 w-8 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
						disabled={currentPage === 1}
						onClick={() => setCurrentPage(1)}
					>
						<ChevronsLeft className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="h-8 w-8 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
						disabled={currentPage === 1}
						onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="h-8 w-8 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
						disabled={currentPage === totalPages}
						onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="h-8 w-8 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
						disabled={currentPage === totalPages}
						onClick={() => setCurrentPage(totalPages)}
					>
						<ChevronsRight className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
