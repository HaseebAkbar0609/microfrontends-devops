"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { MATERIAL_PAGE_SIZE_OPTIONS } from "../../constants/materialStorage.constants";

const ROWS_PER_PAGE_LABEL_ID = "material-rows-per-page-label";

interface MaterialTablePaginationProps {
	page: number;
	pageSize: number;
	totalItems: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (pageSize: number) => void;
}

/**
 * Pager from the Materialhantering frames: rows per page on the left; page count,
 * first/previous, the current page and next/last on the right.
 */
export function MaterialTablePagination({
	page,
	pageSize,
	totalItems,
	onPageChange,
	onPageSizeChange,
}: MaterialTablePaginationProps) {
	const t = useTranslate();
	const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

	return (
		<nav
			aria-label={t(localizationConstants.materialPaginationLabel)}
			className="flex flex-wrap items-center justify-between gap-4 px-4 py-4"
		>
			<div className="flex items-center gap-3">
				<span id={ROWS_PER_PAGE_LABEL_ID} className="text-sm text-slate-700">
					<Translate text={localizationConstants.rowsPerPageLabel} />
				</span>
				<Select value={String(pageSize)} onValueChange={(value) => onPageSizeChange(Number(value))}>
					<SelectTrigger aria-labelledby={ROWS_PER_PAGE_LABEL_ID} className="w-20 cursor-pointer bg-white">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{MATERIAL_PAGE_SIZE_OPTIONS.map((size) => (
							<SelectItem key={size} value={String(size)} className="cursor-pointer">
								{size}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="flex flex-wrap items-center gap-6">
				<span className="text-sm text-slate-700">
					<Translate text={localizationConstants.pageLabel} /> {page}{" "}
					<Translate text={localizationConstants.ofLabel} /> {totalPages}
				</span>
				<div className="flex items-center gap-2">
					<PagerButton icon={ChevronsLeft} label={localizationConstants.materialFirstPage} disabled={page <= 1} onClick={() => onPageChange(1)} />
					<PagerButton icon={ChevronLeft} label={localizationConstants.materialPreviousPage} disabled={page <= 1} onClick={() => onPageChange(page - 1)} />
					<span
						aria-current="page"
						className="flex h-10 min-w-10 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900"
					>
						{page}
					</span>
					<PagerButton icon={ChevronRight} label={localizationConstants.materialNextPage} disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} />
					<PagerButton icon={ChevronsRight} label={localizationConstants.materialLastPage} disabled={page >= totalPages} onClick={() => onPageChange(totalPages)} />
				</div>
			</div>
		</nav>
	);
}

interface PagerButtonProps {
	icon: LucideIcon;
	label: TranslationKeys;
	disabled: boolean;
	onClick: () => void;
}

function PagerButton({ icon: Icon, label, disabled, onClick }: PagerButtonProps) {
	const t = useTranslate();
	return (
		<Button
			variant="outline"
			size="icon"
			aria-label={t(label)}
			disabled={disabled}
			onClick={onClick}
			className="h-10 w-10 cursor-pointer border-slate-200 bg-white text-slate-600 shadow-none hover:bg-slate-50 disabled:opacity-40"
		>
			<Icon className="h-4 w-4" aria-hidden />
		</Button>
	);
}
