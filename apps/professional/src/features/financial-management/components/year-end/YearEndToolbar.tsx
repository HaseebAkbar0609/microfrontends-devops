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
import { YEAR_END_CATEGORIES_LIST } from "../../constants/yearEnd.constants";

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
						placeholder="Sök"
						className="pl-9 h-9 bg-white border-slate-200 text-xs rounded-lg shadow-2xs focus-visible:ring-1 focus-visible:ring-slate-400"
					/>
				</div>

				{/* Filter Dropdown */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							size="sm"
							className="h-9 gap-1.5 border-slate-200 bg-white text-xs text-slate-700 shadow-2xs hover:bg-slate-50"
						>
							<Filter className="h-3.5 w-3.5 text-slate-500" />
							<span>
								{categoryFilter !== "all"
									? categoryFilter
									: "Filter"}
							</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-48">
						<DropdownMenuItem
							onClick={() => onCategoryFilterChange("all")}
							className="cursor-pointer text-xs"
						>
							Alla kategorier
						</DropdownMenuItem>
						{YEAR_END_CATEGORIES_LIST.map((cat) => (
							<DropdownMenuItem
								key={cat}
								onClick={() => onCategoryFilterChange(cat)}
								className="cursor-pointer text-xs"
							>
								{cat}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Right: + Lägg till nytt */}
			<div>
				<Button
					onClick={onCreateClick}
					size="sm"
					className="h-9 px-4 bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 rounded-lg shadow-2xs gap-1.5"
				>
					<Plus className="h-4 w-4" />
					<span>Lägg till nytt</span>
				</Button>
			</div>
		</div>
	);
}

export default YearEndToolbar;
