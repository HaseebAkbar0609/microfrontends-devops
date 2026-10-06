"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
	ProjectGanttRowItem,
	GanttTimeRange,
} from "@/features/personnel/types/worktimeGroup.types";
import { WorktimeProjectGanttRow } from "./WorktimeProjectGanttRow";
import {
	GANTT_DAYS_SV,
	GANTT_DAYS_EN,
	GANTT_MONTH_SV,
	GANTT_MONTH_EN,
} from "../WorktimeGroupGanttView";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { cn } from "@/lib/utils";

interface WorktimeProjectGanttViewProps {
	ganttRows: ProjectGanttRowItem[];
	ganttTimeRange: GanttTimeRange;
	onRangeChange: (range: GanttTimeRange) => void;
}

export function WorktimeProjectGanttView({
	ganttRows,
	ganttTimeRange,
	onRangeChange,
}: WorktimeProjectGanttViewProps) {
	const { t, i18n } = useTranslation();
	const [zoomLevel, setZoomLevel] = useState(1);
	const [ganttDateRange, setGanttDateRange] = useState("1 jan - 15 jan, 2026");

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

	const handlePrevRange = () => {
		setGanttDateRange((prev) =>
			prev.includes("1 jan") ? "16 dec - 31 dec, 2025" : "1 jan - 15 jan, 2026"
		);
	};

	const handleNextRange = () => {
		setGanttDateRange((prev) =>
			prev.includes("1 jan") ? "16 jan - 31 jan, 2026" : "1 jan - 15 jan, 2026"
		);
	};

	return (
		<div className="space-y-3">
			{/* Timeline Range Navigator & Sub-controls */}
			<div className="flex flex-wrap items-center justify-between gap-3">
				{/* Range Navigator */}
				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={handlePrevRange}
						className="h-8 w-8 rounded-md border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 shadow-2xs cursor-pointer transition-colors"
						aria-label={t(localizationConstants.worktimeGroupPrevRange)}
					>
						<ChevronLeft className="w-4 h-4" />
					</button>

					<div className="px-4 py-1.5 rounded-md border border-slate-200 bg-white text-xs font-semibold text-slate-800 shadow-2xs select-none">
						{ganttDateRange}
					</div>

					<button
						type="button"
						onClick={handleNextRange}
						className="h-8 w-8 rounded-md border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 shadow-2xs cursor-pointer transition-colors"
						aria-label={t(localizationConstants.worktimeGroupNextRange)}
					>
						<ChevronRight className="w-4 h-4" />
					</button>
				</div>

				{/* Right: [ Vecka | Månad ] & [ 🔍- ] [ 🔍+ ] */}
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
							<div className="w-56 min-w-[200px] py-3 px-4 shrink-0 text-left">
								<Translate text={localizationConstants.worktimeGroupColProjectOrder} />
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

						{/* Project Gantt Rows */}
						<div className="divide-y divide-slate-100">
							{ganttRows.map((row) => (
								<WorktimeProjectGanttRow
									key={row.id}
									row={row}
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
