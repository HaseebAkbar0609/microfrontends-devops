"use client";

import React from "react";
import { EmployeeGroupSummary, EmployeeDayBreakdown } from "@/features/personnel/types/worktimeGroup.types";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface WorktimeGroupCalendarRowProps {
	employee: EmployeeGroupSummary;
}

export function WorktimeGroupCalendarRow({ employee }: WorktimeGroupCalendarRowProps) {
	// Fallback days array of 7 days if empty
	const daysToRender = employee.days && employee.days.length === 7 ? employee.days : [];

	return (
		<tr className="hover:bg-slate-50/50 transition-colors border-b border-slate-100">
			{/* Employee Info Column */}
			<td className="py-3 px-4 w-60 min-w-[200px]">
				<div className="flex items-center gap-3">
					<div className="h-8 w-8 rounded-full bg-slate-800 text-white text-xs font-semibold flex items-center justify-center shrink-0">
						{employee.initials}
					</div>
					<div className="min-w-0">
						<p className="text-xs font-bold text-slate-900 truncate">{employee.name}</p>
						<p className="text-[11px] text-slate-400 font-normal truncate">
							{employee.empCode || employee.role}
						</p>
					</div>
				</div>
			</td>

			{/* 7 Days Columns */}
			{daysToRender.map((day: EmployeeDayBreakdown) => {
				const hasHours = day.loggedHours > 0;

				return (
					<td
						key={day.id}
						className="py-3 px-2 text-center align-top border-l border-slate-100 min-w-[85px]"
					>
						<div className="flex flex-col items-center justify-center gap-0.5">
							{hasHours ? (
								<>
									<span className="text-xs font-bold text-slate-900 leading-tight">
										{day.loggedHours}h
									</span>

									{/* Badges for ÖT / ATA */}
									<div className="flex items-center gap-1 my-0.5 flex-wrap justify-center">
										{day.otHours > 0 && (
											<span className="bg-amber-100 text-amber-800 text-[10px] font-semibold px-1.5 py-0.5 rounded leading-none">
												<Translate text={localizationConstants.worktimeGroupColOt} /> {day.otHours}h
											</span>
										)}
										{day.ataHours > 0 && (
											<span className="bg-indigo-100 text-indigo-700 text-[10px] font-semibold px-1.5 py-0.5 rounded leading-none">
												<Translate text={localizationConstants.worktimeGroupColAta} /> {day.ataHours}h
											</span>
										)}
									</div>

									{/* Time Range */}
									{day.timeRange && (
										<span className="text-[10px] text-slate-400 font-normal leading-tight">
											{day.timeRange}
										</span>
									)}
								</>
							) : (
								<span className="text-xs text-slate-300 font-medium">—</span>
							)}
						</div>
					</td>
				);
			})}
		</tr>
	);
}
