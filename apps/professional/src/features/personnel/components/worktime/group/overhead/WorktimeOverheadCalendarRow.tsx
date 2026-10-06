"use client";

import React from "react";
import { OverheadEmployeeSummary, DailyGroupTotal } from "@/features/personnel/types/worktimeGroup.types";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { cn } from "@/lib/utils";

interface WorktimeOverheadCalendarRowProps {
	employee: OverheadEmployeeSummary;
	columns: DailyGroupTotal[];
}

export function WorktimeOverheadCalendarRow({
	employee,
	columns,
}: WorktimeOverheadCalendarRowProps) {
	return (
		<tr className="hover:bg-slate-50/70 transition-colors">
			{/* Employee Info + Total ÖH: Xh */}
			<td className="py-3 px-4 w-60 min-w-[200px] align-top">
				<div className="flex items-start gap-2.5">
					<div
						className={cn(
							"w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 shadow-2xs",
							employee.avatarColor || "bg-slate-900 text-white"
						)}
					>
						{employee.initials}
					</div>
					<div className="flex flex-col">
						<span className="text-xs font-bold text-slate-900 tracking-tight">
							{employee.name}
						</span>
						<span className="text-[11px] text-slate-400 font-medium">
							{employee.empCode}
						</span>
						<span className="text-[11px] text-amber-600 font-medium mt-0.5">
							<Translate text={localizationConstants.worktimeGroupTotalOhLabel} />:{" "}
							{employee.totalOhHours}h
						</span>
					</div>
				</div>
			</td>

			{/* Day cells rendered strictly by column dayIndex */}
			{columns.map((col) => {
				const day = employee.days?.find((d) => d.dayIndex === col.dayIndex);
				const hasOh = day && day.ohHours > 0;

				return (
					<td
						key={col.dayIndex}
						className="py-3 px-3 text-center border-l border-slate-100 align-top min-w-[85px]"
					>
						{hasOh ? (
							<div className="flex flex-col items-center">
								{/* Amber Badge matching Figma frame */}
								<div className="inline-flex items-center justify-center px-4 py-1 rounded bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold shadow-2xs">
									{day.ohHours}h
								</div>
								{day.projectCode && (
									<span className="text-[11px] text-slate-400 font-medium mt-1">
										{day.projectCode}
									</span>
								)}
								{day.timeInterval && (
									<span className="text-[10px] text-slate-400 font-normal">
										{day.timeInterval}
									</span>
								)}
							</div>
						) : (
							<span className="text-xs text-slate-300 font-normal">—</span>
						)}
					</td>
				);
			})}
		</tr>
	);
}
