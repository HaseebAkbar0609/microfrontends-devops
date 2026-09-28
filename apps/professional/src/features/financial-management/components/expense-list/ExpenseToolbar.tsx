"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Search, Plus, ChevronDown } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExpenseStatus, ExpenseCategory } from "../../types/expense.types";
import {
	EXPENSE_CATEGORIES,
	EXPENSE_STATUSES,
	CREATE_EXPENSE_ROUTE,
} from "../../constants/expense.constants";

interface ExpenseToolbarProps {
	searchQuery: string;
	onSearchChange: (val: string) => void;
	statusFilter: ExpenseStatus | "all";
	onStatusFilterChange: (val: ExpenseStatus | "all") => void;
	categoryFilter: ExpenseCategory | "all";
	onCategoryFilterChange: (val: ExpenseCategory | "all") => void;
	projectFilter: string | "all";
	onProjectFilterChange: (val: string | "all") => void;
	availableProjects: string[];
	onRegisterClick?: () => void;
	createRoute?: string;
}

export function ExpenseToolbar({
	searchQuery,
	onSearchChange,
	statusFilter,
	onStatusFilterChange,
	categoryFilter,
	onCategoryFilterChange,
	projectFilter,
	onProjectFilterChange,
	availableProjects,
	onRegisterClick,
	createRoute = CREATE_EXPENSE_ROUTE,
}: ExpenseToolbarProps) {
	const { t } = useTranslation();

	const isFiltered = statusFilter !== "all" || categoryFilter !== "all" || projectFilter !== "all";

	return (
		<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
			{/* Left: Search Bar & Filter Dropdown */}
			<div className="flex items-center gap-2.5 flex-1">
				{/* Search Bar */}
				<div className="relative w-full sm:w-[240px] md:w-[260px] lg:w-[300px]">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
					<Input
						type="text"
						value={searchQuery}
						onChange={(e) => onSearchChange(e.target.value)}
						placeholder={t(localizationConstants.expenseSearchPlaceholder)}
						className="pl-9 h-10 text-sm bg-white border-slate-200 rounded-lg shadow-2xs focus-visible:ring-1 focus-visible:ring-slate-400"
					/>
				</div>

				{/* Single Filter Dropdown */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							className={`h-10 px-3.5 text-xs font-normal border-slate-200 bg-white gap-1.5 rounded-lg hover:bg-slate-50 cursor-pointer shadow-2xs ${
								isFiltered ? "border-slate-800 text-slate-900 font-medium bg-slate-50" : "text-slate-700"
							}`}
						>
							<span>Filter</span>
							<ChevronDown className="h-3.5 w-3.5 text-slate-400 ml-0.5" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-56 bg-white border-slate-200 shadow-xl p-2">
						<DropdownMenuLabel className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-2 py-1">
							<Translate text={localizationConstants.expenseColStatus} />
						</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() => onStatusFilterChange("all")}
							className={`text-xs cursor-pointer ${statusFilter === "all" ? "font-semibold text-slate-900" : "text-slate-600"}`}
						>
							<Translate text={localizationConstants.expenseFilterAllStatuses} />
						</DropdownMenuItem>
						{EXPENSE_STATUSES.map((st) => (
							<DropdownMenuItem
								key={st.value}
								onClick={() => onStatusFilterChange(st.value)}
								className={`text-xs cursor-pointer ${statusFilter === st.value ? "font-semibold text-slate-900" : "text-slate-600"}`}
							>
								<Translate text={st.labelKey} />
							</DropdownMenuItem>
						))}

						<DropdownMenuSeparator className="my-1 border-slate-100" />

						<DropdownMenuLabel className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-2 py-1">
							<Translate text={localizationConstants.expenseColCategory} />
						</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() => onCategoryFilterChange("all")}
							className={`text-xs cursor-pointer ${categoryFilter === "all" ? "font-semibold text-slate-900" : "text-slate-600"}`}
						>
							<Translate text={localizationConstants.expenseFilterAllCategories} />
						</DropdownMenuItem>
						{EXPENSE_CATEGORIES.map((cat) => (
							<DropdownMenuItem
								key={cat.value}
								onClick={() => onCategoryFilterChange(cat.value)}
								className={`text-xs cursor-pointer ${categoryFilter === cat.value ? "font-semibold text-slate-900" : "text-slate-600"}`}
							>
								<Translate text={cat.labelKey} />
							</DropdownMenuItem>
						))}

						{availableProjects.length > 0 && (
							<>
								<DropdownMenuSeparator className="my-1 border-slate-100" />
								<DropdownMenuLabel className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-2 py-1">
									<Translate text={localizationConstants.expenseColProject} />
								</DropdownMenuLabel>
								<DropdownMenuItem
									onClick={() => onProjectFilterChange("all")}
									className={`text-xs cursor-pointer ${projectFilter === "all" ? "font-semibold text-slate-900" : "text-slate-600"}`}
								>
									<Translate text={localizationConstants.expenseFilterAllProjects} />
								</DropdownMenuItem>
								{availableProjects.map((prj) => (
									<DropdownMenuItem
										key={prj}
										onClick={() => onProjectFilterChange(prj)}
										className={`text-xs cursor-pointer ${projectFilter === prj ? "font-semibold text-slate-900" : "text-slate-600"}`}
									>
										{prj}
									</DropdownMenuItem>
								))}
							</>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Right: Primary CTA "+ Lägg till leverantörsfaktura" */}
			<div className="flex items-center gap-2">
				<Link href={createRoute}>
					<Button
						onClick={onRegisterClick}
						className="h-10 px-4 text-sm font-medium bg-[#111721] hover:bg-slate-800 text-white gap-2 shadow-2xs cursor-pointer rounded-lg shrink-0 transition-all"
					>
						<Plus className="h-4 w-4" />
						<span>
							<Translate text={localizationConstants.expenseAddSupplierInvoiceBtn} />
						</span>
					</Button>
				</Link>
			</div>
		</div>
	);
}

export default ExpenseToolbar;
