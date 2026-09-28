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
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
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
		<div className="flex items-center gap-6 text-sm text-slate-600 flex-wrap justify-center sm:justify-end py-2 px-1">
			{/* Rows per page */}
			<div className="flex items-center gap-2">
				<span className="text-sm font-medium text-slate-700">
					<Translate text={localizationConstants.rowsPerPageLabel} />
				</span>
				<Select
					value={String(pageSize)}
					onValueChange={(val) => {
						onPageSizeChange(Number(val));
						onPageChange(1);
					}}
				>
					<SelectTrigger className="h-9 w-18 border-slate-200 bg-transparent text-sm font-medium text-slate-700 hover:bg-slate-50 focus:ring-0">
						<SelectValue placeholder={String(pageSize)} />
					</SelectTrigger>
					<SelectContent>
						{YEAR_END_PAGE_SIZE_OPTIONS.map((opt) => (
							<SelectItem key={opt} value={String(opt)}>
								{opt}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Page counter */}
			<div className="text-sm font-medium text-slate-700 select-none flex items-center gap-1">
				<Translate text={localizationConstants.pageLabel} />
				<span>{currentPage}</span>
				<Translate text={localizationConstants.ofLabel} />
				<span>{totalPages}</span>
			</div>

			{/* Nav buttons */}
			<div className="flex items-center gap-1">
				<Button
					type="button"
					variant="outline"
					size="icon"
					disabled={currentPage <= 1}
					onClick={() => onPageChange(1)}
					className="h-9 w-9 rounded-md border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
					aria-label="First page"
				>
					<ChevronsLeft className="h-4 w-4" />
				</Button>

				<Button
					type="button"
					variant="outline"
					size="icon"
					disabled={currentPage <= 1}
					onClick={() => onPageChange(currentPage - 1)}
					className="h-9 w-9 rounded-md border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
					aria-label="Previous page"
				>
					<ChevronLeft className="h-4 w-4" />
				</Button>

				<Button
					type="button"
					variant="outline"
					size="icon"
					disabled={currentPage >= totalPages}
					onClick={() => onPageChange(currentPage + 1)}
					className="h-9 w-9 rounded-md border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
					aria-label="Next page"
				>
					<ChevronRight className="h-4 w-4" />
				</Button>

				<Button
					type="button"
					variant="outline"
					size="icon"
					disabled={currentPage >= totalPages}
					onClick={() => onPageChange(totalPages)}
					className="h-9 w-9 rounded-md border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
					aria-label="Last page"
				>
					<ChevronsRight className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}


export default YearEndPagination;
