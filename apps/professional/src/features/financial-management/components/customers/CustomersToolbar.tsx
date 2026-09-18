"use client";

import React from "react";
import { Search, ChevronDown, Download, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CustomerStatus } from "../../types/customers.types";

interface CustomersToolbarProps {
	searchQuery: string;
	onSearchChange: (val: string) => void;
	statusFilter: CustomerStatus | "all";
	onStatusFilterChange: (val: CustomerStatus | "all") => void;
	onRegisterNew: () => void;
	onImportCustomer?: () => void;
}

export function CustomersToolbar({
	searchQuery,
	onSearchChange,
	statusFilter,
	onStatusFilterChange,
	onRegisterNew,
	onImportCustomer,
}: CustomersToolbarProps) {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
			{/* Left controls: Search & Filter */}
			<div className="flex items-center gap-3 flex-1 max-w-lg">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
					<Input
						value={searchQuery}
						onChange={(e) => onSearchChange(e.target.value)}
						placeholder={t(localizationConstants.customerSearchPlaceholder)}
						className="h-10 pl-9 text-xs bg-white border-slate-200 rounded-lg placeholder:text-slate-400 focus-visible:ring-slate-900"
					/>
				</div>

				<div className="relative">
					<select
						value={statusFilter}
						onChange={(e) =>
							onStatusFilterChange(e.target.value as CustomerStatus | "all")
						}
						className="h-10 appearance-none rounded-lg border border-slate-200 bg-white pl-4 pr-9 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-slate-900 cursor-pointer"
					>
						<option value="all">{t(localizationConstants.customerFilterBtn)}</option>
						<option value="active">{t(localizationConstants.customerStatusActive)}</option>
						<option value="prospect">{t(localizationConstants.customerStatusProspect)}</option>
						<option value="inactive">{t(localizationConstants.customerStatusInactive)}</option>
					</select>
					<ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
				</div>
			</div>

			{/* Right actions: Importera Kund & Registrera nytt */}
			<div className="flex items-center gap-3">
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={onImportCustomer}
					className="h-10 px-4 text-xs font-semibold gap-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-800 rounded-lg shadow-2xs cursor-pointer"
				>
					<Download className="h-4 w-4 text-slate-500" />
					<Translate text={localizationConstants.customerImportButton} />
				</Button>

				<Button
					type="button"
					size="sm"
					onClick={onRegisterNew}
					className="h-10 px-5 text-xs font-semibold gap-2 bg-[#111827] hover:bg-slate-800 text-white rounded-lg shadow-2xs cursor-pointer"
				>
					<Plus className="h-4 w-4" />
					<Translate text={localizationConstants.customerRegisterNewButton} />
				</Button>
			</div>
		</div>
	);
}
