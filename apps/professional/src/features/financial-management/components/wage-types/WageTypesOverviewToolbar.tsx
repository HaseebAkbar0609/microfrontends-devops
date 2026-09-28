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
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	WAGE_TYPES_CREATE_ROUTE,
	PERSONAL_TYPE_OPTIONS,
	WAGE_FORM_OPTIONS,
	TRANSACTION_TYPE_OPTIONS,
} from "../../constants/wageTypes.constants";
import type {
	WageTypeStatus,
	WageTypePersonalType,
	WageTypeWageForm,
	WageTypeTransactionType,
} from "../../types/wageTypes.types";

interface WageTypesOverviewToolbarProps {
	readonly searchQuery: string;
	readonly statusFilter: "all" | WageTypeStatus;
	readonly personalTypeFilter: "all" | WageTypePersonalType;
	readonly wageFormFilter: "all" | WageTypeWageForm;
	readonly transactionTypeFilter: "all" | WageTypeTransactionType;
	readonly onSearchChange: (val: string) => void;
	readonly onStatusFilterChange: (status: "all" | WageTypeStatus) => void;
	readonly onPersonalTypeFilterChange: (type: "all" | WageTypePersonalType) => void;
	readonly onWageFormFilterChange: (form: "all" | WageTypeWageForm) => void;
	readonly onTransactionTypeFilterChange: (tx: "all" | WageTypeTransactionType) => void;
}

export function WageTypesOverviewToolbar({
	searchQuery,
	statusFilter,
	personalTypeFilter,
	wageFormFilter,
	transactionTypeFilter,
	onSearchChange,
	onStatusFilterChange,
	onPersonalTypeFilterChange,
	onWageFormFilterChange,
	onTransactionTypeFilterChange,
}: WageTypesOverviewToolbarProps) {
	const router = useRouter();

	const hasActiveFilters =
		statusFilter !== "all" ||
		personalTypeFilter !== "all" ||
		wageFormFilter !== "all" ||
		transactionTypeFilter !== "all";

	const resetFilters = () => {
		onStatusFilterChange("all");
		onPersonalTypeFilterChange("all");
		onWageFormFilterChange("all");
		onTransactionTypeFilterChange("all");
	};

	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
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
							className={`h-10 px-3.5 bg-white border-slate-200 hover:bg-slate-50 text-xs font-normal rounded-lg shadow-2xs gap-1.5 justify-between cursor-pointer ${
								hasActiveFilters ? "text-slate-900 font-semibold border-slate-400" : "text-slate-700"
							}`}
						>
							<Translate text={localizationConstants.filter} />
							<ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-56 bg-white border-slate-200 shadow-md p-1">
							{hasActiveFilters && (
								<>
									<DropdownMenuItem
										onClick={resetFilters}
										className="text-xs text-red-600 font-medium cursor-pointer focus:bg-red-50 focus:text-red-700"
									>
										<Translate text={localizationConstants.clearFilters} />
									</DropdownMenuItem>
									<DropdownMenuSeparator />
								</>
							)}

							<DropdownMenuLabel className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
								<Translate text={localizationConstants.statusLabel} />
							</DropdownMenuLabel>
							<DropdownMenuItem
								onClick={() => onStatusFilterChange("all")}
								className="flex items-center justify-between text-xs cursor-pointer focus:bg-slate-100"
							>
								<Translate text={localizationConstants.costCenterAllStatus} />
								{statusFilter === "all" && <Check className="h-4 w-4 text-slate-700" />}
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => onStatusFilterChange("active")}
								className="flex items-center justify-between text-xs cursor-pointer focus:bg-slate-100"
							>
								<Translate text={localizationConstants.costCenterActiveStatus} />
								{statusFilter === "active" && <Check className="h-4 w-4 text-slate-700" />}
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => onStatusFilterChange("inactive")}
								className="flex items-center justify-between text-xs cursor-pointer focus:bg-slate-100"
							>
								<Translate text={localizationConstants.costCenterInactiveStatus} />
								{statusFilter === "inactive" && <Check className="h-4 w-4 text-slate-700" />}
							</DropdownMenuItem>

							<DropdownMenuSeparator />

							<DropdownMenuLabel className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
								<Translate text={localizationConstants.wageTypePersonalTypeHeader} />
							</DropdownMenuLabel>
							<DropdownMenuItem
								onClick={() => onPersonalTypeFilterChange("all")}
								className="flex items-center justify-between text-xs cursor-pointer focus:bg-slate-100"
							>
								<Translate text={localizationConstants.costCenterAllStatus} />
								{personalTypeFilter === "all" && <Check className="h-4 w-4 text-slate-700" />}
							</DropdownMenuItem>
							{PERSONAL_TYPE_OPTIONS.map((opt) => (
								<DropdownMenuItem
									key={opt.value}
									onClick={() => onPersonalTypeFilterChange(opt.value)}
									className="flex items-center justify-between text-xs cursor-pointer focus:bg-slate-100"
								>
									<Translate text={opt.labelKey} />
									{personalTypeFilter === opt.value && <Check className="h-4 w-4 text-slate-700" />}
								</DropdownMenuItem>
							))}

							<DropdownMenuSeparator />

							<DropdownMenuLabel className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
								<Translate text={localizationConstants.wageTypeWageFormHeader} />
							</DropdownMenuLabel>
							<DropdownMenuItem
								onClick={() => onWageFormFilterChange("all")}
								className="flex items-center justify-between text-xs cursor-pointer focus:bg-slate-100"
							>
								<Translate text={localizationConstants.costCenterAllStatus} />
								{wageFormFilter === "all" && <Check className="h-4 w-4 text-slate-700" />}
							</DropdownMenuItem>
							{WAGE_FORM_OPTIONS.map((opt) => (
								<DropdownMenuItem
									key={opt.value}
									onClick={() => onWageFormFilterChange(opt.value)}
									className="flex items-center justify-between text-xs cursor-pointer focus:bg-slate-100"
								>
									<Translate text={opt.labelKey} />
									{wageFormFilter === opt.value && <Check className="h-4 w-4 text-slate-700" />}
								</DropdownMenuItem>
							))}

							<DropdownMenuSeparator />

							<DropdownMenuLabel className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
								<Translate text={localizationConstants.wageTypeTransactionTypeHeader} />
							</DropdownMenuLabel>
							<DropdownMenuItem
								onClick={() => onTransactionTypeFilterChange("all")}
								className="flex items-center justify-between text-xs cursor-pointer focus:bg-slate-100"
							>
								<Translate text={localizationConstants.costCenterAllStatus} />
								{transactionTypeFilter === "all" && <Check className="h-4 w-4 text-slate-700" />}
							</DropdownMenuItem>
							{TRANSACTION_TYPE_OPTIONS.map((opt) => (
								<DropdownMenuItem
									key={opt.value}
									onClick={() => onTransactionTypeFilterChange(opt.value)}
									className="flex items-center justify-between text-xs cursor-pointer focus:bg-slate-100"
								>
									<Translate text={opt.labelKey} />
									{transactionTypeFilter === opt.value && <Check className="h-4 w-4 text-slate-700" />}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<div className="flex items-center justify-end">
					<Button
						onClick={() => router.push(WAGE_TYPES_CREATE_ROUTE)}
						className="h-10 w-full sm:w-auto gap-2 rounded-lg bg-[#111721] px-4 text-sm font-medium text-white shadow-2xs hover:bg-slate-800 justify-center cursor-pointer"
					>
						<Plus className="h-4 w-4" aria-hidden />
						<Translate text={localizationConstants.createWageTypeButton} />
					</Button>
				</div>
			</div>
	);
}
