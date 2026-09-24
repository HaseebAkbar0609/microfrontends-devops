"use client";

import React from "react";
import { Search, ChevronDown, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useTranslation } from "react-i18next";
import type { CaseCategory, CaseStatus } from "../../types/cases.types";
import { CASE_CATEGORIES } from "../../constants/cases.constants";
import { getCategoryLabelKey } from "./shared";

interface CasesToolbarProps {
	searchQuery: string;
	onSearchChange: (query: string) => void;
	statusFilter: CaseStatus | "all";
	onStatusFilterChange: (status: CaseStatus | "all") => void;
	categoryFilter: CaseCategory | "all";
	onCategoryFilterChange: (category: CaseCategory | "all") => void;
}

export function CasesToolbar({
	searchQuery,
	onSearchChange,
	statusFilter,
	onStatusFilterChange,
	categoryFilter,
	onCategoryFilterChange,
}: CasesToolbarProps) {
	const { t } = useTranslation();

	const hasActiveFilters = statusFilter !== "all" || categoryFilter !== "all";

	const resetFilters = () => {
		onStatusFilterChange("all");
		onCategoryFilterChange("all");
	};

	return (
		<div className="flex items-center gap-3 w-full sm:w-auto">
			{/* Search input matching Figma Image 1 */}
			<div className="relative w-full sm:w-64">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
				<Input
					type="text"
					value={searchQuery}
					onChange={(e) => onSearchChange(e.target.value)}
					placeholder={t(localizationConstants.casesSearchPlaceholder)}
					className="pl-9 h-9 text-xs bg-white border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-slate-400"
				/>
			</div>

			{/* Filter dropdown button matching Figma Image 1 */}
			<Popover>
				<PopoverTrigger asChild>
					<Button
						type="button"
						variant="outline"
						className={`h-9 px-3.5 bg-white hover:bg-slate-50 border-slate-200 rounded-lg text-xs font-medium text-slate-700 gap-2 cursor-pointer transition-colors ${
							hasActiveFilters ? "border-slate-800 text-slate-900 bg-slate-50" : ""
						}`}
					>
						<Filter className="w-3.5 h-3.5 text-slate-500" />
						<Translate text={localizationConstants.casesFilterBtn} />
						<ChevronDown className="w-3.5 h-3.5 text-slate-400" />
					</Button>
				</PopoverTrigger>
				<PopoverContent align="start" className="w-64 p-4 space-y-3 bg-white border border-slate-200 rounded-xl shadow-lg">
					<div className="flex items-center justify-between pb-2 border-b border-slate-100">
						<span className="text-xs font-semibold text-slate-900">
							<Translate text={localizationConstants.casesFilterBtn} />
						</span>
						{hasActiveFilters && (
							<button
								type="button"
								onClick={resetFilters}
								className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
							>
								<X className="w-3 h-3" />
								<Translate text={localizationConstants.resetFilter} />
							</button>
						)}
					</div>

					{/* Status filter */}
					<div className="space-y-1.5">
						<label className="text-[11px] font-medium text-slate-600">
							<Translate text={localizationConstants.casesColStatus} />
						</label>
						<Select
							value={statusFilter}
							onValueChange={(val) => onStatusFilterChange(val as CaseStatus | "all")}
						>
							<SelectTrigger className="h-8 text-xs bg-white border-slate-200">
								<SelectValue placeholder={t(localizationConstants.casesStatusAll)} />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all" className="text-xs cursor-pointer">
									<Translate text={localizationConstants.casesStatusAll} />
								</SelectItem>
								<SelectItem value="ongoing" className="text-xs cursor-pointer">
									<Translate text={localizationConstants.casesStatusOngoing} />
								</SelectItem>
								<SelectItem value="not_started" className="text-xs cursor-pointer">
									<Translate text={localizationConstants.casesStatusNotStarted} />
								</SelectItem>
								<SelectItem value="completed" className="text-xs cursor-pointer">
									<Translate text={localizationConstants.casesStatusCompleted} />
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Category filter */}
					<div className="space-y-1.5">
						<label className="text-[11px] font-medium text-slate-600">
							<Translate text={localizationConstants.casesColCategory} />
						</label>
						<Select
							value={categoryFilter}
							onValueChange={(val) => onCategoryFilterChange(val as CaseCategory | "all")}
						>
							<SelectTrigger className="h-8 text-xs bg-white border-slate-200">
								<SelectValue placeholder={t(localizationConstants.casesCategoryAll)} />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all" className="text-xs cursor-pointer">
									<Translate text={localizationConstants.casesCategoryAll} />
								</SelectItem>
								{CASE_CATEGORIES.map((cat: CaseCategory) => (
									<SelectItem key={cat} value={cat} className="text-xs cursor-pointer">
										<Translate text={getCategoryLabelKey(cat)} />
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}

export default CasesToolbar;
