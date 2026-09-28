import React from "react";
import { Plus, Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Search } from "@/components/search/Search";
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
import { AVAILABLE_FISCAL_YEARS } from "../../constants/yearEnd.constants";
import type { YearEndCategory } from "../../types/yearEnd.types";

interface YearEndToolbarProps {
	searchQuery: string;
	onSearchChange: (q: string) => void;
	categoryFilter: string;
	onCategoryFilterChange: (cat: string) => void;
	selectedYear: number;
	onYearChange: (year: number) => void;
	onCreateClick: () => void;
}

export function YearEndToolbar({
	searchQuery,
	onSearchChange,
	categoryFilter,
	onCategoryFilterChange,
	selectedYear,
	onYearChange,
	onCreateClick,
}: YearEndToolbarProps) {
	const { t } = useTranslation();

	const filterDisplayLabel =
		categoryFilter !== "all"
			? getYearEndCategoryLabel(categoryFilter as YearEndCategory, t)
			: t(localizationConstants.filter);

	return (
		<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
			{/* Left: Search & Filters */}
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto flex-1">
				{/* Search */}
				<Search
					value={searchQuery}
					onChange={onSearchChange}
					placeholder={t(localizationConstants.searchPlaceholderYearEnd)}
					className="h-10 w-full"
					wrapperClassName="w-full sm:w-[240px] md:w-[260px] lg:w-[300px]"
				/>

				{/* Filter Dropdown */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							className="h-10 px-3.5 bg-white border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-normal rounded-lg shadow-2xs gap-1.5 cursor-pointer justify-between sm:justify-start"
						>
							<Filter className="w-3.5 h-3.5 text-slate-500" />
							<span>{filterDisplayLabel}</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-48 bg-white border-slate-200 shadow-md">
						<DropdownMenuItem
							onClick={() => onCategoryFilterChange("all")}
							className="cursor-pointer text-xs focus:bg-slate-100"
						>
							<Translate text={localizationConstants.filterAllCategoriesYearEnd} />
						</DropdownMenuItem>
						{YEAR_END_CATEGORY_OPTIONS.map((opt) => (
							<DropdownMenuItem
								key={opt.value}
								onClick={() => onCategoryFilterChange(opt.value)}
								className="cursor-pointer text-xs focus:bg-slate-100"
							>
								{getYearEndCategoryLabel(opt.value, t)}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>

				{/* Inline Year Selector */}
				<div className="relative inline-block w-full sm:w-32">
					<select
						value={selectedYear}
						onChange={(e) => onYearChange(Number(e.target.value))}
						aria-label={t(localizationConstants.labelYear)}
						className="w-full h-10 appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-8 text-xs font-semibold text-slate-800 shadow-2xs focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer"
					>
						{AVAILABLE_FISCAL_YEARS.map((year) => (
							<option key={year} value={year}>
								{year}
							</option>
						))}
					</select>
					<ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
				</div>
			</div>

			{/* Right: + Add new */}
			<div className="flex items-center justify-end">
				<Button
					onClick={onCreateClick}
					className="h-10 px-4 bg-[#111721] hover:bg-slate-800 text-white font-medium text-sm rounded-lg shadow-2xs gap-2 cursor-pointer transition-colors w-full sm:w-auto justify-center"
				>
					<Plus className="w-4 h-4" />
					<Translate text={localizationConstants.btnAddYearEnd} />
				</Button>
			</div>
		</div>
	);
}


export default YearEndToolbar;
