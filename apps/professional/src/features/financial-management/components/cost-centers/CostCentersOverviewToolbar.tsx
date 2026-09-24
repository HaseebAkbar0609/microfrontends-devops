"use client";

import React from "react";
import { Plus, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search } from "@/components/search/Search";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { COST_CENTERS_BASE_ROUTE } from "../../constants/costCenters.constants";

interface CostCentersOverviewToolbarProps {
	readonly searchQuery: string;
	readonly onSearchChange: (val: string) => void;
	readonly statusFilter: string;
	readonly onStatusFilterChange: (val: string) => void;
}

export function CostCentersOverviewToolbar({
	searchQuery,
	onSearchChange,
	onStatusFilterChange,
}: CostCentersOverviewToolbarProps) {
	const router = useRouter();

	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			{/* Left controls: Search + Filter */}
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
				<Search
					value={searchQuery}
					onChange={onSearchChange}
					placeholder={localizationConstants.search}
					className="h-10 w-full"
					wrapperClassName="w-full sm:w-[260px] lg:w-[280px]"
				/>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							className="h-10 w-full sm:w-28 border-slate-200 text-slate-700 font-normal bg-white hover:bg-slate-50 gap-1.5 px-3 text-xs shadow-2xs justify-between cursor-pointer"
						>
							<Translate text={localizationConstants.filter} />
							<ChevronDown className="h-3.5 w-3.5 text-slate-500 shrink-0" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-36 border border-slate-200 bg-white shadow-md rounded-md p-1">
						<DropdownMenuItem
							onClick={() => onStatusFilterChange("all")}
							className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
						>
							<Translate text={localizationConstants.costCenterAllStatus} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onStatusFilterChange("active")}
							className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
						>
							<Translate text={localizationConstants.costCenterActiveStatus} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onStatusFilterChange("inactive")}
							className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
						>
							<Translate text={localizationConstants.costCenterInactiveStatus} />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Right: + Skapa Kostnadsställe */}
			<Button
				onClick={() => router.push(`${COST_CENTERS_BASE_ROUTE}/create`)}
				className="h-10 w-full sm:w-auto gap-2 rounded-lg bg-[#111721] px-5 text-sm font-medium text-white shadow-2xs hover:bg-slate-800 justify-center cursor-pointer"
			>
				<Plus className="h-4 w-4" aria-hidden />
				<Translate text={localizationConstants.createCostCenterButtonText} />
			</Button>
		</div>
	);
}
