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
import { CLAIM_TEMPLATES_PAGE_SIZE_OPTIONS } from "../../../constants/claims.constants";

interface ClaimTemplatesPaginationProps {
	currentPage: number;
	totalPages: number;
	pageSize: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
}

export function ClaimTemplatesPagination({
	currentPage,
	totalPages,
	pageSize,
	onPageChange,
	onPageSizeChange,
}: ClaimTemplatesPaginationProps) {
	return (
		<div className="flex flex-col sm:flex-row items-center justify-end gap-6 pt-4 text-xs text-slate-600">
			{/* Rader per sida */}
			<div className="flex items-center gap-2">
				<span className="font-normal text-slate-700">
					<Translate text={localizationConstants.claimTplRaderPerSida} />
				</span>
				<Select
					value={String(pageSize)}
					onValueChange={(val) => onPageSizeChange(Number(val))}
				>
					<SelectTrigger className="h-8 w-16 bg-white border-slate-200 text-xs rounded-md shadow-2xs">
						<SelectValue placeholder={String(pageSize)} />
					</SelectTrigger>
					<SelectContent className="bg-white border-slate-200 text-xs shadow-md">
						{CLAIM_TEMPLATES_PAGE_SIZE_OPTIONS.map((size) => (
							<SelectItem key={size} value={String(size)} className="text-xs">
								{size}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Page X of Y */}
			<div className="text-xs font-medium text-slate-700 whitespace-nowrap">
				Page {currentPage} of {totalPages}
			</div>

			{/* Navigation Buttons: « ‹ › » */}
			<div className="flex items-center gap-1.5">
				{/* First page « */}
				<button
					type="button"
					onClick={() => onPageChange(1)}
					disabled={currentPage <= 1}
					className="h-8 w-8 flex items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-2xs cursor-pointer"
					title="Första sidan"
				>
					<ChevronsLeft className="w-3.5 h-3.5" />
				</button>

				{/* Previous page ‹ */}
				<button
					type="button"
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage <= 1}
					className="h-8 w-8 flex items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-2xs cursor-pointer"
					title="Föregående sida"
				>
					<ChevronLeft className="w-3.5 h-3.5" />
				</button>

				{/* Next page › */}
				<button
					type="button"
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage >= totalPages}
					className="h-8 w-8 flex items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-2xs cursor-pointer"
					title="Nästa sida"
				>
					<ChevronRight className="w-3.5 h-3.5" />
				</button>

				{/* Last page » */}
				<button
					type="button"
					onClick={() => onPageChange(totalPages)}
					disabled={currentPage >= totalPages}
					className="h-8 w-8 flex items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-2xs cursor-pointer"
					title="Sista sidan"
				>
					<ChevronsRight className="w-3.5 h-3.5" />
				</button>
			</div>
		</div>
	);
}

export default ClaimTemplatesPagination;
