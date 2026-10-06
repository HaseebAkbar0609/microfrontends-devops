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

// Localized 10-day timeline columns
export const GANTT_DAYS_SV = [
	{ index: 0, dayLetter: "M", dateLabel: "1 Jan" },
	{ index: 1, dayLetter: "T", dateLabel: "2 Jan" },
	{ index: 2, dayLetter: "O", dateLabel: "3 Jan" },
	{ index: 3, dayLetter: "T", dateLabel: "4 Jan" },
	{ index: 4, dayLetter: "F", dateLabel: "5 Jan" },
	{ index: 5, dayLetter: "L", dateLabel: "6 Jan" },
	{ index: 6, dayLetter: "S", dateLabel: "7 Jan" },
	{ index: 7, dayLetter: "M", dateLabel: "8 Jan" },
	{ index: 8, dayLetter: "O", dateLabel: "9 Jan" },
	{ index: 9, dayLetter: "O", dateLabel: "10 Jan" },
];

export const GANTT_DAYS_EN = [
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

// Localized month timeline columns
export const GANTT_MONTH_SV = [
	{ index: 0, dayLetter: "V1", dateLabel: "1-7 Jan" },
	{ index: 1, dayLetter: "V2", dateLabel: "8-14 Jan" },
	{ index: 2, dayLetter: "V3", dateLabel: "15-21 Jan" },
	{ index: 3, dayLetter: "V4", dateLabel: "22-31 Jan" },
];

export const GANTT_MONTH_EN = [
	{ index: 0, dayLetter: "W1", dateLabel: "1-7 Jan" },
	{ index: 1, dayLetter: "W2", dateLabel: "8-14 Jan" },
	{ index: 2, dayLetter: "W3", dateLabel: "15-21 Jan" },
	{ index: 3, dayLetter: "W4", dateLabel: "22-31 Jan" },
];

export function WorktimeGroupGanttView({
	employees,
	ganttTimeRange,
	onRangeChange,
}: WorktimeGroupGanttViewProps) {
	const { t, i18n } = useTranslation();
	const [zoomLevel, setZoomLevel] = useState(1);

	const isMonthView = ganttTimeRange === "manad";
	const isEn = i18n.language?.startsWith("en");

	const timelineColumns = isMonthView
		? isEn
			? GANTT_MONTH_EN
			: GANTT_MONTH_SV
		: isEn
			? GANTT_DAYS_EN
			: GANTT_DAYS_SV;

	const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.15, 1.3));
	const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.15, 0.85));

	return (
		<div className="space-y-3">
			{/* Sub-controls: [ Vecka | Månad ] & [ 🔍- ] [ 🔍+ ] */}
			<div className="flex items-center gap-3">
				{/* Vecka | Månad segmented toggle */}
				<div className="inline-flex items-center rounded-md border border-slate-200 bg-white p-0.5 shadow-2xs">
					<button
						type="button"
						onClick={() => onRangeChange("vecka")}
						className={cn(
							"px-3 py-1 text-xs font-semibold rounded cursor-pointer transition-colors",
							!isMonthView
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
							isMonthView
								? "bg-slate-900 text-white"
								: "text-slate-600 hover:text-slate-900 bg-transparent"
						)}
					>
						<Translate text={localizationConstants.worktimeGroupGanttToggleMonth} />
					</button>
				</div>

				{/* Zoom buttons */}
				<div className="flex items-center gap-1.5">
					<button
						type="button"
						onClick={handleZoomOut}
						className="h-7 w-7 rounded-md border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 shadow-2xs cursor-pointer"
						title={t(localizationConstants.worktimeGroupZoomOut)}
					>
						<ZoomOut className="w-3.5 h-3.5" />
					</button>
					<button
						type="button"
						onClick={handleZoomIn}
						className="h-7 w-7 rounded-md border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 shadow-2xs cursor-pointer"
						title={t(localizationConstants.worktimeGroupZoomIn)}
					>
						<ZoomIn className="w-3.5 h-3.5" />
					</button>
				</div>
			</div>

			{/* Timeline Grid Container */}
			<div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
				<div className="overflow-x-auto">
					<div
						className="min-w-[850px]"
						style={{ transform: `scale(${zoomLevel})`, transformOrigin: "top left" }}
					>
						{/* Timeline Header */}
						<div className="flex bg-white border-b border-slate-200 text-2xs font-semibold text-slate-500 uppercase tracking-wider">
							<div className="w-56 min-w-[200px] py-3 px-4 shrink-0">
								<Translate text={localizationConstants.worktimeGroupColEmployee} />
							</div>
							<div
								className={cn(
									"flex-1 border-l border-slate-100 grid",
									isMonthView ? "grid-cols-4" : "grid-cols-10"
								)}
							>
								{timelineColumns.map((col) => (
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
							{employees.map((emp) => (
								<WorktimeGroupGanttRow
									key={emp.id}
									employee={emp}
									isMonthView={isMonthView}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
