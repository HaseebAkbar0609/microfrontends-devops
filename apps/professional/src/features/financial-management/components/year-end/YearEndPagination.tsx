"use client";

import React from "react";
import {
	ChevronsLeft,
	ChevronLeft,
	ChevronRight,
	ChevronsRight,
	ChevronDown,
} from "lucide-react";
import { YEAR_END_PAGE_SIZE_OPTIONS } from "../../constants/yearEnd.constants";

interface YearEndPaginationProps {
	currentPage: number;
	totalPages: number;
	pageSize: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
}

export function YearEndPagination({
	currentPage,
	totalPages,
	pageSize,
	onPageChange,
	onPageSizeChange,
}: YearEndPaginationProps) {
	return (
		<div className="flex flex-col sm:flex-row items-center justify-end gap-6 pt-4 text-xs text-slate-600">
			{/* Rows per page */}
			<div className="flex items-center gap-2">
				<span>Rader per sida</span>
				<div className="relative inline-block">
					<select
						value={pageSize}
						onChange={(e) => {
							onPageSizeChange(Number(e.target.value));
							onPageChange(1);
						}}
						className="appearance-none rounded-md border border-slate-200 bg-white py-1 pl-2.5 pr-7 text-xs font-medium text-slate-800 shadow-2xs focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer"
					>
						{YEAR_END_PAGE_SIZE_OPTIONS.map((opt) => (
							<option key={opt} value={opt}>
								{opt}
							</option>
						))}
					</select>
					<ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
				</div>
			</div>

			{/* Page counter */}
			<div className="font-medium text-slate-700">
				Page {currentPage} of {totalPages}
			</div>

			{/* Nav buttons */}
			<div className="flex items-center gap-1">
				{/* First page */}
				<button
					type="button"
					onClick={() => onPageChange(1)}
					disabled={currentPage <= 1}
					className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
				>
					<ChevronsLeft className="h-4 w-4" />
				</button>

				{/* Prev page */}
				<button
					type="button"
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage <= 1}
					className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
				>
					<ChevronLeft className="h-4 w-4" />
				</button>

				{/* Next page */}
				<button
					type="button"
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage >= totalPages}
					className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
				>
					<ChevronRight className="h-4 w-4" />
				</button>

				{/* Last page */}
				<button
					type="button"
					onClick={() => onPageChange(totalPages)}
					disabled={currentPage >= totalPages}
					className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
				>
					<ChevronsRight className="h-4 w-4" />
				</button>
			</div>
		</div>
	);
}

export default YearEndPagination;
