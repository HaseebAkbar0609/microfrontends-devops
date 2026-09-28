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
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import type {
	BankLoanItem,
	BankSortField,
	SortOrder,
} from "../../types/bank.types";
import { BankLoansTable } from "./BankLoansTable";
import { BankPagination } from "./BankPagination";

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
	onDeleteLoan,
	onCreateClick,
}: BankLoansTabViewProps) {
	const { t } = useTranslation();

	return (
		<div className="space-y-4">
			{/* Top Toolbar */}
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
				<div className="flex items-center gap-2 flex-1 max-w-xl">
					<div className="relative w-full sm:w-[240px] md:w-[260px] lg:w-[300px]">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
						<Input
							type="text"
							value={searchQuery}
							onChange={(e) => onSearchChange(e.target.value)}
							placeholder={t(localizationConstants.searchBankPlaceholder)}
							className="pl-9 h-10 bg-white border-slate-200 text-sm placeholder:text-slate-400 rounded-lg shadow-2xs focus-visible:ring-1 focus-visible:ring-slate-400"
						/>
					</div>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								type="button"
								variant="outline"
								className="h-10 px-3.5 bg-white border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-normal rounded-lg shadow-2xs gap-1.5 cursor-pointer"
							>
								<Filter className="w-3.5 h-3.5 text-slate-500" />
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
								className="cursor-pointer text-xs"
							>
								<Translate text={localizationConstants.filterAll} />
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => onStatusFilterChange("active")}
								className="cursor-pointer text-xs"
							>
								<Translate text={localizationConstants.statusActive} />
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => onStatusFilterChange("inactive")}
								className="cursor-pointer text-xs"
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
						className="h-10 px-4 bg-[#111721] hover:bg-slate-800 text-white font-medium text-sm rounded-lg shadow-2xs gap-2 cursor-pointer transition-colors"
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
				onDelete={onDeleteLoan}
				onCreateClick={onCreateClick}
			/>

			{/* Pagination */}
			<BankPagination
				totalCount={totalCount}
				currentPage={currentPage}
				pageSize={pageSize}
				totalPages={totalPages}
				onPageChange={onPageChange}
				onPageSizeChange={onPageSizeChange}
			/>
		</div>
	);
}

export default BankLoansTabView;
