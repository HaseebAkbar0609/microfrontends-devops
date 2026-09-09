"use client";

import React from "react";
import {
	ChevronsLeft,
	ChevronLeft,
	ChevronRight,
	ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
import { PAGE_SIZE_OPTIONS } from "../../../constants/personnelOverview.constants";

interface PersonnelTablePaginationProps {
	currentPage: number;
	totalPages: number;
	pageSize: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
}

export function PersonnelTablePagination({
	currentPage,
	totalPages,
	pageSize,
	onPageChange,
	onPageSizeChange,
}: PersonnelTablePaginationProps) {
	const { t } = useTranslation();

	return (
		<div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 border-t border-slate-200 bg-white text-xs text-slate-600">
			<div className="flex items-center gap-2">
				<span className="text-slate-600 font-normal">
					<Translate text={localizationConstants.rowsPerPageLabel} />
				</span>
				<Select
					value={String(pageSize)}
					onValueChange={(val) => {
						onPageSizeChange(Number(val));
						onPageChange(1);
					}}
				>
					<SelectTrigger className="h-7 w-16 text-xs bg-white border-slate-200">
						<SelectValue placeholder={String(pageSize)} />
					</SelectTrigger>
					<SelectContent>
						{PAGE_SIZE_OPTIONS.map((opt) => (
							<SelectItem key={opt} value={String(opt)} className="text-xs">
								{opt}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="flex items-center gap-4">
				<span className="text-slate-700 font-medium">
					<Translate
						text={localizationConstants.pageOfLabel}
						values={{ current: currentPage, page: currentPage, total: totalPages }}
					/>
				</span>

				<div className="flex items-center gap-1">
					<Button
						type="button"
						variant="outline"
						size="icon"
						disabled={currentPage <= 1}
						onClick={() => onPageChange(1)}
						className="h-7 w-7 p-0 border-slate-200 text-slate-600 hover:text-slate-900 disabled:opacity-40"
						aria-label={t(localizationConstants.paginationFirstPage)}
					>
						<ChevronsLeft className="w-3.5 h-3.5" />
					</Button>
					<Button
						type="button"
						variant="outline"
						size="icon"
						disabled={currentPage <= 1}
						onClick={() => onPageChange(currentPage - 1)}
						className="h-7 w-7 p-0 border-slate-200 text-slate-600 hover:text-slate-900 disabled:opacity-40"
						aria-label={t(localizationConstants.paginationPreviousPage)}
					>
						<ChevronLeft className="w-3.5 h-3.5" />
					</Button>
					<Button
						type="button"
						variant="outline"
						size="icon"
						disabled={currentPage >= totalPages}
						onClick={() => onPageChange(currentPage + 1)}
						className="h-7 w-7 p-0 border-slate-200 text-slate-600 hover:text-slate-900 disabled:opacity-40"
						aria-label={t(localizationConstants.paginationNextPage)}
					>
						<ChevronRight className="w-3.5 h-3.5" />
					</Button>
					<Button
						type="button"
						variant="outline"
						size="icon"
						disabled={currentPage >= totalPages}
						onClick={() => onPageChange(totalPages)}
						className="h-7 w-7 p-0 border-slate-200 text-slate-600 hover:text-slate-900 disabled:opacity-40"
						aria-label={t(localizationConstants.paginationLastPage)}
					>
						<ChevronsRight className="w-3.5 h-3.5" />
					</Button>
				</div>
			</div>
		</div>
	);
}
