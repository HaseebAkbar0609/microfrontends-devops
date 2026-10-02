"use client";

import React from "react";
import { DayCalendarColumn, CalendarEventBlock } from "@/features/personnel/types/worktime.types";
import { WorktimeEventCard } from "./WorktimeEventCard";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { cn } from "@/lib/utils";

interface WorktimeCalendarGridProps {
	dayColumns: DayCalendarColumn[];
	events: CalendarEventBlock[];
}

const HOURS = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

export function WorktimeCalendarGrid({ dayColumns, events }: WorktimeCalendarGridProps) {
	return (
		<div className="min-w-[860px] select-none">
			{/* Calendar Header Row */}
			<div className="grid grid-cols-[64px_repeat(6,1fr)] border-b border-slate-200 bg-slate-50/70">
				{/* Timezone cell */}
				<div className="py-3 px-2 text-center text-[11px] font-semibold text-slate-400 border-r border-slate-200">
					GMT+1
				</div>

				{/* 6 Day Column Headers */}
				{dayColumns.map((col) => (
					<div
						key={col.dayIndex}
						className={cn(
							"py-2.5 px-3 border-r border-slate-200 last:border-r-0 flex flex-col justify-center",
							col.dayIndex === 5 ? "bg-slate-100/50" : ""
						)}
					>
						<div className="flex items-center justify-between">
							<span className="text-xs font-bold text-slate-800">
								{col.dayNumber}{" "}
								{col.dayNameKey ? (
									<Translate
										text={
											localizationConstants[
												col.dayNameKey as keyof typeof localizationConstants
											]
										}
									/>
								) : (
									col.dayName
								)}
							</span>
							<span
								className={cn(
									"w-2 h-2 rounded-full",
									col.totalHours > 0 ? "bg-emerald-500" : "bg-slate-300"
								)}
							/>
						</div>
						<div className="text-[11px] text-slate-500 mt-0.5 font-medium">
							{col.totalHours}h{" "}
							<span className="text-slate-400">({col.percentage}%)</span>
						</div>
					</div>
				))}
			</div>

			{/* Calendar Body Grid with Time Axis */}
			<div className="relative grid grid-cols-[64px_repeat(6,1fr)]">
				{/* Time Axis Column */}
				<div className="border-r border-slate-200 bg-slate-50/40">
					{HOURS.map((hour) => (
						<div
							key={hour}
							className="h-12 border-b border-slate-100 pr-2 text-right text-[11px] text-slate-400 flex items-start justify-end pt-1"
						>
							{hour < 10 ? `0${hour}:00` : `${hour}:00`}
						</div>
					))}
				</div>

				{/* Day Columns */}
				{dayColumns.map((col) => {
					const dayEvents = events.filter((e) => e.dayIndex === col.dayIndex);

					return (
						<div
							key={col.dayIndex}
							className={cn(
								"relative border-r border-slate-200 last:border-r-0",
								col.dayIndex === 5 ? "bg-slate-50/20" : "bg-white"
							)}
						>
							{/* Background Hour Grid Lines */}
							{HOURS.map((hour) => (
								<div key={hour} className="h-12 border-b border-slate-100" />
							))}

							{/* Positioned Event Cards */}
							{dayEvents.map((evt) => (
								<WorktimeEventCard key={evt.id} event={evt} />
							))}
						</div>
					);
				})}
			</div>
		</div>
	);
}
