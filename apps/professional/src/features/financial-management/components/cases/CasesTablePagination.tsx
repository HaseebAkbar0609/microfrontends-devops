"use client";

import React from "react";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { CASES_PAGE_SIZE_OPTIONS } from "../../constants/cases.constants";

interface CasesTablePaginationProps {
	totalItems: number;
	page: number;
	pageSize: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (pageSize: number) => void;
}

export function CasesTablePagination({
	totalItems,
	page,
	pageSize,
	onPageChange,
	onPageSizeChange,
}: CasesTablePaginationProps) {
	const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

	return (
		<div className="flex flex-wrap items-center justify-end gap-6 px-6 py-4 bg-white border-t border-slate-100 text-xs text-slate-600">
			{/* Rader per sida */}
			<div className="flex items-center gap-2">
				<span>
					<Translate text={localizationConstants.casesRowsPerPage} />
				</span>
				<Select
					value={String(pageSize)}
					onValueChange={(val) => onPageSizeChange(Number(val))}
				>
					<SelectTrigger className="h-8 w-16 text-xs bg-white border-slate-200 rounded-md">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{CASES_PAGE_SIZE_OPTIONS.map((opt) => (
							<SelectItem key={opt} value={String(opt)} className="text-xs cursor-pointer">
								{opt}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Page X of Y */}
			<div className="font-medium text-slate-700">
				Page {page} of {totalPages}
			</div>

			{/* Navigation buttons: << < > >> matching Figma Image 1 */}
			<div className="flex items-center gap-1.5">
				<button
					type="button"
					disabled={page <= 1}
					onClick={() => onPageChange(1)}
					className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
					aria-label="First page"
				>
					<ChevronsLeft className="w-3.5 h-3.5" />
				</button>
				<button
					type="button"
					disabled={page <= 1}
					onClick={() => onPageChange(page - 1)}
					className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
					aria-label="Previous page"
				>
					<ChevronLeft className="w-3.5 h-3.5" />
				</button>
				<button
					type="button"
					disabled={page >= totalPages}
					onClick={() => onPageChange(page + 1)}
					className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
					aria-label="Next page"
				>
					<ChevronRight className="w-3.5 h-3.5" />
				</button>
				<button
					type="button"
					disabled={page >= totalPages}
					onClick={() => onPageChange(totalPages)}
					className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
					aria-label="Last page"
				>
					<ChevronsRight className="w-3.5 h-3.5" />
				</button>
			</div>
		</div>
	);
}

export default CasesTablePagination;
