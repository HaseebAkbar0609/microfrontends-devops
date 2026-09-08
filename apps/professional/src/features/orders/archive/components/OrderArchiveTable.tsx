"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
	MoreVertical,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	Eye,
	RotateCcw,
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
import type { OrderArchiveRow } from "../types/orderArchive.types";
import type { ArchiveSortField, SortOrder } from "../hooks/useOrderArchive";

export interface OrderArchiveTableProps {
	rows: OrderArchiveRow[];
	selectedIds: string[];
	onToggleSelectAll: () => void;
	onToggleSelectRow: (id: string) => void;
	sortField: ArchiveSortField;
	sortOrder: SortOrder;
	onSort: (field: ArchiveSortField) => void;
	searchQuery: string;
	onSearchChange: (query: string) => void;
	categoryFilter: string;
	onCategoryFilterChange: (category: string) => void;
	currentPage: number;
	setCurrentPage: (page: number) => void;
	pageSize: number;
	setPageSize: (size: number) => void;
	totalPages: number;
	totalRows: number;
	onRestoreOrder: (id: string) => void;
	onDeleteOrder: (id: string) => void;
}

export function OrderArchiveTable({
	rows,
	selectedIds,
	onToggleSelectAll,
	onToggleSelectRow,
	sortField,
	sortOrder,
	onSort,
	searchQuery,
	onSearchChange,
	categoryFilter,
	onCategoryFilterChange,
	currentPage,
	setCurrentPage,
	pageSize,
	setPageSize,
	totalPages,
	totalRows,
	onRestoreOrder,
	onDeleteOrder,
}: OrderArchiveTableProps) {
	const { i18n } = useTranslation();
	const locale = i18n.language === "sv" ? "sv-SE" : "en-US";

	const allSelected = rows.length > 0 && rows.every((r) => selectedIds.includes(r.id));

	const renderSortIcon = (field: ArchiveSortField) => {
		if (sortField !== field) {
			return <ArrowUpDown className="h-3.5 w-3.5 opacity-40 shrink-0" />;
		}
		return sortOrder === "asc" ? (
			<ArrowUp className="h-3.5 w-3.5 text-slate-900 shrink-0" />
		) : (
			<ArrowDown className="h-3.5 w-3.5 text-slate-900 shrink-0" />
		);
	};

	return (
		<div className="flex flex-col gap-6 p-6">
			{/* Top Toolbar: Search + Category Filter dropdown matching Figma */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-center gap-3 w-full sm:w-auto">
					<Search
						value={searchQuery}
						onChange={(val) => {
							onSearchChange(val);
							setCurrentPage(1);
						}}
						placeholder={localizationConstants.search}
						className="h-10 w-full"
						wrapperClassName="w-full sm:w-[240px] md:w-[260px] lg:w-[300px]"
					/>

					{/* Category Filter Select */}
					<Select
						value={categoryFilter}
						onValueChange={(val) => {
							onCategoryFilterChange(val);
							setCurrentPage(1);
						}}
					>
						<SelectTrigger className="h-10 w-[140px] border-slate-200 bg-white text-xs font-normal text-slate-700 shadow-2xs cursor-pointer">
							<SelectValue placeholder="Filter" />
						</SelectTrigger>
						<SelectContent className="bg-white">
							<SelectItem value="all">
								<Translate text={localizationConstants.filterAllCategories} />
							</SelectItem>
							<SelectItem value="Totalentreprenad">
								<Translate text={localizationConstants.catTotalentreprenad} />
							</SelectItem>
							<SelectItem value="Generalentreprenad">
								<Translate text={localizationConstants.catGeneralentreprenad} />
							</SelectItem>
							<SelectItem value="Löpande">
								<Translate text={localizationConstants.catLopande} />
							</SelectItem>
							<SelectItem value="Samverkan">
								<Translate text={localizationConstants.catSamverkan} />
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Borderless Datatable Container */}
			<div className="w-full overflow-x-auto relative bg-white">
				<table className="w-full min-w-[1000px] border-collapse text-left text-sm">
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
							<th className="p-4 cursor-pointer select-none" onClick={() => onSort("orderNo")}>
								<div className="flex items-center gap-1 font-semibold text-slate-600 whitespace-nowrap">
									<Translate text={localizationConstants.colOrderNo} />
									{renderSortIcon("orderNo")}
								</div>
							</th>
							<th className="p-4 cursor-pointer select-none" onClick={() => onSort("orderName")}>
								<div className="flex items-center gap-1 font-semibold text-slate-600 whitespace-nowrap">
									<Translate text={localizationConstants.orderName} />
									{renderSortIcon("orderName")}
								</div>
							</th>
							<th className="p-4 cursor-pointer select-none" onClick={() => onSort("category")}>
								<div className="flex items-center gap-1 font-semibold text-slate-600 whitespace-nowrap">
									<Translate text={localizationConstants.categoryLabel} />
									{renderSortIcon("category")}
								</div>
							</th>
							<th className="p-4 cursor-pointer select-none" onClick={() => onSort("department")}>
								<div className="flex items-center gap-1 font-semibold text-slate-600 whitespace-nowrap">
									<Translate text={localizationConstants.departmentLabel} />
									{renderSortIcon("department")}
								</div>
							</th>
							<th className="p-4 cursor-pointer select-none" onClick={() => onSort("contractSum")}>
								<div className="flex items-center gap-1 font-semibold text-slate-600 whitespace-nowrap">
									<Translate text={localizationConstants.colContractSum} />
									{renderSortIcon("contractSum")}
								</div>
							</th>
							<th className="p-4 cursor-pointer select-none text-right" onClick={() => onSort("orderSum")}>
								<div className="flex items-center justify-end gap-1 font-semibold text-slate-600 whitespace-nowrap">
									<Translate text={localizationConstants.colOrderSum} />
									{renderSortIcon("orderSum")}
								</div>
							</th>
							<th className="p-4 cursor-pointer select-none" onClick={() => onSort("projectManager")}>
								<div className="flex items-center gap-1 font-semibold text-slate-600 whitespace-nowrap">
									<Translate text={localizationConstants.colProjectManager} />
									{renderSortIcon("projectManager")}
								</div>
							</th>
							<th className="p-4 cursor-pointer select-none" onClick={() => onSort("startDate")}>
								<div className="flex items-center gap-1 font-semibold text-slate-600 whitespace-nowrap">
									<Translate text={localizationConstants.orderStart} />
									{renderSortIcon("startDate")}
								</div>
							</th>
							<th className="p-4 cursor-pointer select-none" onClick={() => onSort("endDate")}>
								<div className="flex items-center gap-1 font-semibold text-slate-600 whitespace-nowrap">
									<Translate text={localizationConstants.orderEnd} />
									{renderSortIcon("endDate")}
								</div>
							</th>
							<th className="w-[50px] min-w-[50px] sticky right-0 bg-white shadow-[inset_1px_0_0_0_#e2e8f0] z-20 text-center py-3.5 px-2" />
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100 bg-white">
						{rows.length === 0 ? (
							<tr>
								<td colSpan={11} className="py-12 text-center text-sm text-slate-500">
									<Translate text={localizationConstants.noOrdersFound} />
								</td>
							</tr>
						) : (
							rows.map((row) => {
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
											{row.orderNo}
										</td>
										<td className="p-4 font-semibold text-slate-900 whitespace-nowrap">
											{row.orderName}
										</td>
										<td className="p-4 whitespace-nowrap">
											<span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-800 border border-slate-200/80">
												<Translate text={row.categoryKey} />
											</span>
										</td>
										<td className="p-4 font-normal text-slate-700 whitespace-nowrap">
											<Translate text={row.departmentKey} />
										</td>
										<td className="p-4 font-normal text-slate-700 whitespace-nowrap">
											{row.contractSum}
										</td>
										<td className="p-4 font-semibold text-slate-900 text-right whitespace-nowrap">
											{row.orderSum.toLocaleString(locale)}
										</td>
										<td className="p-4 font-normal text-slate-700 whitespace-nowrap">
											{row.projectManager}
										</td>
										<td className="p-4 font-normal text-slate-700 whitespace-nowrap">
											{row.startDate}
										</td>
										<td className="p-4 font-normal text-slate-700 whitespace-nowrap">
											{row.endDate}
										</td>
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
												<DropdownMenuContent align="end" className="w-40 border border-slate-200 bg-white shadow-md rounded-md p-1">
													<DropdownMenuItem
														onClick={() => onRestoreOrder(row.id)}
														className="flex items-center gap-2 cursor-pointer w-full text-slate-700 hover:bg-slate-50"
													>
														<RotateCcw className="h-4 w-4 text-slate-500" />
														<span><Translate text={localizationConstants.actionRestore} /></span>
													</DropdownMenuItem>
													<DropdownMenuItem asChild>
														<Link
															href={`/module/production/order/${encodeURIComponent(row.id)}/order-information`}
															className="flex items-center gap-2 cursor-pointer w-full text-slate-700 hover:bg-slate-50"
														>
															<Eye className="h-4 w-4 text-slate-500" />
															<span><Translate text={localizationConstants.actionView} /></span>
														</Link>
													</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														onClick={() => onDeleteOrder(row.id)}
														className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
													>
														<Trash2 className="h-4 w-4 text-red-500" />
														<span><Translate text={localizationConstants.actionDelete} /></span>
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

			{/* Pagination Footer */}
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
