"use client";

import React from "react";
import { OverheadDetailEntry } from "@/features/personnel/types/worktimeGroup.types";

interface WorktimeOverheadListSubRowProps {
	entry: OverheadDetailEntry;
}

export function WorktimeOverheadListSubRow({ entry }: WorktimeOverheadListSubRowProps) {
	return (
		<tr className="bg-slate-50/60 hover:bg-slate-100/60 transition-colors border-t border-slate-100">
			{/* Day Column */}
			<td className="py-2.5 pl-12 pr-4 text-xs font-semibold text-slate-700">
				{entry.dayLabel}
			</td>

			{/* ÖH TIM Column */}
			<td className="py-2.5 px-4">
				<span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-2xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
					{entry.ohHours}h
				</span>
			</td>

			{/* Associated Project */}
			<td className="py-2.5 px-4 text-xs font-medium text-slate-700">
				{entry.projectName}
			</td>

			{/* Time Interval */}
			<td colSpan={4} className="py-2.5 px-4 text-xs text-slate-500 font-normal">
				{entry.timeInterval}
			</td>
		</tr>
	);
}
