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
import { PAGE_SIZE_OPTIONS } from "../../constants/rotRut.constants";

interface RotRutTablePaginationProps {
	currentPage: number;
	pageSize: number;
	totalCount: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
}

export function RotRutTablePagination({
	currentPage,
	pageSize,
	totalCount,
	totalPages,
	onPageChange,
	onPageSizeChange,
}: RotRutTablePaginationProps) {
	return (
		<div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-200/80 text-xs text-slate-600">
			<div className="flex items-center gap-2">
				<Translate text={localizationConstants.rotRutPaginationShowing} />
				<Select
					value={String(pageSize)}
					onValueChange={(val) => onPageSizeChange(Number(val))}
				>
					<SelectTrigger className="w-[70px] h-7 text-xs bg-white">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{PAGE_SIZE_OPTIONS.map((opt) => (
							<SelectItem key={opt} value={String(opt)}>
								{opt}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<span>
					<Translate text={localizationConstants.rotRutPaginationOf} /> {totalCount}{" "}
					<Translate text={localizationConstants.rotRutPaginationRows} />
				</span>
			</div>

			<div className="flex items-center gap-1">
				<Button
					type="button"
					variant="outline"
					size="icon"
					disabled={currentPage <= 1}
					onClick={() => onPageChange(currentPage - 1)}
					className="h-7 w-7 border-slate-200"
				>
					<ChevronLeft className="w-3.5 h-3.5" />
				</Button>
				<span className="px-2 font-medium">
					<Translate text={localizationConstants.rotRutPaginationPage} /> {currentPage}{" "}
					<Translate text={localizationConstants.rotRutPaginationOf} /> {totalPages}
				</span>
				<Button
					type="button"
					variant="outline"
					size="icon"
					disabled={currentPage >= totalPages}
					onClick={() => onPageChange(currentPage + 1)}
					className="h-7 w-7 border-slate-200"
				>
					<ChevronRight className="w-3.5 h-3.5" />
				</Button>
			</div>
		</div>
	);
}
