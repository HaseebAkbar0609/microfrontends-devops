"use client";

import React from "react";
import { EmployeeGroupSummary, GanttTaskItem } from "@/features/personnel/types/worktimeGroup.types";
import { cn } from "@/lib/utils";

interface WorktimeGroupGanttRowProps {
	employee: EmployeeGroupSummary;
}

export function WorktimeGroupGanttRow({ employee }: WorktimeGroupGanttRowProps) {
	return (
		<div className="flex border-b border-slate-100 hover:bg-slate-50/40 transition-colors h-14 items-center">
			{/* Employee Info Header Column */}
			<div className="w-56 min-w-[200px] px-4 shrink-0 flex items-center gap-3">
				<div className="h-8 w-8 rounded-full bg-slate-800 text-white text-xs font-semibold flex items-center justify-center shrink-0">
					{employee.initials}
				</div>
				<div className="min-w-0">
					<p className="text-xs font-bold text-slate-900 truncate">{employee.name}</p>
					<p className="text-[11px] text-slate-400 font-normal truncate">
						{employee.role}
					</p>
				</div>
			</div>

			{/* Timeline 10-day grid track matching Figma Image 3 */}
			<div className="flex-1 grid grid-cols-10 relative h-full border-l border-slate-100">
				{/* 10 background column dividers */}
				{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((dayIdx) => (
					<div
						key={dayIdx}
						className="h-full border-r border-slate-100"
					/>
				))}

				{/* Floating Gantt Bars positioned over the 10-day grid */}
				<div className="absolute inset-0 grid grid-cols-10 items-center px-0.5 pointer-events-none">
					{employee.ganttTasks.map((task: GanttTaskItem) => {
						const colStart = Math.min(Math.max(task.startDayIndex + 1, 1), 10);
						const colSpan = Math.min(task.durationDays, 11 - colStart);

						return (
							<div
								key={task.id}
								style={{
									gridColumnStart: colStart,
									gridColumnEnd: `span ${colSpan}`,
								}}
								className="pointer-events-auto my-auto px-0.5"
							>
								<div
									className={cn(
										"h-7 rounded-sm px-2 flex items-center text-left text-white shadow-2xs transition-transform hover:brightness-105 cursor-pointer",
										task.colorClass
									)}
									title={`${task.title} (${task.project})`}
								>
									<span className="text-[11px] font-normal truncate text-white leading-tight">
										{task.title}
									</span>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
