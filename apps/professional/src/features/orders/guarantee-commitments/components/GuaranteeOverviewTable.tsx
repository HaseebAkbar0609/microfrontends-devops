"use client";

import React from "react";
import {
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
	Printer,
	Plus,
	ChevronDown,
} from "lucide-react";
import { Search } from "@/components/search/Search";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Table,
	TableHeader,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TablePagination } from "@/components/table/TablePagination";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { GUARANTEE_CONSTANTS } from "../constants/guaranteeCommitments.constants";
import type { GuaranteeRow } from "../types/guaranteeCommitments.types";
import type { GuaranteeSortField, SortOrder } from "../hooks/useGuaranteeCommitments";

export interface GuaranteeOverviewTableProps {
	rows: GuaranteeRow[];
	selectedIds: string[];
	onToggleSelectAll: () => void;
	onToggleSelectRow: (id: string) => void;
	sortField: GuaranteeSortField;
	sortOrder: SortOrder;
	onSort: (field: GuaranteeSortField) => void;
	searchQuery: string;
	onSearchChange: (query: string) => void;
	statusFilter: string;
	onStatusFilterChange: (status: string) => void;
	currentPage: number;
	setCurrentPage: (page: number) => void;
	pageSize: number;
	setPageSize: (size: number) => void;
	totalPages: number;
	onOpenDetail: (row: GuaranteeRow) => void;
	onOpenAdd?: () => void;
}

export function GuaranteeOverviewTable({
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
	onOpenDetail,
	onOpenAdd,
}: GuaranteeOverviewTableProps) {
	const t = useTranslate();
	const allSelected = rows.length > 0 && rows.every((r) => selectedIds.includes(r.id));

	const renderSortIcon = (field: GuaranteeSortField) => {
		if (sortField !== field) {
			return <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 opacity-60 shrink-0 print:hidden" />;
		}
		return sortOrder === "asc" ? (
			<ArrowUp className="h-3.5 w-3.5 text-slate-900 shrink-0 print:hidden" />
		) : (
			<ArrowDown className="h-3.5 w-3.5 text-slate-900 shrink-0 print:hidden" />
		);
	};

	const handlePrint = () => {
		if (typeof window !== "undefined") {
			window.print();
		}
	};

	return (
		<div className="flex flex-col gap-4">
			{/* Top Action Bar: Search + Filter on Left, Print + Add button on Right */}
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
				<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
					<Search
						value={searchQuery}
						onChange={onSearchChange}
						placeholder={localizationConstants.search}
						className="h-10 w-full"
						wrapperClassName="w-full sm:w-[240px] md:w-[280px]"
					/>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								className="h-10 w-full sm:w-auto min-w-[90px] rounded-lg border-slate-200 text-slate-700 font-normal bg-white hover:bg-slate-50 gap-1.5 px-3 text-xs shadow-none justify-between cursor-pointer"
							>
								<span>
									{statusFilter === "all" ? (
										<Translate text={localizationConstants.filter} />
									) : (
										statusFilter
									)}
								</span>
								<ChevronDown className="h-3.5 w-3.5 text-slate-500 shrink-0" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="w-44 border border-slate-200 bg-white shadow-md rounded-lg p-1 z-50">
							<DropdownMenuItem
								onClick={() => onStatusFilterChange("all")}
								className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
							>
								<Translate text={localizationConstants.filterAllStatuses} />
							</DropdownMenuItem>
							{GUARANTEE_CONSTANTS.WARRANTY_PERIOD_FILTERS.map((period) => (
								<DropdownMenuItem
									key={period}
									onClick={() => onStatusFilterChange(period)}
									className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
								>
									{period}
								</DropdownMenuItem>
							))}
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
						title={t(localizationConstants.orgPrintButton)}
						aria-label={t(localizationConstants.orgPrintButton)}
					>
						<Printer className="h-4 w-4 text-slate-700" />
					</Button>

					{onOpenAdd && (
						<Button
							type="button"
							onClick={onOpenAdd}
							className="h-10 flex-1 sm:flex-none px-4 sm:px-5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium shadow-none gap-2 cursor-pointer flex items-center justify-center whitespace-nowrap"
						>
							<Plus className="h-4 w-4 shrink-0" />
							<span><Translate text={localizationConstants.add} /></span>
						</Button>
					)}
				</div>
			</div>

			{/* Datatable Container */}
			<div className="w-full overflow-x-auto relative bg-white">
				<Table className="w-full min-w-[900px] border-collapse text-left print:min-w-full">
					<TableHeader>
						<TableRow className="border-b border-slate-200 bg-white hover:bg-white">
							<TableHead className="w-12 px-4 py-3.5 text-center print:hidden">
								<Checkbox
									checked={allSelected}
									onCheckedChange={onToggleSelectAll}
									aria-label="Select all rows"
									className="border-slate-400 data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900 data-[state=checked]:text-white focus-visible:ring-slate-900 cursor-pointer"
								/>
							</TableHead>
							<TableHead
								className="cursor-pointer select-none whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
								onClick={() => onSort("orderNo")}
							>
								<span className="flex items-center gap-1">
									<Translate text={localizationConstants.colProjectNo} />
									{renderSortIcon("orderNo")}
								</span>
							</TableHead>
							<TableHead
								className="cursor-pointer select-none whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
								onClick={() => onSort("orderName")}
							>
								<span className="flex items-center gap-1">
									<Translate text={localizationConstants.colProjectName} />
									{renderSortIcon("orderName")}
								</span>
							</TableHead>
							<TableHead
								className="cursor-pointer select-none whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
								onClick={() => onSort("startDate")}
							>
								<span className="flex items-center gap-1">
									<Translate text={localizationConstants.orderStart} />
									{renderSortIcon("startDate")}
								</span>
							</TableHead>
							<TableHead
								className="cursor-pointer select-none whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
								onClick={() => onSort("approvedDate")}
							>
								<span className="flex items-center gap-1">
									<Translate text={localizationConstants.colApproved} />
									{renderSortIcon("approvedDate")}
								</span>
							</TableHead>
							<TableHead
								className="cursor-pointer select-none whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
								onClick={() => onSort("warrantyPeriod")}
							>
								<span className="flex items-center gap-1">
									<Translate text={localizationConstants.warrantyCommitments} />
									{renderSortIcon("warrantyPeriod")}
								</span>
							</TableHead>
							<TableHead
								className="cursor-pointer select-none whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
								onClick={() => onSort("projectManager")}
							>
								<span className="flex items-center gap-1">
									<Translate text={localizationConstants.colProjectManager} />
									{renderSortIcon("projectManager")}
								</span>
							</TableHead>
							<TableHead
								className="cursor-pointer select-none whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
								onClick={() => onSort("customer")}
							>
								<span className="flex items-center gap-1">
									<Translate text={localizationConstants.orderCustomer} />
									{renderSortIcon("customer")}
								</span>
							</TableHead>
							<TableHead className="w-24 px-4 py-3 text-center font-sans text-sm font-medium text-slate-500 print:hidden" />
						</TableRow>
					</TableHeader>
					<TableBody className="divide-y divide-slate-100 bg-white">
						{rows.length === 0 ? (
							<TableRow className="h-[56px]">
								<TableCell colSpan={9} className="h-[56px] text-center text-sm text-slate-400 py-6">
									{t(localizationConstants.noRecordsFound)}
								</TableCell>
							</TableRow>
						) : (
							rows.map((row) => {
								const isChecked = selectedIds.includes(row.id);
								return (
									<TableRow
										key={row.id}
										className={`group border-b border-slate-100 transition-colors hover:bg-slate-50/60 ${
											isChecked ? "bg-slate-50/80" : ""
										}`}
									>
										<TableCell className="px-4 py-3.5 text-center print:hidden">
											<Checkbox
												checked={isChecked}
												onCheckedChange={() => onToggleSelectRow(row.id)}
												aria-label={`Select row ${row.orderNo}`}
												className="border-slate-400 data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900 data-[state=checked]:text-white focus-visible:ring-slate-900 cursor-pointer"
											/>
										</TableCell>
										<TableCell className="px-4 py-3.5 text-sm font-normal text-slate-900 whitespace-nowrap">
											{row.orderNo}
										</TableCell>
										<TableCell className="px-4 py-3.5 text-sm font-normal text-slate-900 whitespace-nowrap">
											{row.orderName}
										</TableCell>
										<TableCell className="px-4 py-3.5 text-sm font-normal text-slate-900 whitespace-nowrap">
											{row.startDate}
										</TableCell>
										<TableCell className="px-4 py-3.5 text-sm font-normal text-slate-900 whitespace-nowrap">
											{row.approvedDate}
										</TableCell>
										<TableCell className="px-4 py-3.5 text-sm font-normal text-slate-900 whitespace-nowrap">
											{row.warrantyPeriod}
										</TableCell>
										<TableCell className="px-4 py-3.5 text-sm font-normal text-slate-900 whitespace-nowrap">
											{row.projectManager}
										</TableCell>
										<TableCell className="px-4 py-3.5 text-sm font-normal text-slate-900 whitespace-nowrap">
											{row.customer}
										</TableCell>
										<TableCell className="px-4 py-3.5 text-center whitespace-nowrap print:hidden">
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() => onOpenDetail(row)}
												className="h-8 border-slate-200 bg-white px-4 text-xs font-medium text-slate-800 hover:bg-slate-50 rounded-lg cursor-pointer shadow-none"
											>
												<Translate text={localizationConstants.openButton} />
											</Button>
										</TableCell>
									</TableRow>
								);
							})
						)}
					</TableBody>
				</Table>
			</div>

			{/* Centralized Reusable Project Pagination */}
			<div className="print:hidden">
				<TablePagination
					currentPage={currentPage}
					totalPages={totalPages}
					pageSize={pageSize}
					onPageChange={setCurrentPage}
					onPageSizeChange={setPageSize}
				/>
			</div>
		</div>
	);
}

export default GuaranteeOverviewTable;
