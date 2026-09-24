"use client";

import React from "react";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Translate } from "@/utils/translation/translate";
import { AUTHORITIES_PAGE_SIZE_OPTIONS } from "../../constants/authorities.constants";
import localizationConstants from "@/utils/translation/constants";

interface AuthoritiesPaginationProps {
	totalCount: number;
	currentPage: number;
	pageSize: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
}

export function AuthoritiesPagination({
	currentPage,
	pageSize,
	totalPages,
	onPageChange,
	onPageSizeChange,
}: AuthoritiesPaginationProps) {
	return (
		<div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4 text-xs text-slate-600 select-none">
			{/* Rows per page selector */}
			<div className="flex items-center gap-2">
				<span>
					<Translate text={localizationConstants.rowsPerPage} />
				</span>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="h-8 px-2.5 bg-white border-slate-200 text-xs font-normal shadow-2xs gap-1.5 cursor-pointer"
						>
							{pageSize}
							<span className="text-[10px] text-slate-400">▼</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="min-w-16">
						{AUTHORITIES_PAGE_SIZE_OPTIONS.map((size) => (
							<DropdownMenuItem
								key={size}
								onClick={() => {
									onPageSizeChange(size);
									onPageChange(1);
								}}
								className={`text-xs cursor-pointer ${
									size === pageSize ? "font-semibold bg-slate-50" : ""
								}`}
							>
								{size}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Page X of Y */}
			<div className="flex items-center gap-1">
				<span>
					<Translate text={localizationConstants.pageLabelYearEnd} />
				</span>
				<span>{currentPage}</span>
				<span>
					<Translate text={localizationConstants.pageOfLabelYearEnd} />
				</span>
				<span>{totalPages}</span>
			</div>

			{/* Navigation Buttons */}
			<div className="flex items-center gap-1">
				<Button
					type="button"
					variant="outline"
					size="icon"
					disabled={currentPage <= 1}
					onClick={() => onPageChange(1)}
					className="h-8 w-8 bg-white border-slate-200 text-slate-600 disabled:opacity-40 cursor-pointer"
					aria-label="First page"
				>
					<ChevronsLeft className="w-4 h-4" />
				</Button>

				<Button
					type="button"
					variant="outline"
					size="icon"
					disabled={currentPage <= 1}
					onClick={() => onPageChange(currentPage - 1)}
					className="h-8 w-8 bg-white border-slate-200 text-slate-600 disabled:opacity-40 cursor-pointer"
					aria-label="Previous page"
				>
					<ChevronLeft className="w-4 h-4" />
				</Button>

				<Button
					type="button"
					variant="outline"
					size="icon"
					disabled={currentPage >= totalPages}
					onClick={() => onPageChange(currentPage + 1)}
					className="h-8 w-8 bg-white border-slate-200 text-slate-600 disabled:opacity-40 cursor-pointer"
					aria-label="Next page"
				>
					<ChevronRight className="w-4 h-4" />
				</Button>

				<Button
					type="button"
					variant="outline"
					size="icon"
					disabled={currentPage >= totalPages}
					onClick={() => onPageChange(totalPages)}
					className="h-8 w-8 bg-white border-slate-200 text-slate-600 disabled:opacity-40 cursor-pointer"
					aria-label="Last page"
				>
					<ChevronsRight className="w-4 h-4" />
				</Button>
			</div>
		</div>
	);
}

export default AuthoritiesPagination;
