"use client";

import React, { useState, useMemo } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
	ProjectGanttRowItem,
	GanttTimeRange,
} from "@/features/personnel/types/worktimeGroup.types";
import { WorktimeProjectGanttRow } from "./WorktimeProjectGanttRow";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { cn } from "@/lib/utils";

interface WorktimeProjectGanttViewProps {
	ganttRows: ProjectGanttRowItem[];
	ganttTimeRange: GanttTimeRange;
	onRangeChange: (range: GanttTimeRange) => void;
	startDate?: Date;
}

export function WorktimeProjectGanttView({
	ganttRows,
	ganttTimeRange,
	onRangeChange,
	startDate = new Date(2024, 11, 23),
}: WorktimeProjectGanttViewProps) {
	const { t, i18n } = useTranslation();
	const [zoomLevel, setZoomLevel] = useState(1);

	const isMonthView = ganttTimeRange === "manad";

	// Dynamically build timeline columns with active locale via Intl.DateTimeFormat
	const timelineColumns = useMemo(() => {
		const locale = i18n.language?.startsWith("en") ? "en-US" : "sv-SE";
		const weekdayFormatter = new Intl.DateTimeFormat(locale, { weekday: "narrow" });
		const monthFormatter = new Intl.DateTimeFormat(locale, { month: "short" });

		if (isMonthView) {
			let monthName = monthFormatter.format(startDate).replace(".", "");
			monthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
			const weekLetter = t(localizationConstants.worktimeGroupFooterWeek).charAt(0).toUpperCase();

			return [
				{ index: 0, dayLetter: `${weekLetter}1`, dateLabel: `1-7 ${monthName}` },
				{ index: 1, dayLetter: `${weekLetter}2`, dateLabel: `8-14 ${monthName}` },
				{ index: 2, dayLetter: `${weekLetter}3`, dateLabel: `15-21 ${monthName}` },
				{ index: 3, dayLetter: `${weekLetter}4`, dateLabel: `22-31 ${monthName}` },
			];
		}

		return Array.from({ length: 10 }).map((_, index) => {
			const date = new Date(startDate);
			date.setDate(startDate.getDate() + index);

			const dayLetter = weekdayFormatter.format(date);
			const dayNumber = date.getDate();
			let monthName = monthFormatter.format(date).replace(".", "");
			monthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);

			return {
				index,
				dayLetter,
				dateLabel: `${dayNumber} ${monthName}`,
			};
		});
	}, [startDate, isMonthView, i18n.language, t]);

	const handleZoomIn = () => setZoomLevel((z) => Math.min(Number((z + 0.15).toFixed(2)), 1.3));
	const handleZoomOut = () => setZoomLevel((z) => Math.max(Number((z - 0.15).toFixed(2)), 0.85));

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
						className="transition-[min-width] duration-150"
						style={{
							minWidth: `${Math.round(850 * zoomLevel)}px`,
							width: `${Math.round(100 * zoomLevel)}%`,
						}}
					>
						{/* Timeline Header: PROJEKT / ORDER */}
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
							{ganttRows.length === 0 ? (
								<div className="py-12 text-center text-xs text-slate-500">
									<Translate text={localizationConstants.worktimeGroupEmptyProjects} />
								</div>
							) : (
								ganttRows.map((row) => (
									<WorktimeProjectGanttRow
										key={row.id}
										row={row}
										isMonthView={isMonthView}
									/>
								))
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
