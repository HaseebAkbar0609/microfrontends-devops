"use client";

import React from "react";
import { Plus, Check, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { Search } from "@/components/search/Search";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { PRICE_LISTS_CREATE_ROUTE } from "../../constants/priceLists.constants";

interface PriceListsOverviewToolbarProps {
	readonly searchQuery: string;
	readonly categoryFilter: string;
	readonly onSearchChange: (val: string) => void;
	readonly onCategoryFilterChange: (category: string) => void;
}

export function PriceListsOverviewToolbar({
	searchQuery,
	categoryFilter,
	onSearchChange,
	onCategoryFilterChange,
}: PriceListsOverviewToolbarProps) {
	const router = useRouter();

	return (
		<div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
				<Search
					value={searchQuery}
					onChange={onSearchChange}
					placeholder={localizationConstants.search}
					className="h-10 w-full"
					wrapperClassName="w-full sm:w-[240px] md:w-[260px] lg:w-[300px]"
				/>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							className="h-10 px-3.5 bg-white border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-normal rounded-lg shadow-2xs gap-1.5 justify-between cursor-pointer"
						>
							<Translate text={localizationConstants.filter} />
							<ChevronDown className="h-3.5 w-3.5 text-slate-400" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-44 bg-white border-slate-200 shadow-md">
						<DropdownMenuItem
							onClick={() => onCategoryFilterChange("all")}
							className="flex items-center justify-between text-xs cursor-pointer focus:bg-slate-100"
						>
							<Translate text={localizationConstants.priceListCategoryFilterAll} />
							{categoryFilter === "all" && <Check className="h-4 w-4 text-slate-700" />}
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onCategoryFilterChange("Service")}
							className="flex items-center justify-between text-xs cursor-pointer focus:bg-slate-100"
						>
							<Translate text={localizationConstants.priceListCategoryFilterService} />
							{categoryFilter === "Service" && <Check className="h-4 w-4 text-slate-700" />}
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onCategoryFilterChange("Privat")}
							className="flex items-center justify-between text-xs cursor-pointer focus:bg-slate-100"
						>
							<Translate text={localizationConstants.priceListCategoryFilterPrivate} />
							{categoryFilter === "Privat" && <Check className="h-4 w-4 text-slate-700" />}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="flex items-center justify-end">
				<Button
					onClick={() => router.push(PRICE_LISTS_CREATE_ROUTE)}
					className="h-10 w-full sm:w-auto gap-2 rounded-lg bg-[#111721] px-4 text-sm font-medium text-white shadow-2xs hover:bg-slate-800 justify-center cursor-pointer"
				>
					<Plus className="h-4 w-4" aria-hidden />
					<Translate text={localizationConstants.registerNew} />
				</Button>
			</div>
		</div>
	);
}
