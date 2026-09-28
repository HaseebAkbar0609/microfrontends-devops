"use client";

import React from "react";
import { Plus, Filter } from "lucide-react";
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

interface BudgetToolbarProps {
	searchQuery: string;
	onSearchChange: (val: string) => void;
	statusFilter: "all" | "active" | "inactive" | "overhead";
	onStatusFilterChange: (
		val: "all" | "active" | "inactive" | "overhead",
	) => void;
	onCreateClick: () => void;
}

export function BudgetToolbar({
	searchQuery,
	onSearchChange,
	statusFilter,
	onStatusFilterChange,
	onCreateClick,
}: BudgetToolbarProps) {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
			{/* Left side: Search & Filter */}
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto flex-1">
				{/* Search bar */}
				<Search
					value={searchQuery}
					onChange={onSearchChange}
					placeholder={t(localizationConstants.searchBudgetsPlaceholder)}
					className="h-10 w-full"
					wrapperClassName="w-full sm:w-[240px] md:w-[260px] lg:w-[300px]"
				/>

				{/* Filter dropdown */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							type="button"
							variant="outline"
							className="h-10 px-3.5 bg-white border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-normal rounded-lg shadow-2xs gap-1.5 cursor-pointer justify-between sm:justify-start"
						>
							<Filter className="w-3.5 h-3.5 text-slate-500" />
							<Translate
								text={
									statusFilter === "active"
										? localizationConstants.filterActiveBudgets
										: statusFilter === "inactive"
											? localizationConstants.filterInactiveBudgets
											: statusFilter === "overhead"
												? localizationConstants.filterOverheadBudgets
												: localizationConstants.filterAllBudgets
								}
							/>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-44 bg-white border-slate-200 shadow-md">
						<DropdownMenuItem
							onClick={() => onStatusFilterChange("all")}
							className="cursor-pointer text-xs focus:bg-slate-100"
						>
							<Translate text={localizationConstants.filterAllBudgets} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onStatusFilterChange("active")}
							className="cursor-pointer text-xs focus:bg-slate-100"
						>
							<Translate text={localizationConstants.filterActiveBudgets} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onStatusFilterChange("inactive")}
							className="cursor-pointer text-xs focus:bg-slate-100"
						>
							<Translate text={localizationConstants.filterInactiveBudgets} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onStatusFilterChange("overhead")}
							className="cursor-pointer text-xs focus:bg-slate-100"
						>
							<Translate text={localizationConstants.filterOverheadBudgets} />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Right side: Actions */}
			<div className="flex items-center justify-end">
				<Button
					type="button"
					onClick={onCreateClick}
					className="h-10 px-4 bg-[#111721] hover:bg-slate-800 text-white font-medium text-sm rounded-lg shadow-2xs gap-2 cursor-pointer transition-colors w-full sm:w-auto justify-center"
				>
					<Plus className="w-4 h-4" />
					<Translate text={localizationConstants.btnCreateBudget} />
				</Button>
			</div>
		</div>
	);
}

