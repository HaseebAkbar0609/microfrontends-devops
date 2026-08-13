"use client";

import Link from "next/link";
import {
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
	Printer,
	MoreVertical,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	Eye,
	Pencil,
	Trash2,
} from "lucide-react";
import { Search } from "@/components/search/Search";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { WarrantyRow } from "../types/warranty.types";
import type { WarrantySortField, SortOrder } from "../hooks/useWarranty";

export interface WarrantyOverviewTableProps {
	rows: WarrantyRow[];
	selectedIds: string[];
	onToggleSelectAll: () => void;
	onToggleSelectRow: (id: string) => void;
	sortField: WarrantySortField;
	sortOrder: SortOrder;
	onSort: (field: WarrantySortField) => void;
	searchQuery: string;
	onSearchChange: (query: string) => void;
	statusFilter: string;
	onStatusFilterChange: (status: string) => void;
	currentPage: number;
	setCurrentPage: (page: number) => void;
	pageSize: number;
	setPageSize: (size: number) => void;
	totalPages: number;
	totalRows: number;
}

export function WarrantyOverviewTable({
	rows,
	selectedIds,
	onToggleSelectAll,
	onToggleSelectRow,
	sortField,
	sortOrder,
	onSort,
	searchQuery,
	onSearchChange,
	statusFilter,
	onStatusFilterChange,
	currentPage,
	setCurrentPage,
	pageSize,
	setPageSize,
	totalPages,
	totalRows,
}: WarrantyOverviewTableProps) {
	const allSelected = rows.length > 0 && rows.every((r) => selectedIds.includes(r.id));

	const renderSortIcon = (field: WarrantySortField) => {
		if (sortField !== field) {
			return <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-40 shrink-0 print:hidden" />;
		}
		return sortOrder === "asc" ? (
			<ArrowUp className="ml-1 h-3.5 w-3.5 text-slate-900 shrink-0 print:hidden" />
		) : (
			<ArrowDown className="ml-1 h-3.5 w-3.5 text-slate-900 shrink-0 print:hidden" />
		);
	};

	const handlePrint = () => {
		if (typeof window !== "undefined") {
			window.print();
		}
	};

	return (
		<div className="flex flex-col gap-6 p-6">
			{/* Top Toolbar matching Figma: Search + Filter + Print button (bg-slate-200, no border, hidden on print) */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
				<div className="flex items-center gap-3 w-full sm:w-auto">
					<Search
						value={searchQuery}
						onChange={onSearchChange}
						placeholder={localizationConstants.search}
						className="h-10 w-full"
						wrapperClassName="w-full sm:w-[240px] md:w-[260px] lg:w-[300px]"
					/>

					<Select value={statusFilter} onValueChange={onStatusFilterChange}>
						<SelectTrigger className="h-10 w-[120px] border-slate-200 bg-white text-xs font-normal text-slate-700 shadow-2xs cursor-pointer">
							<SelectValue placeholder="Filter" />
						</SelectTrigger>
						<SelectContent className="bg-white">
							<SelectItem value="all">
								<Translate text={localizationConstants.filterAllStatuses} />
							</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={handlePrint}
					className="h-10 w-10 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 border-none cursor-pointer shadow-2xs self-end sm:self-auto"
				>
					<Printer className="h-4 w-4 text-slate-700" />
				</Button>
			</div>

			{/* Borderless Datatable Container (Prints strictly the table) */}
			<div className="w-full overflow-x-auto relative bg-white">
				<table className="w-full min-w-[900px] border-collapse text-left text-sm print:min-w-full">
					<thead>
						<tr className="border-b border-slate-200 bg-white text-slate-600 font-medium">
							<th className="p-4 w-12 text-center print:hidden">
								<input
									type="checkbox"
									checked={allSelected}
									onChange={onToggleSelectAll}
									className="h-4 w-4 rounded border-slate-300 accent-[#0F172A] cursor-pointer"
								/>
							</th>
							<th className="p-4 cursor-pointer select-none" onClick={() => onSort("orderNo")}>
								<div className="flex items-center gap-1 font-semibold text-slate-600">
									<Translate text={localizationConstants.colOrderNo} />
									{renderSortIcon("orderNo")}
								</div>
							</th>
							<th className="p-4 cursor-pointer select-none" onClick={() => onSort("orderName")}>
								<div className="flex items-center gap-1 font-semibold text-slate-600">
									<Translate text={localizationConstants.orderName} />
									{renderSortIcon("orderName")}
								</div>
							</th>
							<th className="p-4 cursor-pointer select-none" onClick={() => onSort("startDate")}>
								<div className="flex items-center gap-1 font-semibold text-slate-600">
									<Translate text={localizationConstants.orderStart} />
									{renderSortIcon("startDate")}
								</div>
							</th>
							<th className="p-4 cursor-pointer select-none" onClick={() => onSort("approvedDate")}>
								<div className="flex items-center gap-1 font-semibold text-slate-600">
									<Translate text={localizationConstants.colApproved} />
									{renderSortIcon("approvedDate")}
								</div>
							</th>
							<th className="p-4 cursor-pointer select-none" onClick={() => onSort("warrantyPeriod")}>
								<div className="flex items-center gap-1 font-semibold text-slate-600">
									<Translate text={localizationConstants.colWarrantyPeriod} />
									{renderSortIcon("warrantyPeriod")}
								</div>
							</th>
							<th className="p-4 cursor-pointer select-none" onClick={() => onSort("projectManager")}>
								<div className="flex items-center gap-1 font-semibold text-slate-600">
									<Translate text={localizationConstants.colProjectManager} />
									{renderSortIcon("projectManager")}
								</div>
							</th>
							<th className="p-4 cursor-pointer select-none" onClick={() => onSort("customer")}>
								<div className="flex items-center gap-1 font-semibold text-slate-600">
									<Translate text={localizationConstants.orderCustomer} />
									{renderSortIcon("customer")}
								</div>
							</th>
							<th className="p-4 text-right font-medium text-slate-600 whitespace-nowrap print:hidden" />
							<th className="w-[50px] min-w-[50px] sticky right-0 bg-white shadow-[inset_1px_0_0_0_#e2e8f0] z-20 text-center py-3.5 px-2 print:hidden" />
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
									<td className="p-4 text-center print:hidden">
										<input
											type="checkbox"
											checked={isChecked}
											onChange={() => onToggleSelectRow(row.id)}
											className="h-4 w-4 rounded border-slate-300 accent-[#0F172A] cursor-pointer"
										/>
									</td>
									<td className="p-4 font-semibold text-slate-900 whitespace-nowrap">
										{row.orderNo}
									</td>
									<td className="p-4 font-semibold text-slate-900 whitespace-nowrap">
										{row.orderName}
									</td>
									<td className="p-4 font-normal text-slate-700 whitespace-nowrap">
										{row.startDate}
									</td>
									<td className="p-4 font-normal text-slate-700 whitespace-nowrap">
										{row.approvedDate}
									</td>
									<td className="p-4 font-normal text-slate-700 whitespace-nowrap">
										{row.warrantyPeriod}
									</td>
									<td className="p-4 font-normal text-slate-700 whitespace-nowrap">
										{row.projectManager}
									</td>
									<td className="p-4 font-normal text-slate-700 whitespace-nowrap">
										{row.customer}
									</td>
									<td className="p-4 text-right whitespace-nowrap print:hidden">
										<Link href={`/module/production/order/warranty/${encodeURIComponent(row.id)}`}>
											<Button
												variant="outline"
												size="sm"
												className="h-8 border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-800 hover:bg-slate-100 rounded-md cursor-pointer shadow-2xs"
											>
												<Translate text={localizationConstants.viewDetailsButton} />
											</Button>
										</Link>
									</td>
									<td className="w-[50px] min-w-[50px] sticky right-0 bg-white shadow-[inset_1px_0_0_0_#e2e8f0] transition-colors group-hover:bg-slate-50 z-10 text-center py-3.5 px-2 print:hidden">
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
												<DropdownMenuItem asChild>
													<Link
														href={`/module/production/order/warranty/${encodeURIComponent(row.id)}`}
														className="flex items-center gap-2 cursor-pointer w-full text-slate-700 hover:bg-slate-50"
													>
														<Eye className="h-4 w-4 text-slate-500" />
														<span><Translate text={localizationConstants.actionView} /></span>
													</Link>
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

			{/* Pagination Footer (Hidden on print) */}
			<div className="flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-6 pt-4 text-xs text-slate-600 print:hidden">
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
					Page {currentPage} of {totalPages} ({totalRows} items)
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
