"use client";

import React from "react";
import { Search, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import {
	YEAR_END_CATEGORY_OPTIONS,
	getYearEndCategoryLabel,
} from "../../utils/yearEndLocalization";
import type { YearEndCategory } from "../../types/yearEnd.types";

interface YearEndToolbarProps {
	searchQuery: string;
	onSearchChange: (q: string) => void;
	categoryFilter: string;
	onCategoryFilterChange: (cat: string) => void;
	onCreateClick: () => void;
}

export function YearEndToolbar({
	searchQuery,
	onSearchChange,
	categoryFilter,
	onCategoryFilterChange,
	onCreateClick,
}: YearEndToolbarProps) {
	const { t } = useTranslation();

	const filterDisplayLabel =
		categoryFilter !== "all"
			? getYearEndCategoryLabel(categoryFilter as YearEndCategory, t)
			: t(localizationConstants.filter);

	return (
		<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
			{/* Left: Search & Filter */}
			<div className="flex items-center gap-3 flex-1 max-w-md">
				{/* Search */}
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
					<Input
						type="text"
						value={searchQuery}
						onChange={(e) => onSearchChange(e.target.value)}
						placeholder={t(localizationConstants.searchPlaceholderYearEnd)}
						className="pl-9 h-9 bg-white border-slate-200 text-xs rounded-lg shadow-2xs focus-visible:ring-1 focus-visible:ring-slate-400"
					/>
				</div>

				{/* Filter Dropdown */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							size="sm"
							className="h-9 gap-1.5 border-slate-200 bg-white text-xs text-slate-700 shadow-2xs hover:bg-slate-50 cursor-pointer"
						>
							<Filter className="h-3.5 w-3.5 text-slate-500" />
							<span>{filterDisplayLabel}</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-48">
						<DropdownMenuItem
							onClick={() => onCategoryFilterChange("all")}
							className="cursor-pointer text-xs"
						>
							<Translate text={localizationConstants.filterAllCategoriesYearEnd} />
						</DropdownMenuItem>
						{YEAR_END_CATEGORY_OPTIONS.map((opt) => (
							<DropdownMenuItem
								key={opt.value}
								onClick={() => onCategoryFilterChange(opt.value)}
								className="cursor-pointer text-xs"
							>
								{getYearEndCategoryLabel(opt.value, t)}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Right: + Add new */}
			<div>
				<Button
					onClick={onCreateClick}
					size="sm"
					className="h-9 px-4 bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 rounded-lg shadow-2xs gap-1.5 cursor-pointer"
				>
					<Plus className="h-4 w-4" />
					<span>
						<Translate text={localizationConstants.btnAddYearEnd} />
					</span>
				</Button>
			</div>
		</div>
	);
}

export default YearEndToolbar;
