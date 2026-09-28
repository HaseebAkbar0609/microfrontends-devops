"use client";

import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import { BUDGET_PAGE_SIZE_OPTIONS } from "../../constants/budget.constants";

interface BudgetTablePaginationProps {
	currentPage: number;
	pageSize: number;
	totalCount: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
}

export function BudgetTablePagination({
	currentPage,
	pageSize,
	totalCount: _totalCount,
	totalPages,
	onPageChange,
	onPageSizeChange,
}: BudgetTablePaginationProps) {
	const { t } = useTranslation();

	return (
		<div className="flex items-center gap-6 text-sm text-slate-600 flex-wrap justify-center sm:justify-end py-2 px-1">
			{/* Rows per page selector */}
			<div className="flex items-center gap-2">
				<span className="text-sm font-medium text-slate-700">
					<Translate text={localizationConstants.rowsPerPageLabel} />
				</span>
				<Select
					value={String(pageSize)}
					onValueChange={(val) => {
						onPageSizeChange(Number(val));
						onPageChange(1);
					}}
				>
					<SelectTrigger className="h-9 w-18 border-slate-200 bg-transparent text-sm font-medium text-slate-700 hover:bg-slate-50 focus:ring-0">
						<SelectValue placeholder={String(pageSize)} />
					</SelectTrigger>
					<SelectContent>
						{BUDGET_PAGE_SIZE_OPTIONS.map((opt: number) => (
							<SelectItem key={opt} value={String(opt)} className="cursor-pointer">
								{opt}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Middle: Page X of Y */}
			<div className="text-sm font-medium text-slate-700 select-none flex items-center gap-1">
				<Translate text={localizationConstants.pageLabel} />
				<span>{currentPage}</span>
				<Translate text={localizationConstants.ofLabel} />
				<span>{totalPages}</span>
			</div>

			{/* Right: Pagination buttons (« < > ») */}
			<div className="flex items-center gap-1">
				<Button
					type="button"
					variant="outline"
					size="icon"
					disabled={currentPage <= 1}
					onClick={() => onPageChange(1)}
					className="h-9 w-9 rounded-md border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
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
					className="h-9 w-9 rounded-md border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
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
					className="h-9 w-9 rounded-md border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
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
					className="h-9 w-9 rounded-md border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
					aria-label={t(localizationConstants.lastPageLabel)}
				>
					<ChevronsRight className="w-4 h-4" />
				</Button>
			</div>
		</div>
	);
}

