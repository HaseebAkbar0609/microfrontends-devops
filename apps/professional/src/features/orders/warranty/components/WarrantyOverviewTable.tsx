"use client";

import Link from "next/link";
import {
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
	Printer,
	MoreVertical,
	ChevronDown,
	Eye,
	Pencil,
	Trash2,
	Plus,
	Check,
} from "lucide-react";
import { Search } from "@/components/search/Search";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TablePagination } from "@/components/table/TablePagination";
import {
	Table,
	TableHeader,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
} from "@/components/ui/table";
import { Translate, useTranslate } from "@/utils/translation/translate";
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
	totalRows?: number;
	onAddNew?: () => void;
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
	statusFilter: _statusFilter,
	onStatusFilterChange,
	currentPage,
	setCurrentPage,
	pageSize,
	setPageSize,
	totalPages,
	totalRows: _totalRows,
	onAddNew,
}: WarrantyOverviewTableProps) {
	const t = useTranslate();
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
		<div className="flex flex-col gap-6 p-6 bg-white">
			{/* Top Toolbar: Search + Filter + Print Button + Add Button */}
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
				<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
					<Search
						value={searchQuery}
						onChange={onSearchChange}
						placeholder={t(localizationConstants.search)}
						className="h-10 w-full"
						wrapperClassName="w-full sm:w-[240px] md:w-[280px]"
					/>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								className="h-10 w-full sm:w-[90px] rounded-lg border-slate-200 text-slate-700 font-normal bg-white hover:bg-slate-50 gap-1.5 px-3 text-xs shadow-none justify-between cursor-pointer shrink-0"
							>
								<Translate text={localizationConstants.filter} />
								<ChevronDown className="h-3.5 w-3.5 text-slate-500 shrink-0" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="w-44 border border-slate-200 bg-white shadow-md rounded-lg p-1">
							<DropdownMenuItem
								onClick={() => onStatusFilterChange("all")}
								className="flex items-center justify-between text-xs cursor-pointer focus:bg-slate-100 text-slate-700 focus:text-slate-900"
							>
								<Translate text={localizationConstants.allStatus} />
								{_statusFilter === "all" && <Check className="h-4 w-4 text-slate-700" />}
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => onStatusFilterChange("active")}
								className="flex items-center justify-between text-xs cursor-pointer focus:bg-slate-100 text-slate-700 focus:text-slate-900"
							>
								<Translate text={localizationConstants.activeStatus} />
								{_statusFilter === "active" && <Check className="h-4 w-4 text-slate-700" />}
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => onStatusFilterChange("inactive")}
								className="flex items-center justify-between text-xs cursor-pointer focus:bg-slate-100 text-slate-700 focus:text-slate-900"
							>
								<Translate text={localizationConstants.inactiveStatus} />
								{_statusFilter === "inactive" && <Check className="h-4 w-4 text-slate-700" />}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<div className="flex items-center justify-end gap-2 sm:gap-3 w-full sm:w-auto">
					<Button
						type="button"
						variant="outline"
						size="icon"
						onClick={handlePrint}
						className="h-10 w-10 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer shadow-none shrink-0"
					>
						<Printer className="h-4 w-4 text-slate-700" />
					</Button>

					{onAddNew && (
						<Button
							type="button"
							onClick={onAddNew}
							className="h-10 px-5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium shadow-none gap-2 cursor-pointer flex items-center justify-center whitespace-nowrap"
						>
							<Plus className="h-4 w-4 shrink-0" />
							<span><Translate text={localizationConstants.add} /></span>
						</Button>
					)}
				</div>
			</div>

			{/* Shadcn UI Table Container */}
			<div className="w-full overflow-x-auto relative bg-white rounded-lg">
				<Table className="w-full min-w-[950px] table-auto border-collapse text-left print:min-w-full">
					<TableHeader>
						<TableRow className="border-b border-slate-200 bg-white hover:bg-white font-sans font-medium text-sm leading-6 tracking-normal text-slate-500">
							<TableHead className="p-4 w-12 text-center print:hidden">
								<input
									type="checkbox"
									checked={allSelected}
									onChange={onToggleSelectAll}
									className="h-4 w-4 rounded border-slate-300 accent-slate-900 cursor-pointer"
								/>
							</TableHead>
							<TableHead className="p-4 cursor-pointer select-none whitespace-nowrap" onClick={() => onSort("orderNo")}>
								<div className="flex items-center gap-1 font-sans font-medium text-slate-500 hover:text-slate-900 transition-colors text-sm leading-6 tracking-normal">
									<Translate text={localizationConstants.colOrderNo} />
									{renderSortIcon("orderNo")}
								</div>
							</TableHead>
							<TableHead className="p-4 cursor-pointer select-none whitespace-nowrap" onClick={() => onSort("orderName")}>
								<div className="flex items-center gap-1 font-sans font-medium text-slate-500 hover:text-slate-900 transition-colors text-sm leading-6 tracking-normal">
									<Translate text={localizationConstants.orderName} />
									{renderSortIcon("orderName")}
								</div>
							</TableHead>
							<TableHead className="p-4 cursor-pointer select-none whitespace-nowrap" onClick={() => onSort("startDate")}>
								<div className="flex items-center gap-1 font-sans font-medium text-slate-500 hover:text-slate-900 transition-colors text-sm leading-6 tracking-normal">
									<Translate text={localizationConstants.orderStart} />
									{renderSortIcon("startDate")}
								</div>
							</TableHead>
							<TableHead className="p-4 cursor-pointer select-none whitespace-nowrap" onClick={() => onSort("approvedDate")}>
								<div className="flex items-center gap-1 font-sans font-medium text-slate-500 hover:text-slate-900 transition-colors text-sm leading-6 tracking-normal">
									<Translate text={localizationConstants.colApproved} />
									{renderSortIcon("approvedDate")}
								</div>
							</TableHead>
							<TableHead className="p-4 cursor-pointer select-none whitespace-nowrap" onClick={() => onSort("warrantyPeriod")}>
								<div className="flex items-center gap-1 font-sans font-medium text-slate-500 hover:text-slate-900 transition-colors text-sm leading-6 tracking-normal">
									<Translate text={localizationConstants.colWarrantyPeriod} />
									{renderSortIcon("warrantyPeriod")}
								</div>
							</TableHead>
							<TableHead className="p-4 cursor-pointer select-none whitespace-nowrap" onClick={() => onSort("projectManager")}>
								<div className="flex items-center gap-1 font-sans font-medium text-slate-500 hover:text-slate-900 transition-colors text-sm leading-6 tracking-normal">
									<Translate text={localizationConstants.colProjectManager} />
									{renderSortIcon("projectManager")}
								</div>
							</TableHead>
							<TableHead className="p-4 cursor-pointer select-none whitespace-nowrap" onClick={() => onSort("customer")}>
								<div className="flex items-center gap-1 font-sans font-medium text-slate-500 hover:text-slate-900 transition-colors text-sm leading-6 tracking-normal">
									<Translate text={localizationConstants.orderCustomer} />
									{renderSortIcon("customer")}
								</div>
							</TableHead>
							<TableHead className="p-4 text-right font-medium text-slate-500 whitespace-nowrap print:hidden" />
							<TableHead className="w-[50px] min-w-[50px] border-l border-slate-200 text-center py-3.5 px-2 print:hidden" />
						</TableRow>
					</TableHeader>
					<TableBody className="divide-y divide-slate-100 bg-white">
						{rows.map((row) => {
							const isChecked = selectedIds.includes(row.id);
							return (
								<TableRow
									key={row.id}
									className={`group border-b border-slate-100 transition-colors hover:bg-slate-50/60 ${isChecked ? "bg-slate-50/80" : ""
										}`}
								>
									<TableCell className="p-4 text-center print:hidden">
										<input
											type="checkbox"
											checked={isChecked}
											onChange={() => onToggleSelectRow(row.id)}
											className="h-4 w-4 rounded border-slate-300 accent-slate-900 cursor-pointer"
										/>
									</TableCell>
									<TableCell className="p-4 font-sans font-normal text-sm leading-5 tracking-normal text-slate-950 whitespace-nowrap">
										{row.orderNo}
									</TableCell>
									<TableCell className="p-4 font-sans font-bold text-sm leading-5 tracking-normal text-slate-950 whitespace-nowrap">
										{row.orderName}
									</TableCell>
									<TableCell className="p-4 font-sans font-normal text-sm leading-5 tracking-normal text-slate-950 whitespace-nowrap">
										{row.startDate}
									</TableCell>
									<TableCell className="p-4 font-sans font-normal text-sm leading-5 tracking-normal text-slate-950 whitespace-nowrap">
										{row.approvedDate}
									</TableCell>
									<TableCell className="p-4 font-sans font-normal text-sm leading-5 tracking-normal text-slate-950 whitespace-nowrap">
										{row.warrantyPeriod}
									</TableCell>
									<TableCell className="p-4 font-sans font-normal text-sm leading-5 tracking-normal text-slate-950 whitespace-nowrap">
										{row.projectManager}
									</TableCell>
									<TableCell className="p-4 font-sans font-normal text-sm leading-5 tracking-normal text-slate-950 whitespace-nowrap">
										{row.customer}
									</TableCell>
									<TableCell className="p-4 text-right whitespace-nowrap print:hidden">
										<Link href={`/module/production/order/warranty/${encodeURIComponent(row.id)}`}>
											<Button
												variant="outline"
												size="sm"
												className="h-7.5 border-slate-200/80 bg-slate-100 hover:bg-slate-200 px-3.5 text-xs font-medium text-slate-800 rounded-md cursor-pointer shadow-none"
											>
												<Translate text={localizationConstants.viewDetailsButton} />
											</Button>
										</Link>
									</TableCell>
									<TableCell className="w-[50px] min-w-[50px] border-l border-slate-200 text-center py-3.5 px-2 print:hidden">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8 text-slate-500 hover:text-slate-900 rounded-md cursor-pointer shadow-none"
												>
													<MoreVertical className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end" className="w-36 border border-slate-200 bg-white shadow-md rounded-md p-1">
												<DropdownMenuItem asChild>
													<Link
														href={`/module/production/order/warranty/${encodeURIComponent(row.id)}`}
														className="flex items-center gap-2 cursor-pointer w-full text-slate-900 hover:bg-slate-50 focus:bg-slate-100 focus:text-slate-950"
													>
														<Eye className="h-4 w-4 text-slate-900" />
														<span className="text-xs font-normal text-slate-900"><Translate text={localizationConstants.actionView} /></span>
													</Link>
												</DropdownMenuItem>
												<DropdownMenuItem className="flex items-center gap-2 cursor-pointer w-full text-slate-900 hover:bg-slate-50 focus:bg-slate-100 focus:text-slate-950">
													<Pencil className="h-4 w-4 text-slate-900" />
													<span className="text-xs font-normal text-slate-900"><Translate text={localizationConstants.actionEdit} /></span>
												</DropdownMenuItem>
												<DropdownMenuItem className="flex items-center gap-2 cursor-pointer w-full text-slate-900 hover:bg-slate-50 focus:bg-slate-100 focus:text-slate-950">
													<Trash2 className="h-4 w-4 text-slate-900" />
													<span className="text-xs font-normal text-slate-900"><Translate text={localizationConstants.actionDelete} /></span>
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>

			{/* Reused TablePagination Component */}
			<div className="pt-2 print:hidden">
				<TablePagination
					currentPage={currentPage}
					totalPages={totalPages}
					pageSize={pageSize}
					onPageChange={setCurrentPage}
					onPageSizeChange={(size) => {
						setPageSize(size);
						setCurrentPage(1);
					}}
				/>
			</div>
		</div>
	);
}
