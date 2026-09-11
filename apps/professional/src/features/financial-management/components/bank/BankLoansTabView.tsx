"use client";

import React from "react";
import { Search, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import {
	BANK_PAGE_SIZE_OPTIONS,
} from "../../constants/bank.constants";
import type {
	BankLoanItem,
	BankSortField,
	SortOrder,
} from "../../types/bank.types";
import { BankLoansTable } from "./BankLoansTable";

export interface BankLoansTabViewProps {
	loans: BankLoanItem[];
	totalCount: number;
	currentPage: number;
	pageSize: number;
	totalPages: number;
	searchQuery: string;
	onSearchChange: (val: string) => void;
	statusFilter: string;
	onStatusFilterChange: (val: string) => void;
	sortBy: BankSortField;
	sortOrder: SortOrder;
	onSort: (field: BankSortField) => void;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
	onView?: (loan: BankLoanItem) => void;
	onViewLoan?: (id: string) => void;
	onEditLoan?: (loan: BankLoanItem) => void;
	onDeleteLoan?: (id: string, title: string) => void;
	onCreateClick: () => void;
}

export function BankLoansTabView({
	loans,
	totalCount,
	currentPage,
	pageSize,
	totalPages,
	searchQuery,
	onSearchChange,
	statusFilter,
	onStatusFilterChange,
	sortBy,
	sortOrder,
	onSort,
	onPageChange,
	onPageSizeChange,
	onView,
	onViewLoan,
	onEditLoan: _onEditLoan,
	onDeleteLoan: _onDeleteLoan,
	onCreateClick,
}: BankLoansTabViewProps) {
	const { t } = useTranslation();

	const handleView = (loan: BankLoanItem) => {
		if (onViewLoan) {
			onViewLoan(loan.id);
		} else if (onView) {
			onView(loan);
		}
	};

	return (
		<div className="space-y-4">
			{/* Top Toolbar */}
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
				<div className="flex items-center gap-2.5 flex-1 max-w-xl">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
						<Input
							type="text"
							value={searchQuery}
							onChange={(e) => onSearchChange(e.target.value)}
							placeholder={t(localizationConstants.searchBankPlaceholder)}
							className="pl-9 h-10 bg-white border-slate-200 text-sm placeholder:text-slate-400 rounded-lg shadow-2xs focus-visible:ring-slate-400"
						/>
					</div>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								type="button"
								variant="outline"
								className="h-10 px-3.5 bg-white border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg shadow-2xs gap-1.5 cursor-pointer"
							>
								<Filter className="w-4 h-4 text-slate-500" />
								<Translate
									text={
										statusFilter === "active"
											? localizationConstants.statusActive
											: statusFilter === "inactive"
												? localizationConstants.statusInactive
												: localizationConstants.filterBankPlaceholder
									}
								/>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="w-40">
							<DropdownMenuItem
								onClick={() => onStatusFilterChange("all")}
								className="cursor-pointer"
							>
								<Translate text={localizationConstants.filterAll} />
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => onStatusFilterChange("active")}
								className="cursor-pointer"
							>
								<Translate text={localizationConstants.statusActive} />
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => onStatusFilterChange("inactive")}
								className="cursor-pointer"
							>
								<Translate text={localizationConstants.statusInactive} />
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<div>
					<Button
						type="button"
						onClick={onCreateClick}
						className="h-10 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg shadow-sm gap-2 cursor-pointer transition-colors"
					>
						<Plus className="w-4 h-4" />
						<Translate text={localizationConstants.btnCreateNew} />
					</Button>
				</div>
			</div>

			{/* Table */}
			<BankLoansTable
				loans={loans}
				sortBy={sortBy}
				sortOrder={sortOrder}
				onSort={onSort}
				onView={handleView}
				onCreateClick={onCreateClick}
			/>

			{/* Pagination */}
			{totalCount > 0 && (
				<div className="flex flex-col sm:flex-row items-center justify-end gap-6 px-6 py-4 bg-transparent text-xs text-slate-600">
					{/* Rows per page */}
					<div className="flex items-center gap-2">
						<span className="text-slate-700 font-medium">
							<Translate text={localizationConstants.rowsPerPageLabel} />
						</span>
						<Select
							value={String(pageSize)}
							onValueChange={(val) => onPageSizeChange(Number(val))}
						>
							<SelectTrigger className="w-[70px] h-8 text-xs bg-white border-slate-200 cursor-pointer">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{BANK_PAGE_SIZE_OPTIONS.map((opt) => (
									<SelectItem key={opt} value={String(opt)} className="cursor-pointer">
										{opt}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Page X of Y */}
					<div className="text-slate-700 font-medium text-xs">
						<Translate text={localizationConstants.pageLabel} /> {currentPage}{" "}
						<Translate text={localizationConstants.pageOfLabel} /> {totalPages}
					</div>

					{/* Navigation buttons */}
					<div className="flex items-center gap-1">
						<Button
							type="button"
							variant="outline"
							size="icon"
							disabled={currentPage <= 1}
							onClick={() => onPageChange(1)}
							className="h-8 w-8 border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
							aria-label={t(localizationConstants.firstPageLabel)}
						>
							<ChevronsLeft className="w-4 h-4" />
						</Button>
						<Button
							type="button"
							variant="outline"
							size="icon"
							disabled={currentPage <= 1}
							onClick={() => onPageChange(currentPage - 1)}
							className="h-8 w-8 border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
							aria-label={t(localizationConstants.previousPageLabel)}
						>
							<ChevronLeft className="w-4 h-4" />
						</Button>
						<Button
							type="button"
							variant="outline"
							size="icon"
							disabled={currentPage >= totalPages}
							onClick={() => onPageChange(currentPage + 1)}
							className="h-8 w-8 border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
							aria-label={t(localizationConstants.nextPageLabel)}
						>
							<ChevronRight className="w-4 h-4" />
						</Button>
						<Button
							type="button"
							variant="outline"
							size="icon"
							disabled={currentPage >= totalPages}
							onClick={() => onPageChange(totalPages)}
							className="h-8 w-8 border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
							aria-label={t(localizationConstants.lastPageLabel)}
						>
							<ChevronsRight className="w-4 h-4" />
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
