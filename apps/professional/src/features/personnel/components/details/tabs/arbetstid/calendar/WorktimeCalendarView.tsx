"use client";

import React from "react";
import { DayCalendarColumn, CalendarEventBlock } from "@/features/personnel/types/worktime.types";
import { WorktimeCalendarGrid } from "./WorktimeCalendarGrid";

interface WorktimeCalendarViewProps {
	dayColumns: DayCalendarColumn[];
	events: CalendarEventBlock[];
}

export function WorktimeCalendarView({ dayColumns, events }: WorktimeCalendarViewProps) {
	return (
		<div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
			<div className="overflow-x-auto">
				<WorktimeCalendarGrid dayColumns={dayColumns} events={events} />
			</div>
		</div>
	);
}
