"use client";

import React from "react";
import {
	Calendar as CalendarIcon,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	Users,
	Briefcase,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { GroupByMode, GroupViewTab } from "@/features/personnel/types/worktimeGroup.types";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface WorktimeGroupHeaderProps {
	activeTab: GroupViewTab;
	groupByMode: GroupByMode;
	dateRange: string;
	onTabChange: (tab: GroupViewTab) => void;
	onGroupByChange: (mode: GroupByMode) => void;
	onPrevWeek: () => void;
	onNextWeek: () => void;
}

export function WorktimeGroupHeader({
	activeTab,
	groupByMode,
	dateRange,
	onTabChange,
	onGroupByChange,
	onPrevWeek,
	onNextWeek,
}: WorktimeGroupHeaderProps) {
	const { t } = useTranslation();

	return (
		<div className="space-y-4">
			{/* Top Bar: Title & Subtitle + Date Navigator & Group Dropdown */}
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
					{/* Interactive Date Range Navigator with Previous / Next Week */}
					<div className="inline-flex items-center rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 shadow-2xs">
						<button
							type="button"
							onClick={onPrevWeek}
							className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded-l-lg transition-colors cursor-pointer"
							aria-label={t(localizationConstants.worktimeGroupPrevRange)}
						>
							<ChevronLeft className="w-3.5 h-3.5" />
						</button>
						<div className="flex items-center gap-1.5 px-2.5 py-1.5 select-none font-semibold text-slate-800">
							<CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
							<span>{dateRange}</span>
						</div>
						<button
							type="button"
							onClick={onNextWeek}
							className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded-r-lg transition-colors cursor-pointer"
							aria-label={t(localizationConstants.worktimeGroupNextRange)}
						>
							<ChevronRight className="w-3.5 h-3.5" />
						</button>
					</div>

					{/* Group By Dropdown Button */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button
								type="button"
								className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-2xs cursor-pointer transition-colors"
							>
								<span>
									<Translate text={localizationConstants.worktimeGroupByLabel} />:{" "}
									<span className="font-semibold text-slate-900">
										{groupByMode === "person" && (
											<Translate text={localizationConstants.worktimeGroupByPerson} />
										)}
										{groupByMode === "project" && (
											<Translate text={localizationConstants.worktimeGroupByProject} />
										)}
									</span>
								</span>
								<ChevronDown className="w-3.5 h-3.5 text-slate-400" />
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-44">
							<DropdownMenuItem
								onClick={() => onGroupByChange("person")}
								className={cn(
									"flex items-center gap-2 text-xs cursor-pointer",
									groupByMode === "person"
										? "font-semibold text-slate-900 bg-slate-50"
										: "text-slate-600"
								)}
							>
								<Users className="w-4 h-4 text-sky-600" />
								<Translate text={localizationConstants.worktimeGroupByPerson} />
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => onGroupByChange("project")}
								className={cn(
									"flex items-center gap-2 text-xs cursor-pointer",
									groupByMode === "project"
										? "font-semibold text-slate-900 bg-slate-50"
										: "text-slate-600"
								)}
							>
								<Briefcase className="w-4 h-4 text-emerald-600" />
								<Translate text={localizationConstants.worktimeGroupByProject} />
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
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
