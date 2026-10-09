"use client";

import React, { useState } from "react";
import { Search, ChevronDown, Plus, X } from "lucide-react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	SYSTEM_CATEGORY_OPTIONS,
	SYSTEM_STATUS_OPTIONS,
	SYSTEM_STATUS_BADGE_CONFIG,
	SYSTEM_CATEGORY_TRANSLATION_MAP,
} from "@/features/data-it/constants/dataItSystem.constants";
import type {
	SystemCategory,
	SystemStatus,
} from "@/features/data-it/types/dataItSystem.types";

interface SystemFilterToolbarProps {
	searchQuery: string;
	onSearchChange: (query: string) => void;
	selectedCategory: SystemCategory | "ALL";
	onCategoryChange: (category: SystemCategory | "ALL") => void;
	selectedStatus: SystemStatus | "ALL";
	onStatusChange: (status: SystemStatus | "ALL") => void;
	onRegisterClick?: () => void;
}

export const SystemFilterToolbar: React.FC<SystemFilterToolbarProps> = ({
	searchQuery,
	onSearchChange,
	selectedCategory,
	onCategoryChange,
	selectedStatus,
	onStatusChange,
	onRegisterClick,
}) => {
	const t = useTranslate();

	const [showFilterDropdown, setShowFilterDropdown] = useState(false);
	const dropdownRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		if (!showFilterDropdown) return;

		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setShowFilterDropdown(false);
			}
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setShowFilterDropdown(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [showFilterDropdown]);

	const hasActiveFilters =
		selectedCategory !== "ALL" || selectedStatus !== "ALL";

	const activeFilterCount =
		(selectedCategory !== "ALL" ? 1 : 0) + (selectedStatus !== "ALL" ? 1 : 0);

	return (
		<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex flex-1 flex-wrap items-center gap-3">
				{/* Search Input */}
				<div className="relative min-w-[240px] max-w-sm flex-1">
					<Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => onSearchChange(e.target.value)}
						placeholder={t(localizationConstants.dataItSystemSearchPlaceholder)}
						className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-slate-400 focus:outline-hidden"
					/>
					{searchQuery && (
						<button
							type="button"
							onClick={() => onSearchChange("")}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
							aria-label={t(localizationConstants.dataItSystemAriaClearSearch)}
						>
							<X className="h-4 w-4" />
						</button>
					)}
				</div>

				{/* Filter Dropdown trigger */}
				<div ref={dropdownRef} className="relative">
					<button
						type="button"
						onClick={() => setShowFilterDropdown((prev) => !prev)}
						className={`inline-flex h-10 items-center gap-2 rounded-lg border px-3.5 text-sm font-medium transition-colors ${
							hasActiveFilters || showFilterDropdown
								? "border-slate-800 bg-slate-900 text-white"
								: "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
						}`}
					>
						<span>{t(localizationConstants.dataItSystemFilterBtn)}</span>
						<ChevronDown className="h-4 w-4 text-slate-400" />
						{hasActiveFilters && (
							<span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-900">
								{activeFilterCount}
							</span>
						)}
					</button>

					{/* Filter popup */}
					{showFilterDropdown && (
						<div className="absolute left-0 top-12 z-20 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
							<div className="space-y-4">
								{/* Category Filter */}
								<div>
									<label className="mb-1.5 block text-xs font-semibold text-slate-600">
										{t(localizationConstants.dataItSystemFilterCategory)}
									</label>
									<select
										value={selectedCategory}
										onChange={(e) => onCategoryChange(e.target.value as SystemCategory | "ALL")}
										className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-hidden"
									>
										<option value="ALL">{t(localizationConstants.dataItSystemAllCategories)}</option>
										{SYSTEM_CATEGORY_OPTIONS.map((cat) => (
											<option key={cat} value={cat}>{t(SYSTEM_CATEGORY_TRANSLATION_MAP[cat])}</option>
										))}
									</select>
								</div>

								{/* Status Filter */}
								<div>
									<label className="mb-1.5 block text-xs font-semibold text-slate-600">
										{t(localizationConstants.dataItSystemFilterStatus)}
									</label>
									<select
										value={selectedStatus}
										onChange={(e) => onStatusChange(e.target.value as SystemStatus | "ALL")}
										className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-hidden"
									>
										<option value="ALL">{t(localizationConstants.dataItSystemAllStatuses)}</option>
										{SYSTEM_STATUS_OPTIONS.map((st) => (
											<option key={st} value={st}>{t(SYSTEM_STATUS_BADGE_CONFIG[st].labelKey)}</option>
										))}
									</select>
								</div>

								{/* Clear Filters Button */}
								{hasActiveFilters && (
									<button
										type="button"
										onClick={() => {
											onCategoryChange("ALL");
											onStatusChange("ALL");
										}}
										className="w-full rounded-lg border border-slate-200 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
									>
										{t(localizationConstants.dataItSystemClearFilters)}
									</button>
								)}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Register System Action Button */}
			<button
				type="button"
				onClick={onRegisterClick}
				className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white shadow-xs hover:bg-slate-800 transition-colors"
			>
				<Plus className="h-4 w-4" />
				<span>{t(localizationConstants.dataItRegisterNewSystem)}</span>
			</button>
		</div>
	);
};

export default SystemFilterToolbar;

