"use client";

import React from "react";
import { ChevronDown, Printer, Plus } from "lucide-react";
import { Search } from "@/components/search/Search";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { DOCUMENTS_CONSTANTS } from "../constants/documents.constants";

interface DocumentsToolbarProps {
	searchQuery: string;
	onSearchChange: (value: string) => void;
	categoryFilter: string;
	onCategoryFilterChange: (category: string) => void;
	availableCategories: string[];
	onOpenUploadModal: () => void;
	onPrint: () => void;
}

export function DocumentsToolbar({
	searchQuery,
	onSearchChange,
	categoryFilter,
	onCategoryFilterChange,
	availableCategories,
	onOpenUploadModal,
	onPrint,
}: DocumentsToolbarProps) {
	const t = useTranslate();

	return (
		<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2 print:hidden">
			{/* Left: Reusable Search + Dropdown Filter */}
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
				<Search
					value={searchQuery}
					onChange={onSearchChange}
					placeholder={localizationConstants.search}
					className="h-10 w-full"
					wrapperClassName="w-full sm:w-[240px] md:w-[280px]"
				/>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							className="h-10 w-full sm:w-auto min-w-[90px] rounded-lg border-slate-200 text-slate-700 font-normal bg-white hover:bg-slate-50 gap-1.5 px-3 text-xs shadow-none justify-between cursor-pointer"
						>
							<span>
								{categoryFilter === DOCUMENTS_CONSTANTS.FILTER_ALL ? (
									<Translate text={localizationConstants.filter} />
								) : (
									categoryFilter
								)}
							</span>
							<ChevronDown className="h-3.5 w-3.5 text-slate-500 shrink-0" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="start"
						className="w-44 border border-slate-200 bg-white shadow-md rounded-lg p-1 z-30"
					>
						<DropdownMenuItem
							onClick={() => onCategoryFilterChange(DOCUMENTS_CONSTANTS.FILTER_ALL)}
							className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
						>
							<Translate text={localizationConstants.orderHandlingarFilterAll} />
						</DropdownMenuItem>
						{availableCategories.map((cat) => (
							<DropdownMenuItem
								key={cat}
								onClick={() => onCategoryFilterChange(cat)}
								className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
							>
								{cat}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Right: Print + + Upload Action */}
			<div className="flex items-center justify-end gap-2 sm:gap-3 w-full sm:w-auto">
				{/* Print button */}
				<Button
					type="button"
					variant="outline"
					size="icon"
					onClick={onPrint}
					title={t(localizationConstants.print)}
				>
					<Printer className="h-4 w-4" />
				</Button>

				{/* Upload Document Button */}
				<Button
					type="button"
					onClick={onOpenUploadModal}
					className="h-10 px-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg shrink-0 flex items-center gap-2 cursor-pointer shadow-none"
				>
					<Plus className="h-4 w-4" />
					<span>
						<Translate text={localizationConstants.orderHandlingarBtnUpload} />
					</span>
				</Button>
			</div>
		</div>
	);
}

export default DocumentsToolbar;
