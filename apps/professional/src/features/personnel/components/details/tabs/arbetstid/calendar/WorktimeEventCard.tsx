"use client";

import React from "react";
import { CalendarEventBlock } from "@/features/personnel/types/worktime.types";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { cn } from "@/lib/utils";

interface WorktimeEventCardProps {
	event: CalendarEventBlock;
}

export function WorktimeEventCard({ event }: WorktimeEventCardProps) {
	const isAtaOrOt = event.type === "ata" || event.type === "overtime";

	// 1 hour = 48px height in grid
	const topPx = (event.startHour - 7) * 48;
	const heightPx = Math.max(event.durationHours * 48, 36);

	return (
		<div
			style={{ top: `${topPx}px`, height: `${heightPx}px` }}
			className={cn(
				"absolute left-1 right-1 rounded-md p-2 text-xs border transition-all duration-150 shadow-2xs hover:shadow-md hover:scale-[1.01] overflow-hidden flex flex-col justify-between cursor-pointer select-none",
				isAtaOrOt
					? "bg-amber-50/95 border-amber-200 text-amber-900"
					: "bg-sky-50/95 border-sky-200 text-sky-900"
			)}
		>
			<div>
				<p className="font-semibold truncate leading-tight">{event.title}</p>
				<p className="text-[11px] opacity-75 mt-0.5">
					{event.startTime} - {event.endTime}
				</p>
			</div>
			<div className="flex items-center gap-1.5 text-[10px] font-medium pt-1 opacity-90">
				<span>
					<Translate text={localizationConstants.worktimeLabelTotal} />: {event.totalHours}h
				</span>
				{event.ataHours !== undefined && event.ataHours > 0 && (
					<span>
						• <Translate text={localizationConstants.worktimeLabelAta} />: {event.ataHours}h
					</span>
				)}
			</div>
		</div>
	);
}
