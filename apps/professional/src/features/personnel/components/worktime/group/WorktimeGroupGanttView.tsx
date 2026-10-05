"use client";

import React, { useState } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
	EmployeeGroupSummary,
	GanttTimeRange,
} from "@/features/personnel/types/worktimeGroup.types";
import { WorktimeGroupGanttRow } from "./WorktimeGroupGanttRow";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { cn } from "@/lib/utils";

interface WorktimeGroupGanttViewProps {
	employees: EmployeeGroupSummary[];
	ganttTimeRange: GanttTimeRange;
	onRangeChange: (range: GanttTimeRange) => void;
}

export const GANTT_TIMELINE_DAYS = [
	{ index: 0, dayLetter: "M", dateLabel: "1 Jan" },
	{ index: 1, dayLetter: "T", dateLabel: "2 Jan" },
	{ index: 2, dayLetter: "W", dateLabel: "3 Jan" },
	{ index: 3, dayLetter: "T", dateLabel: "4 Jan" },
	{ index: 4, dayLetter: "F", dateLabel: "5 Jan" },
	{ index: 5, dayLetter: "S", dateLabel: "6 Jan" },
	{ index: 6, dayLetter: "S", dateLabel: "7 Jan" },
	{ index: 7, dayLetter: "M", dateLabel: "8 Jan" },
	{ index: 8, dayLetter: "W", dateLabel: "9 Jan" },
	{ index: 9, dayLetter: "W", dateLabel: "10 Jan" },
];

export function WorktimeGroupGanttView({
	employees,
	ganttTimeRange,
	onRangeChange,
}: WorktimeGroupGanttViewProps) {
	const { t } = useTranslation();
	const [zoomLevel, setZoomLevel] = useState(1);

	const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.15, 1.3));
	const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.15, 0.85));

	return (
		<div className="space-y-3">
			{/* Sub-controls: [ Vecka | Månad ] & [ 🔍- ] [ 🔍+ ] matching Figma Image 3 */}
			<div className="flex items-center gap-3">
				{/* Vecka | Månad segmented toggle */}
				<div className="inline-flex items-center rounded-md border border-slate-200 bg-white p-0.5 shadow-2xs">
					<button
						type="button"
						onClick={() => onRangeChange("vecka")}
						className={cn(
							"px-3 py-1 text-xs font-semibold rounded cursor-pointer transition-colors",
							ganttTimeRange === "vecka"
								? "bg-slate-900 text-white"
								: "text-slate-600 hover:text-slate-900 bg-transparent"
						)}
					>
						<Translate text={localizationConstants.worktimeGroupGanttToggleWeek} />
					</button>
					<button
						type="button"
						onClick={() => onRangeChange("manad")}
						className={cn(
							"px-3 py-1 text-xs font-semibold rounded cursor-pointer transition-colors",
							ganttTimeRange === "manad"
								? "bg-slate-900 text-white"
								: "text-slate-600 hover:text-slate-900 bg-transparent"
						)}
					>
						<Translate text={localizationConstants.worktimeGroupGanttToggleMonth} />
					</button>
				</div>

				{/* Zoom Out / Zoom In buttons */}
				<div className="flex items-center gap-1.5">
					<button
						type="button"
						onClick={handleZoomOut}
						className="h-7 w-7 rounded-md border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 shadow-2xs cursor-pointer"
						title={t(localizationConstants.zoomOut)}
					>
						<ZoomOut className="w-3.5 h-3.5" />
					</button>
					<button
						type="button"
						onClick={handleZoomIn}
						className="h-7 w-7 rounded-md border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 shadow-2xs cursor-pointer"
						title={t(localizationConstants.zoomIn)}
					>
						<ZoomIn className="w-3.5 h-3.5" />
					</button>
				</div>
			</div>

			{/* Timeline Grid Container */}
			<div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
				<div className="overflow-x-auto">
					<div className="min-w-[850px]" style={{ transform: `scale(${zoomLevel})`, transformOrigin: "top left" }}>
						{/* Timeline Header matching Figma Image 3 */}
						<div className="flex bg-white border-b border-slate-200 text-2xs font-semibold text-slate-500 uppercase tracking-wider">
							<div className="w-56 min-w-[200px] py-3 px-4 shrink-0 text-left">
								<Translate text={localizationConstants.worktimeGroupColEmployeeTeam} />
							</div>
							<div className="flex-1 grid grid-cols-10 border-l border-slate-100">
								{GANTT_TIMELINE_DAYS.map((col) => (
									<div
										key={col.index}
										className="py-2.5 px-1 text-center border-r border-slate-100"
									>
										<div className="flex flex-col items-center">
											<span className="text-xs font-semibold text-slate-600">
												{col.dayLetter}
											</span>
											<span className="text-[10px] text-slate-400 font-normal">
												{col.dateLabel}
											</span>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Employee Gantt Rows */}
						<div className="divide-y divide-slate-100">
							{employees.length === 0 ? (
								<div className="py-12 text-center text-xs text-slate-500">
									<Translate text={localizationConstants.worktimeGroupEmptyEmployees} />
								</div>
							) : (
								employees.map((emp) => (
									<WorktimeGroupGanttRow key={emp.id} employee={emp} />
								))
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
