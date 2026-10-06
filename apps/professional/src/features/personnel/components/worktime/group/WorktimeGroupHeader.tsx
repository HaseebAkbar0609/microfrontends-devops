"use client";

import React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { GroupViewTab } from "@/features/personnel/types/worktimeGroup.types";
import { cn } from "@/lib/utils";

interface WorktimeGroupHeaderProps {
	activeTab: GroupViewTab;
	dateRange: string;
	onTabChange: (tab: GroupViewTab) => void;
}

export function WorktimeGroupHeader({
	activeTab,
	dateRange,
	onTabChange,
}: WorktimeGroupHeaderProps) {
	return (
		<div className="space-y-4">
			{/* Top Bar: Title & Subtitle + Date Pill & Group Indicator matching Figma */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
						<Translate text={localizationConstants.worktimeGroupTitle} />
					</h1>
					<p className="text-xs text-slate-500 font-normal mt-0.5">
						<Translate text={localizationConstants.worktimeGroupSubtitle} />
					</p>
				</div>

				<div className="flex items-center gap-3">
					{/* Static Date Range Pill matching Figma frame */}
					<div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 shadow-2xs select-none">
						<CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
						<span>{dateRange}</span>
					</div>

					{/* Group By Indicator matching Figma frame */}
					<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 shadow-2xs">
						<span>
							<Translate text={localizationConstants.worktimeGroupByLabel} />:{" "}
							<span className="font-semibold text-slate-900">
								<Translate text={localizationConstants.worktimeGroupByPerson} />
							</span>
						</span>
					</div>
				</div>
			</div>

			{/* Second Row: 3 Underline Tabs (Kalendervy | Lista | Gantt-schema) */}
			<div className="flex items-center border-b border-slate-200">
				<button
					type="button"
					onClick={() => onTabChange("kalender")}
					className={cn(
						"py-2.5 px-4 text-xs font-semibold cursor-pointer transition-colors border-b-2 -mb-px",
						activeTab === "kalender"
							? "border-slate-900 text-slate-900 font-bold"
							: "border-transparent text-slate-500 hover:text-slate-800"
					)}
				>
					<Translate text={localizationConstants.worktimeGroupTabKalender} />
				</button>
				<button
					type="button"
					onClick={() => onTabChange("list")}
					className={cn(
						"py-2.5 px-4 text-xs font-semibold cursor-pointer transition-colors border-b-2 -mb-px",
						activeTab === "list"
							? "border-slate-900 text-slate-900 font-bold"
							: "border-transparent text-slate-500 hover:text-slate-800"
					)}
				>
					<Translate text={localizationConstants.worktimeGroupTabList} />
				</button>
				<button
					type="button"
					onClick={() => onTabChange("gantt")}
					className={cn(
						"py-2.5 px-4 text-xs font-semibold cursor-pointer transition-colors border-b-2 -mb-px",
						activeTab === "gantt"
							? "border-slate-900 text-slate-900 font-bold"
							: "border-transparent text-slate-500 hover:text-slate-800"
					)}
				>
					<Translate text={localizationConstants.worktimeGroupTabGantt} />
				</button>
			</div>
		</div>
	);
}
