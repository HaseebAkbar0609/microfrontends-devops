"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
	const startItem = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
	const endItem = Math.min(page * pageSize, totalItems);

	return (
		<div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-200 bg-white">
			<div className="flex items-center gap-2 text-xs text-slate-500">
				<span>
					<Translate text={localizationConstants.casesRowsPerPage} />:
				</span>
				<Select
					value={String(pageSize)}
					onValueChange={(val) => onPageSizeChange(Number(val))}
				>
					<SelectTrigger className="h-8 w-16 text-xs bg-white border-slate-200">
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

			<div className="flex items-center gap-4 text-xs text-slate-500">
				<span>
					{startItem}-{endItem} <Translate text={localizationConstants.casesPageOf} /> {totalItems}
				</span>

				<div className="flex items-center gap-1">
					<Button
						type="button"
						variant="outline"
						size="sm"
						disabled={page <= 1}
						onClick={() => onPageChange(page - 1)}
						className="h-8 w-8 p-0 border-slate-200 cursor-pointer disabled:opacity-40"
					>
						<ChevronLeft className="w-4 h-4" />
					</Button>
					<Button
						type="button"
						variant="outline"
						size="sm"
						disabled={page >= totalPages}
						onClick={() => onPageChange(page + 1)}
						className="h-8 w-8 p-0 border-slate-200 cursor-pointer disabled:opacity-40"
					>
						<ChevronRight className="w-4 h-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}

export default CasesTablePagination;
