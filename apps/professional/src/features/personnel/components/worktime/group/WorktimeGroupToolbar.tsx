"use client";

import React from "react";
import { Search, Filter, X } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface WorktimeGroupToolbarProps {
	searchQuery: string;
	showExceptionsOnly: boolean;
	onSearchChange: (query: string) => void;
	onToggleExceptions: () => void;
	onExpandAll?: () => void;
	onCollapseAll?: () => void;
	showExpandCollapse?: boolean;
}

export function WorktimeGroupToolbar({
	searchQuery,
	showExceptionsOnly,
	onSearchChange,
	onToggleExceptions,
	onExpandAll,
	onCollapseAll,
	showExpandCollapse = true,
}: WorktimeGroupToolbarProps) {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
			{/* Left: Undantag Button followed by Search Field matching Figma */}
			<div className="flex items-center gap-3 flex-wrap">
				{/* Undantag Filter Toggle */}
				<button
					type="button"
					onClick={onToggleExceptions}
					className={cn(
						"inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors shadow-2xs",
						showExceptionsOnly
							? "bg-slate-900 text-white border-slate-900 font-semibold"
							: "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
					)}
				>
					<Filter className={cn("w-3.5 h-3.5", showExceptionsOnly ? "text-white" : "text-slate-400")} />
					<Translate text={localizationConstants.worktimeGroupFilterException} />
				</button>

				{/* Search Field */}
				<div className="relative w-64 sm:w-80">
					<Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => onSearchChange(e.target.value)}
						placeholder={t(localizationConstants.worktimeGroupSearchPlaceholder)}
						className="w-full h-8 pl-8 pr-7 text-xs border border-slate-200 bg-white rounded-lg focus:outline-none focus:border-slate-400 shadow-2xs placeholder:text-slate-400"
					/>
					{searchQuery && (
						<button
							type="button"
							onClick={() => onSearchChange("")}
							className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
						>
							<X className="w-3.5 h-3.5" />
						</button>
					)}
				</div>
			</div>

			{/* Right: Expandera alla | Kollapsa alla matching Figma */}
			{showExpandCollapse && (
				<div className="flex items-center gap-4 text-xs font-medium text-sky-600 self-end sm:self-center">
					{onExpandAll && (
						<button
							type="button"
							onClick={onExpandAll}
							className="hover:underline hover:text-sky-700 cursor-pointer"
						>
							<Translate text={localizationConstants.worktimeGroupBtnExpandAll} />
						</button>
					)}
					{onCollapseAll && (
						<button
							type="button"
							onClick={onCollapseAll}
							className="hover:underline hover:text-sky-700 cursor-pointer"
						>
							<Translate text={localizationConstants.worktimeGroupBtnCollapseAll} />
						</button>
					)}
				</div>
			)}
		</div>
	);
}
