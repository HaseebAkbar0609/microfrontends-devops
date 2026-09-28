"use client";

import React from "react";
import { Search, Plus, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";

interface EquipmentToolbarProps {
	searchTerm: string;
	onSearchChange: (value: string) => void;
	categoryFilter: string;
	onCategoryChange: (value: string) => void;
	statusFilter: string;
	onStatusChange: (value: string) => void;
	departmentFilter: string;
	onDepartmentChange: (value: string) => void;
	onResetFilters: () => void;
	onAddAsset: () => void;
}

export function EquipmentToolbar({
	searchTerm,
	onSearchChange,
	categoryFilter,
	onCategoryChange,
	statusFilter,
	onStatusChange,
	departmentFilter,
	onDepartmentChange,
	onResetFilters,
	onAddAsset,
}: EquipmentToolbarProps) {
	const { t } = useTranslation();

	const hasActiveFilters =
		Boolean(searchTerm) ||
		categoryFilter !== "all" ||
		statusFilter !== "all" ||
		departmentFilter !== "all";

	return (
		<div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-4 border-b border-slate-200 bg-white">
			{/* Left controls: Search & Filters */}
			<div className="flex flex-wrap items-center gap-2.5 flex-1">
				{/* Search Input */}
				<div className="relative w-full sm:w-[240px] md:w-[260px] lg:w-[300px]">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
					<Input
						value={searchTerm}
						onChange={(e) => onSearchChange(e.target.value)}
						placeholder={t(localizationConstants.searchEquipmentPlaceholder)}
						className="pl-9 h-10 text-xs bg-white border-slate-200 rounded-lg shadow-2xs"
					/>
				</div>

				{/* Category Filter */}
				<div className="w-full sm:w-[150px]">
					<Select value={categoryFilter} onValueChange={onCategoryChange}>
						<SelectTrigger className="h-10 px-3.5 bg-white border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-normal rounded-lg shadow-2xs gap-1.5 cursor-pointer">
							<SelectValue placeholder={t(localizationConstants.filterCategoryLabel)} />
						</SelectTrigger>
						<SelectContent className="text-xs">
							<SelectItem value="all" className="cursor-pointer text-xs">
								<Translate text={localizationConstants.filterCategoryAll} />
							</SelectItem>
							<SelectItem value="vehicle" className="cursor-pointer text-xs">
								<Translate text={localizationConstants.categoryVehicle} />
							</SelectItem>
							<SelectItem value="it_device" className="cursor-pointer text-xs">
								<Translate text={localizationConstants.categoryIT} />
							</SelectItem>
							<SelectItem value="power_tool" className="cursor-pointer text-xs">
								<Translate text={localizationConstants.categoryPowerTools} />
							</SelectItem>
							<SelectItem value="safety_gear" className="cursor-pointer text-xs">
								<Translate text={localizationConstants.categorySafety} />
							</SelectItem>
							<SelectItem value="clothes" className="cursor-pointer text-xs">
								<Translate text={localizationConstants.categoryClothes} />
							</SelectItem>
							<SelectItem value="keys_cards" className="cursor-pointer text-xs">
								<Translate text={localizationConstants.categoryKeysCards} />
							</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Status Filter */}
				<div className="w-full sm:w-[150px]">
					<Select value={statusFilter} onValueChange={onStatusChange}>
						<SelectTrigger className="h-10 px-3.5 bg-white border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-normal rounded-lg shadow-2xs gap-1.5 cursor-pointer">
							<SelectValue placeholder={t(localizationConstants.colStatus)} />
						</SelectTrigger>
						<SelectContent className="text-xs">
							<SelectItem value="all" className="cursor-pointer text-xs">
								<Translate text={localizationConstants.filterStatusAll} />
							</SelectItem>
							<SelectItem value="active_in_use" className="cursor-pointer text-xs">
								<Translate text={localizationConstants.statusActiveInUse} />
							</SelectItem>
							<SelectItem value="in_stock" className="cursor-pointer text-xs">
								<Translate text={localizationConstants.statusInStock} />
							</SelectItem>
							<SelectItem value="maintenance" className="cursor-pointer text-xs">
								<Translate text={localizationConstants.statusMaintenance} />
							</SelectItem>
							<SelectItem value="out_of_service" className="cursor-pointer text-xs">
								<Translate text={localizationConstants.statusOutOfService} />
							</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Department Filter */}
				<div className="w-full sm:w-[150px]">
					<Select value={departmentFilter} onValueChange={onDepartmentChange}>
						<SelectTrigger className="h-10 px-3.5 bg-white border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-normal rounded-lg shadow-2xs gap-1.5 cursor-pointer">
							<SelectValue placeholder={t(localizationConstants.colDepartment)} />
						</SelectTrigger>
						<SelectContent className="text-xs">
							<SelectItem value="all" className="cursor-pointer text-xs">
								<Translate text={localizationConstants.filterDepartmentAll} />
							</SelectItem>
							<SelectItem value="Montering" className="cursor-pointer text-xs">
								Montering
							</SelectItem>
							<SelectItem value="Produktion" className="cursor-pointer text-xs">
								Produktion
							</SelectItem>
							<SelectItem value="Administration" className="cursor-pointer text-xs">
								Administration
							</SelectItem>
							<SelectItem value="Fältarbete" className="cursor-pointer text-xs">
								Fältarbete
							</SelectItem>
							<SelectItem value="Logistik" className="cursor-pointer text-xs">
								Logistik
							</SelectItem>
							<SelectItem value="Lager" className="cursor-pointer text-xs">
								Lager
							</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Reset Filters */}
				{hasActiveFilters && (
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={onResetFilters}
						className="h-10 px-3 text-xs text-slate-500 hover:text-slate-800 gap-1.5 cursor-pointer"
					>
						<RotateCcw className="w-3.5 h-3.5" />
						<Translate text={localizationConstants.filterReset} />
					</Button>
				)}
			</div>

			{/* Right CTA: Add Asset */}
			<div className="flex items-center gap-2 shrink-0">
				<Button
					type="button"
					onClick={onAddAsset}
					className="h-10 px-4 bg-[#111721] hover:bg-slate-800 text-white font-medium text-sm rounded-lg shadow-2xs gap-2 cursor-pointer w-full sm:w-auto"
				>
					<Plus className="w-4 h-4" />
					<Translate text={localizationConstants.btnAddEquipment} />
				</Button>
			</div>
		</div>
	);
}
