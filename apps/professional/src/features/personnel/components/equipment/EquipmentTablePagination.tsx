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
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";

interface EquipmentTablePaginationProps {
	currentPage: number;
	totalPages: number;
	pageSize: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
}

export function EquipmentTablePagination({
	currentPage,
	totalPages,
	pageSize,
	onPageChange,
	onPageSizeChange,
}: EquipmentTablePaginationProps) {
	const { t } = useTranslation();

	const pageLabel = t(localizationConstants.pageOfLabel, {
		current: currentPage,
		total: totalPages || 1,
	});

	return (
		<div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-slate-200 bg-white text-xs text-slate-600">
			{/* Page size dropdown */}
			<div className="flex items-center gap-2">
				<span className="text-slate-500">
					<Translate text={localizationConstants.rowsPerPageLabel} />
				</span>
				<Select
					value={String(pageSize)}
					onValueChange={(val) => onPageSizeChange(Number(val))}
				>
					<SelectTrigger className="h-8 w-18 text-xs bg-white border-slate-200 shadow-2xs cursor-pointer">
						<SelectValue />
					</SelectTrigger>
					<SelectContent className="text-xs">
						<SelectItem value="5" className="cursor-pointer text-xs">
							5
						</SelectItem>
						<SelectItem value="10" className="cursor-pointer text-xs">
							10
						</SelectItem>
						<SelectItem value="25" className="cursor-pointer text-xs">
							25
						</SelectItem>
						<SelectItem value="50" className="cursor-pointer text-xs">
							50
						</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Page indicator & controls */}
			<div className="flex items-center gap-3">
				<span className="text-slate-600 font-medium">{pageLabel}</span>
				<div className="flex items-center gap-1">
					<Button
						type="button"
						variant="outline"
						size="icon"
						onClick={() => onPageChange(Math.max(1, currentPage - 1))}
						disabled={currentPage <= 1}
						className="h-8 w-8 p-0 border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-2xs"
					>
						<ChevronLeft className="w-4 h-4" />
					</Button>
					<Button
						type="button"
						variant="outline"
						size="icon"
						onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
						disabled={currentPage >= totalPages}
						className="h-8 w-8 p-0 border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-2xs"
					>
						<ChevronRight className="w-4 h-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
