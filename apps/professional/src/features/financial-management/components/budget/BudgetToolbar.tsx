"use client";

import React from "react";
import { Search, Plus, Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface BudgetToolbarProps {
	searchQuery: string;
	onSearchChange: (val: string) => void;
	statusFilter: "all" | "active" | "inactive" | "overhead";
	onStatusFilterChange: (
		val: "all" | "active" | "inactive" | "overhead",
	) => void;
	onCreateClick: () => void;
	onResetSeedData: () => void;
}

export function BudgetToolbar({
	searchQuery,
	onSearchChange,
	statusFilter,
	onStatusFilterChange,
	onCreateClick,
	onResetSeedData,
}: BudgetToolbarProps) {
	return (
		<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
			{/* Left side: Search & Filter */}
			<div className="flex items-center gap-2.5 flex-1 max-w-xl">
				{/* Search bar */}
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
					<Input
						type="text"
						value={searchQuery}
						onChange={(e) => onSearchChange(e.target.value)}
						placeholder={localizationConstants.searchBudgetsPlaceholder}
						className="pl-9 h-10 bg-white border-slate-200 text-sm placeholder:text-slate-400 rounded-lg shadow-2xs focus-visible:ring-slate-400"
					/>
				</div>

				{/* Filter dropdown */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							type="button"
							variant="outline"
							className="h-10 px-3.5 bg-white border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg shadow-2xs gap-1.5 cursor-pointer"
						>
							<Filter className="w-4 h-4 text-slate-500" />
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
					<DropdownMenuContent align="start" className="w-44">
						<DropdownMenuItem
							onClick={() => onStatusFilterChange("all")}
							className="cursor-pointer"
						>
							<Translate text={localizationConstants.filterAllBudgets} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onStatusFilterChange("active")}
							className="cursor-pointer"
						>
							<Translate text={localizationConstants.filterActiveBudgets} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onStatusFilterChange("inactive")}
							className="cursor-pointer"
						>
							<Translate text={localizationConstants.filterInactiveBudgets} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onStatusFilterChange("overhead")}
							className="cursor-pointer"
						>
							<Translate text={localizationConstants.filterOverheadBudgets} />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Right side: Actions */}
			<div className="flex items-center gap-2">
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={onResetSeedData}
					className="h-10 text-xs text-slate-500 hover:text-slate-800 gap-1.5 cursor-pointer"
					title="Reset demo data"
				>
					<RotateCcw className="w-3.5 h-3.5" />
					<Translate text={localizationConstants.btnResetSeedData} />
				</Button>

				<Button
					type="button"
					onClick={onCreateClick}
					className="h-10 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg shadow-sm gap-2 cursor-pointer transition-colors"
				>
					<Plus className="w-4 h-4" />
					<Translate text={localizationConstants.btnCreateBudget} />
				</Button>
			</div>
		</div>
	);
}
