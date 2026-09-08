"use client";

import React from "react";
import Link from "next/link";
import { Search, ChevronDown, Plus, RotateCcw } from "lucide-react";
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
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	FILTER_LOCATION_OPTIONS,
	FILTER_ROLE_OPTIONS,
	STATUS_LABEL_KEY_MAP,
	TYPE_LABEL_KEY_MAP,
} from "../../constants/personnelOverview.constants";
import { EmployeeStatus, EmploymentType } from "../../types/personnelOverview.types";
import { PERSONNEL_NAV_ITEMS } from "../../constants/personnelNav.config";

interface PersonnelOverviewToolbarProps {
	searchTerm: string;
	onSearchChange: (val: string) => void;
	statusFilter: string;
	onStatusChange: (val: string) => void;
	typeFilter: string;
	onTypeChange: (val: string) => void;
	locationFilter: string;
	onLocationChange: (val: string) => void;
	roleFilter: string;
	onRoleChange: (val: string) => void;
	onResetFilters: () => void;
}

export function PersonnelOverviewToolbar({
	searchTerm,
	onSearchChange,
	statusFilter,
	onStatusChange,
	typeFilter,
	onTypeChange,
	locationFilter,
	onLocationChange,
	roleFilter,
	onRoleChange,
	onResetFilters,
}: PersonnelOverviewToolbarProps) {
	const hasActiveFilters =
		statusFilter !== "all" ||
		typeFilter !== "all" ||
		locationFilter !== "all" ||
		roleFilter !== "all" ||
		searchTerm.trim() !== "";

	return (
		<div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white border-b border-slate-200 rounded-t-lg">
			<div className="flex items-center gap-2 flex-1 max-w-md">
				{/* Search Field */}
				<div className="relative flex-1">
					<Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
					<input
						type="text"
						value={searchTerm}
						onChange={(e) => onSearchChange(e.target.value)}
						placeholder="Sök"
						className="w-full h-8 pl-8 pr-3 text-xs bg-slate-50/50 border border-slate-200 rounded-md placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:bg-white transition-all text-slate-900"
					/>
				</div>

				{/* Filter Popover */}
				<Popover>
					<PopoverTrigger asChild>
						<Button
							type="button"
							variant="outline"
							size="sm"
							className={`h-8 px-3 text-xs gap-1.5 border-slate-200 cursor-pointer ${
								hasActiveFilters ? "bg-slate-100 font-medium text-slate-900" : "text-slate-700 bg-white"
							}`}
						>
							<span>
								<Translate text={localizationConstants.filterButton} />
							</span>
							<ChevronDown className="w-3.5 h-3.5 text-slate-500" />
						</Button>
					</PopoverTrigger>
					<PopoverContent align="start" className="w-72 p-4 space-y-3 bg-white shadow-lg border-slate-200">
						<div className="flex items-center justify-between pb-2 border-b border-slate-100">
							<span className="text-xs font-semibold text-slate-800">
								<Translate text={localizationConstants.filterButton} />
							</span>
							{hasActiveFilters && (
								<button
									type="button"
									onClick={onResetFilters}
									className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
								>
									<RotateCcw className="w-3 h-3" />
									<Translate text={localizationConstants.filterReset} />
								</button>
							)}
						</div>

						{/* Status Filter */}
						<div className="space-y-1">
							<label className="text-[11px] font-medium text-slate-600 block">
								<Translate text={localizationConstants.filterStatusLabel} />
							</label>
							<Select value={statusFilter} onValueChange={onStatusChange}>
								<SelectTrigger className="h-7 text-xs bg-white border-slate-200">
									<SelectValue placeholder="Alla statusar" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all" className="text-xs">
										<Translate text={localizationConstants.filterAll} />
									</SelectItem>
									{(Object.keys(STATUS_LABEL_KEY_MAP) as EmployeeStatus[]).map((st) => (
										<SelectItem key={st} value={st} className="text-xs">
											<Translate text={STATUS_LABEL_KEY_MAP[st]} />
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Type Filter */}
						<div className="space-y-1">
							<label className="text-[11px] font-medium text-slate-600 block">
								<Translate text={localizationConstants.filterTypeLabel} />
							</label>
							<Select value={typeFilter} onValueChange={onTypeChange}>
								<SelectTrigger className="h-7 text-xs bg-white border-slate-200">
									<SelectValue placeholder="Alla anställningstyper" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all" className="text-xs">
										<Translate text={localizationConstants.filterAll} />
									</SelectItem>
									{(Object.keys(TYPE_LABEL_KEY_MAP) as EmploymentType[]).map((tp) => (
										<SelectItem key={tp} value={tp} className="text-xs">
											<Translate text={TYPE_LABEL_KEY_MAP[tp]} />
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Location Filter */}
						<div className="space-y-1">
							<label className="text-[11px] font-medium text-slate-600 block">
								<Translate text={localizationConstants.filterLocationLabel} />
							</label>
							<Select value={locationFilter} onValueChange={onLocationChange}>
								<SelectTrigger className="h-7 text-xs bg-white border-slate-200">
									<SelectValue placeholder="Alla platser" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all" className="text-xs">
										<Translate text={localizationConstants.filterAll} />
									</SelectItem>
									{FILTER_LOCATION_OPTIONS.map((loc) => (
										<SelectItem key={loc} value={loc} className="text-xs">
											{loc}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Role Filter */}
						<div className="space-y-1">
							<label className="text-[11px] font-medium text-slate-600 block">
								<Translate text={localizationConstants.colRole} />
							</label>
							<Select value={roleFilter} onValueChange={onRoleChange}>
								<SelectTrigger className="h-7 text-xs bg-white border-slate-200">
									<SelectValue placeholder="Alla befattningar" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all" className="text-xs">
										<Translate text={localizationConstants.filterAll} />
									</SelectItem>
									{FILTER_ROLE_OPTIONS.map((r) => (
										<SelectItem key={r} value={r} className="text-xs">
											{r}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</PopoverContent>
				</Popover>
			</div>

			{/* "+ Ny anställd" Button */}
			<Button
				asChild
				className="h-8 px-3.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white rounded-md cursor-pointer gap-1.5 shadow-xs"
			>
				<Link href={PERSONNEL_NAV_ITEMS[2]?.href ?? "/module/financial-management/personnel/create"}>
					<Plus className="w-3.5 h-3.5" />
					<Translate text={localizationConstants.newEmployeeButton} />
				</Link>
			</Button>
		</div>
	);
}
