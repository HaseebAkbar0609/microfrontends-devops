"use client";

import React from "react";
import { EmployeeGroupSummary, GanttTaskItem } from "@/features/personnel/types/worktimeGroup.types";
import { cn } from "@/lib/utils";

interface WorktimeGroupGanttRowProps {
	employee: EmployeeGroupSummary;
	isMonthView?: boolean;
}

export function WorktimeGroupGanttRow({ employee, isMonthView = false }: WorktimeGroupGanttRowProps) {
	const totalCols = isMonthView ? 4 : 10;

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

			{/* Timeline Grid Track */}
			<div
				className={cn(
					"flex-1 relative h-full border-l border-slate-100 grid",
					isMonthView ? "grid-cols-4" : "grid-cols-10"
				)}
			>
				{/* Background column dividers */}
				{Array.from({ length: totalCols }).map((_, colIdx) => (
					<div
						key={colIdx}
						className="h-full border-r border-slate-100"
					/>
				))}

				{/* Floating Gantt Bars */}
				<div
					className={cn(
						"absolute inset-0 items-center px-0.5 pointer-events-none grid",
						isMonthView ? "grid-cols-4" : "grid-cols-10"
					)}
				>
					{employee.ganttTasks.map((task: GanttTaskItem) => {
						const colStart = isMonthView
							? Math.min(Math.floor(task.startDayIndex / 2.5) + 1, 4)
							: Math.min(Math.max(task.startDayIndex + 1, 1), 10);
						const colSpan = isMonthView
							? Math.max(1, Math.min(Math.ceil(task.durationDays / 2.5), 5 - colStart))
							: Math.min(task.durationDays, 11 - colStart);

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
