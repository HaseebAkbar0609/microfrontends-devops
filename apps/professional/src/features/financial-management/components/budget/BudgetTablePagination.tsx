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
		<div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 bg-white border-t border-slate-100 text-xs text-slate-600">
			{/* Left: Rows per page selector */}
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
						{BUDGET_PAGE_SIZE_OPTIONS.map((opt: number) => (
							<SelectItem key={opt} value={String(opt)} className="cursor-pointer">
								{opt}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Middle: Page X of Y */}
			<div className="text-slate-700 font-medium text-xs">
				<Translate text={localizationConstants.pageLabel} /> {currentPage}{" "}
				<Translate text={localizationConstants.pageOfLabel} /> {totalPages}
			</div>

			{/* Right: Pagination buttons (« < > ») */}
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
	);
}
