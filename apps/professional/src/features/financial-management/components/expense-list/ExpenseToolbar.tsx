"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Search, Plus, Filter } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ExpenseStatus, ExpenseCategory } from "../../types/expense.types";
import { EXPENSE_CATEGORIES, EXPENSE_STATUSES } from "../../constants/expense.constants";

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
	onRegisterClick: () => void;
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
}: ExpenseToolbarProps) {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
			{/* Left: Search Bar & Filters */}
			<div className="flex flex-wrap items-center gap-2.5 flex-1">
				{/* Search Bar */}
				<div className="relative flex-1 min-w-[200px] max-w-sm">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
					<Input
						type="text"
						value={searchQuery}
						onChange={(e) => onSearchChange(e.target.value)}
						placeholder={t(localizationConstants.expenseSearchPlaceholder)}
						className="pl-9 h-9 text-xs bg-white border-slate-200 rounded-lg shadow-2xs focus-visible:ring-1 focus-visible:ring-slate-900"
					/>
				</div>

				{/* Status Filter Dropdown */}
				<Select
					value={statusFilter}
					onValueChange={(val) => onStatusFilterChange(val as ExpenseStatus | "all")}
				>
					<SelectTrigger className="h-9 text-xs bg-white border-slate-200 rounded-lg shadow-2xs w-[130px] gap-1">
						<Filter className="h-3 w-3 text-slate-400 mr-1 shrink-0" />
						<SelectValue placeholder={t(localizationConstants.filter)} />
					</SelectTrigger>
					<SelectContent className="bg-white border-slate-200 shadow-lg">
						<SelectItem value="all" className="text-xs">
							<Translate text={localizationConstants.expenseFilterAllStatuses} />
						</SelectItem>
						{EXPENSE_STATUSES.map((st) => (
							<SelectItem key={st.value} value={st.value} className="text-xs">
								<Translate text={st.labelKey} />
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{/* Category Filter */}
				<Select
					value={categoryFilter}
					onValueChange={(val) => onCategoryFilterChange(val as ExpenseCategory | "all")}
				>
					<SelectTrigger className="h-9 text-xs bg-white border-slate-200 rounded-lg shadow-2xs w-[135px]">
						<SelectValue placeholder={t(localizationConstants.expenseFilterAllCategories)} />
					</SelectTrigger>
					<SelectContent className="bg-white border-slate-200 shadow-lg">
						<SelectItem value="all" className="text-xs">
							<Translate text={localizationConstants.expenseFilterAllCategories} />
						</SelectItem>
						{EXPENSE_CATEGORIES.map((cat) => (
							<SelectItem key={cat.value} value={cat.value} className="text-xs">
								<Translate text={cat.labelKey} />
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{/* Project Filter */}
				{availableProjects.length > 0 && (
					<Select
						value={projectFilter}
						onValueChange={(val) => onProjectFilterChange(val)}
					>
						<SelectTrigger className="h-9 text-xs bg-white border-slate-200 rounded-lg shadow-2xs w-[150px]">
							<SelectValue placeholder={t(localizationConstants.expenseFilterAllProjects)} />
						</SelectTrigger>
						<SelectContent className="bg-white border-slate-200 shadow-lg">
							<SelectItem value="all" className="text-xs">
								<Translate text={localizationConstants.expenseFilterAllProjects} />
							</SelectItem>
							{availableProjects.map((prj) => (
								<SelectItem key={prj} value={prj} className="text-xs">
									{prj}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}
			</div>

			{/* Right: Primary CTA "+ Lägg till leverantörsfaktura" */}
			<div className="flex items-center gap-2">
				<Button
					size="sm"
					onClick={onRegisterClick}
					className="h-9 px-4 text-xs font-semibold bg-zinc-950 hover:bg-slate-800 text-white gap-2 shadow-xs cursor-pointer rounded-lg shrink-0 transition-all"
				>
					<Plus className="h-3.5 w-3.5" />
					<span>
						<Translate text={localizationConstants.expenseAddSupplierInvoiceBtn} />
					</span>
				</Button>
			</div>
		</div>
	);
}

export default ExpenseToolbar;
