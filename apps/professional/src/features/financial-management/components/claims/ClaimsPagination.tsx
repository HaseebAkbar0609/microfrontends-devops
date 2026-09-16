"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { CLAIMS_PAGE_SIZE_OPTIONS } from "../../constants/claims.constants";

interface ClaimsPaginationProps {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	pageSize: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
}

export function ClaimsPagination({
	currentPage,
	totalPages,
	totalItems,
	pageSize,
	onPageChange,
	onPageSizeChange,
}: ClaimsPaginationProps) {
	if (totalItems === 0) return null;

	const startIdx = (currentPage - 1) * pageSize + 1;
	const endIdx = Math.min(currentPage * pageSize, totalItems);

	return (
		<div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 select-none">
			<div className="flex items-center gap-4 text-xs text-slate-500">
				<div className="flex items-center gap-1.5">
					<Translate text={localizationConstants.rowsPerPageLabelYearEnd} />:
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								type="button"
								variant="outline"
								size="sm"
								className="h-8 px-2.5 bg-white border-slate-200 text-xs font-medium text-slate-700 rounded-md shadow-2xs cursor-pointer"
							>
								{pageSize}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="min-w-16">
							{CLAIMS_PAGE_SIZE_OPTIONS.map((opt) => (
								<DropdownMenuItem
									key={opt}
									onClick={() => onPageSizeChange(opt)}
									className="cursor-pointer text-xs"
								>
									{opt}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<span>
					{startIdx} - {endIdx} <Translate text={localizationConstants.pageOfLabelYearEnd} /> {totalItems}
				</span>
			</div>

			<div className="flex items-center gap-1.5">
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage <= 1}
					className="h-8 w-8 p-0 bg-white border-slate-200 text-slate-700 disabled:opacity-40 rounded-md shadow-2xs cursor-pointer"
				>
					<ChevronLeft className="w-4 h-4" />
				</Button>

				<span className="text-xs font-medium text-slate-700 px-2">
					<Translate text={localizationConstants.pageLabelYearEnd} /> {currentPage} / {totalPages}
				</span>

				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage >= totalPages}
					className="h-8 w-8 p-0 bg-white border-slate-200 text-slate-700 disabled:opacity-40 rounded-md shadow-2xs cursor-pointer"
				>
					<ChevronRight className="w-4 h-4" />
				</Button>
			</div>
		</div>
	);
}

export default ClaimsPagination;
