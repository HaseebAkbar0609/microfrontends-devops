"use client";

import React from "react";
import { ChevronDown, Import, Plus } from "lucide-react";
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
import type { SupplierStatus } from "../../types/supplierOverview.types";

interface SuppliersOverviewToolbarProps {
	searchQuery: string;
	onSearchChange: (value: string) => void;
	statusFilter: "all" | SupplierStatus;
	onStatusFilterChange: (status: "all" | SupplierStatus) => void;
	onRegisterNew?: () => void;
	onImportSupplier?: () => void;
}

export function SuppliersOverviewToolbar({
	searchQuery,
	onSearchChange,
	onStatusFilterChange,
	onRegisterNew,
	onImportSupplier,
}: SuppliersOverviewToolbarProps) {
	return (
		<div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between mb-4">
			{/* Search & Filter Left Group */}
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
							className="h-10 w-full sm:w-18.75 sm:min-w-18.75 border-slate-200 text-slate-700 font-normal bg-transparent hover:bg-slate-50 gap-1.5 px-2.5 text-xs shadow-2xs justify-between"
						>
							<Translate text={localizationConstants.filter} />
							<ChevronDown className="h-3.5 w-3.5 text-slate-500 shrink-0" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="start"
						className="w-36 border border-slate-200 bg-white shadow-md rounded-md p-1"
					>
						<DropdownMenuItem
							onClick={() => onStatusFilterChange("all")}
							className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
						>
							<Translate text={localizationConstants.supplierStatusFilterAll} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onStatusFilterChange("active")}
							className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
						>
							<Translate text={localizationConstants.supplierStatusFilterActive} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onStatusFilterChange("prospect")}
							className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
						>
							<Translate text={localizationConstants.supplierStatusFilterProspect} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onStatusFilterChange("inactive")}
							className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
						>
							<Translate text={localizationConstants.supplierStatusFilterInactive} />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Action Buttons Right Group */}
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto justify-start xl:justify-end">
				<Button
					type="button"
					variant="outline"
					onClick={onImportSupplier}
					className="h-10 w-full sm:w-auto gap-2 border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 hover:bg-slate-50 shadow-2xs justify-center cursor-pointer"
				>
					<Import className="h-4 w-4 text-slate-700" aria-hidden />
					<Translate text={localizationConstants.supplierImportButton} />
				</Button>

				<Button
					type="button"
					onClick={onRegisterNew}
					className="h-10 w-full sm:w-auto gap-2 rounded-lg bg-[#111721] px-5 text-sm font-medium text-white shadow-2xs hover:bg-slate-800 justify-center cursor-pointer"
				>
					<Plus className="h-4 w-4" aria-hidden />
					<Translate text={localizationConstants.supplierRegisterNewButton} />
				</Button>
			</div>
		</div>
	);
}
