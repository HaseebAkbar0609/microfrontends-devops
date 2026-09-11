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
import localizationConstants from "@/utils/translation/constants";
import { CERTIFICATES_PAGE_SIZE_OPTIONS } from "../../constants/certificates.constants";

interface CertificatesTablePaginationProps {
	currentPage: number;
	pageSize: number;
	totalCount: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
}

export function CertificatesTablePagination({
	currentPage,
	pageSize,
	totalCount: _totalCount,
	totalPages,
	onPageChange,
	onPageSizeChange,
}: CertificatesTablePaginationProps) {
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
					<SelectTrigger className="w-[70px] h-8 text-xs bg-white border-slate-200">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{CERTIFICATES_PAGE_SIZE_OPTIONS.map((opt) => (
							<SelectItem key={opt} value={String(opt)}>
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
					className="h-8 w-8 border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
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
					className="h-8 w-8 border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
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
					className="h-8 w-8 border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
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
					className="h-8 w-8 border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
					aria-label="Last page"
				>
					<ChevronsRight className="w-4 h-4" />
				</Button>
			</div>
		</div>
	);
}
