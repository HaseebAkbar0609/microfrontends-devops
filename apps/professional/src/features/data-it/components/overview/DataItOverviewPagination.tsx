"use client";

import React from "react";
import {
	ChevronsLeft,
	ChevronLeft,
	ChevronRight,
	ChevronsRight,
} from "lucide-react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { PAGE_SIZE_OPTIONS } from "../../constants/dataItOverview.constants";

interface DataItOverviewPaginationProps {
	currentPage: number;
	totalPages: number;
	pageSize: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
}

export function DataItOverviewPagination({
	currentPage,
	totalPages,
	pageSize,
	onPageChange,
	onPageSizeChange,
}: DataItOverviewPaginationProps) {
	const t = useTranslate();

	return (
		<div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 px-4 py-3 sm:flex-row">
			<div className="flex items-center gap-2 text-xs text-slate-500">
				<span>{t(localizationConstants.dataItRowsPerPage)}</span>
				<select
					value={pageSize}
					onChange={(e) => onPageSizeChange(Number(e.target.value))}
					className="h-8 rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700 focus:border-slate-400 focus:outline-none"
				>
					{PAGE_SIZE_OPTIONS.map((opt) => (
						<option key={opt} value={opt}>
							{opt}
						</option>
					))}
				</select>
			</div>

			<div className="flex items-center gap-4 text-xs text-slate-600">
				<span>
					{t(localizationConstants.dataItPageOf, {
						page: currentPage,
						totalPages,
					})}
				</span>

				<div className="flex items-center gap-1">
					<button
						type="button"
						onClick={() => onPageChange(1)}
						disabled={currentPage <= 1}
						className="inline-flex h-7 w-7 items-center justify-center rounded border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
						aria-label="First page"
					>
						<ChevronsLeft size={14} />
					</button>
					<button
						type="button"
						onClick={() => onPageChange(currentPage - 1)}
						disabled={currentPage <= 1}
						className="inline-flex h-7 w-7 items-center justify-center rounded border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
						aria-label="Previous page"
					>
						<ChevronLeft size={14} />
					</button>
					<button
						type="button"
						onClick={() => onPageChange(currentPage + 1)}
						disabled={currentPage >= totalPages}
						className="inline-flex h-7 w-7 items-center justify-center rounded border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
						aria-label="Next page"
					>
						<ChevronRight size={14} />
					</button>
					<button
						type="button"
						onClick={() => onPageChange(totalPages)}
						disabled={currentPage >= totalPages}
						className="inline-flex h-7 w-7 items-center justify-center rounded border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
						aria-label="Last page"
					>
						<ChevronsRight size={14} />
					</button>
				</div>
			</div>
		</div>
	);
}
