"use client";

import React from "react";
import { Plus, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Search } from "@/components/search/Search";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	INSPECTION_TYPES,
	INSPECTION_TYPE_TRANSLATION_MAP,
} from "../../constants/orderInspection.constants";

interface InspectionToolbarProps {
	searchQuery: string;
	onSearchChange: (val: string) => void;
	filterType: string;
	onFilterTypeChange: (val: string) => void;
	onOpenAdd: () => void;
}

export function InspectionToolbar({
	searchQuery,
	onSearchChange,
	filterType,
	onFilterTypeChange,
	onOpenAdd,
}: InspectionToolbarProps) {
	const t = useTranslate();

	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2 w-full">
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
				{/* Search Bar */}
				<Search
					value={searchQuery}
					onChange={onSearchChange}
					placeholder={localizationConstants.inspectionSearchPlaceholder}
					className="h-10 w-full"
					wrapperClassName="w-full sm:w-[240px] md:w-[260px] lg:w-[300px]"
				/>

				{/* Filter Dropdown */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							className="h-10 w-full sm:w-auto px-3.5 gap-2 border-slate-200 bg-white text-xs font-normal text-slate-700 shadow-2xs cursor-pointer hover:bg-slate-50 justify-between sm:justify-start"
						>
							<span>
								{filterType === "all"
									? t(localizationConstants.inspectionFilterButton)
									: (INSPECTION_TYPE_TRANSLATION_MAP[filterType]
										? t(INSPECTION_TYPE_TRANSLATION_MAP[filterType])
										: filterType)}
							</span>
							<ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-56 bg-white p-1 shadow-lg border border-zinc-200 rounded-lg">
						<DropdownMenuLabel className="text-xs font-semibold text-slate-500 px-2 py-1">
							{t(localizationConstants.inspectionTypeFieldLabel)}
						</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() => onFilterTypeChange("all")}
							className="flex items-center justify-between text-xs px-2 py-1.5 rounded cursor-pointer hover:bg-slate-100"
						>
							<span>{t(localizationConstants.allTypesFilter)}</span>
							{filterType === "all" && <Check className="h-3.5 w-3.5 text-slate-900" />}
						</DropdownMenuItem>
						{INSPECTION_TYPES.map((type) => {
							const key = INSPECTION_TYPE_TRANSLATION_MAP[type];
							const label = key ? t(key) : type;
							return (
								<DropdownMenuItem
									key={type}
									onClick={() => onFilterTypeChange(type)}
									className="flex items-center justify-between text-xs px-2 py-1.5 rounded cursor-pointer hover:bg-slate-100"
								>
									<span>{label}</span>
									{filterType === type && <Check className="h-3.5 w-3.5 text-slate-900" />}
								</DropdownMenuItem>
							);
						})}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Add Button */}
			<div className="w-full sm:w-auto">
				<Button
					type="button"
					onClick={onOpenAdd}
					className="h-10 min-h-[40px] w-full sm:w-auto px-4 sm:px-5 rounded-md bg-slate-900 text-white hover:bg-slate-800 text-sm font-medium gap-2 sm:gap-2.5 cursor-pointer shrink-0 whitespace-nowrap flex items-center justify-center shadow-none"
				>
					<Plus className="h-4 w-4 shrink-0" />
					<span>{t(localizationConstants.inspectionAddButton)}</span>
				</Button>
			</div>
		</div>
	);
}

export default InspectionToolbar;
