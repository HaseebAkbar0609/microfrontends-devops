"use client";

import React, { useState } from "react";
import { Search, Plus, Filter, ChevronDown } from "lucide-react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { DataItOverviewFilterStatus } from "../../types/dataItOverview.types";
import { showToast } from "@/lib/toast";

interface DataItOverviewToolbarProps {
	searchQuery: string;
	onSearchChange: (query: string) => void;
	statusFilter: DataItOverviewFilterStatus;
	onStatusFilterChange: (status: DataItOverviewFilterStatus) => void;
}

export function DataItOverviewToolbar({
	searchQuery,
	onSearchChange,
	statusFilter,
	onStatusFilterChange,
}: DataItOverviewToolbarProps) {
	const t = useTranslate();
	const [filterOpen, setFilterOpen] = useState(false);

	const handleAddEmployeeClick = () => {
		showToast("info", t(localizationConstants.dataItToastComingSoon));
	};

	return (
		<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex flex-wrap items-center gap-3">
				{/* Search Bar */}
				<div className="relative min-w-[220px] max-w-[320px]">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => onSearchChange(e.target.value)}
						placeholder={t(localizationConstants.dataItSearchPlaceholder)}
						className="h-10 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-slate-400 focus:outline-none"
					/>
				</div>

				{/* Filter Dropdown */}
				<div className="relative">
					<button
						type="button"
						onClick={() => setFilterOpen((prev) => !prev)}
						className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none"
					>
						<Filter size={15} className="text-slate-500" />
						<span>
							{statusFilter === "ALL" && t(localizationConstants.dataItFilterAll)}
							{statusFilter === "ACTIVE" && t(localizationConstants.dataItFilterActive)}
							{statusFilter === "INACTIVE" && t(localizationConstants.dataItFilterInactive)}
						</span>
						<ChevronDown size={14} className="text-slate-400" />
					</button>

					{filterOpen && (
						<>
							<div
								className="fixed inset-0 z-20"
								onClick={() => setFilterOpen(false)}
							/>
							<div className="absolute left-0 top-full z-30 mt-1 min-w-[160px] rounded-md border border-slate-200 bg-white py-1 shadow-md">
								<button
									type="button"
									onClick={() => {
										onStatusFilterChange("ALL");
										setFilterOpen(false);
									}}
									className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
								>
									{t(localizationConstants.dataItFilterAll)}
								</button>
								<button
									type="button"
									onClick={() => {
										onStatusFilterChange("ACTIVE");
										setFilterOpen(false);
									}}
									className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
								>
									{t(localizationConstants.dataItFilterActive)}
								</button>
								<button
									type="button"
									onClick={() => {
										onStatusFilterChange("INACTIVE");
										setFilterOpen(false);
									}}
									className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
								>
									{t(localizationConstants.dataItFilterInactive)}
								</button>
							</div>
						</>
					)}
				</div>
			</div>

			{/* Add Employee CTA */}
			<button
				type="button"
				onClick={handleAddEmployeeClick}
				className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus:outline-none"
			>
				<Plus size={16} />
				<span>+ {t(localizationConstants.dataItAddEmployeeBtn)}</span>
			</button>
		</div>
	);
}
