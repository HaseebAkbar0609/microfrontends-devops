"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CustomerStatus } from "../../types/customers.types";

interface CustomersToolbarProps {
	searchQuery: string;
	onSearchChange: (val: string) => void;
	statusFilter: CustomerStatus | "all";
	onStatusFilterChange: (val: CustomerStatus | "all") => void;
}

export function CustomersToolbar({
	searchQuery,
	onSearchChange,
	statusFilter,
	onStatusFilterChange,
}: CustomersToolbarProps) {
	const t = useTranslate();

	return (
		<div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
			{/* Search Input */}
			<div className="relative flex-1 max-w-sm">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
				<Input
					value={searchQuery}
					onChange={(e) => onSearchChange(e.target.value)}
					placeholder={t(localizationConstants.customerRegisterSearch)}
					className="h-9 pl-9 text-xs bg-white"
				/>
			</div>

			{/* Status Filter */}
			<div className="w-40">
				<select
					value={statusFilter}
					onChange={(e) =>
						onStatusFilterChange(e.target.value as CustomerStatus | "all")
					}
					className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
				>
					<option value="all">{t(localizationConstants.allStatus)}</option>
					<option value="active">{t(localizationConstants.activeStatus)}</option>
					<option value="prospect">{t(localizationConstants.prospektStatus)}</option>
					<option value="inactive">{t(localizationConstants.inactiveStatus)}</option>
				</select>
			</div>
		</div>
	);
}
