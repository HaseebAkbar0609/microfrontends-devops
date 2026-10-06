"use client";

import React from "react";
import { ProjectGanttRowItem } from "@/features/personnel/types/worktimeGroup.types";
import { cn } from "@/lib/utils";

interface WorktimeProjectGanttRowProps {
	row: ProjectGanttRowItem;
	isMonthView?: boolean;
}

export function WorktimeProjectGanttRow({
	row,
	isMonthView = false,
}: WorktimeProjectGanttRowProps) {
	const totalCols = isMonthView ? 4 : 10;

	return (
		<div className="flex items-center min-h-[44px] hover:bg-slate-50/50 transition-colors">
			{/* Project Name & Code */}
			<div className="w-56 min-w-[200px] py-2 px-4 shrink-0 flex flex-col justify-center">
				<span className="text-xs font-bold text-slate-900 tracking-tight">
					{row.name}
				</span>
				<span className="text-[11px] text-slate-400 font-medium">
					{row.code}
				</span>
			</div>

			{/* Timeline Grid with Task Bars */}
			<div className="flex-1 relative h-10 border-l border-slate-100 flex items-center">
				{/* Background Grid Lines */}
				<div
					className={cn(
						"absolute inset-0 grid pointer-events-none",
						isMonthView ? "grid-cols-4" : "grid-cols-10"
					)}
				>
					{Array.from({ length: totalCols }).map((_, i) => (
						<div key={i} className="border-r border-slate-100/70 h-full" />
					))}
				</div>

				{/* Task Bars Overlay */}
				{row.tasks.map((task) => {
					const leftPercent = isMonthView
						? (Math.min(Math.floor(task.startDayIndex / 2.5), 3) / totalCols) * 100
						: (task.startDayIndex / totalCols) * 100;

					const widthPercent = isMonthView
						? (Math.max(1, Math.min(Math.ceil(task.durationDays / 2.5), 4)) / totalCols) * 100
						: (task.durationDays / totalCols) * 100;

					return (
						<div
							key={task.id}
							className={cn(
								"absolute h-7 rounded-md px-2.5 flex items-center shadow-xs text-xs font-medium truncate select-none cursor-default",
								task.colorClass
							)}
							style={{
								left: `${leftPercent}%`,
								width: `calc(${widthPercent}% - 4px)`,
							}}
							title={task.title}
						>
							<span className="truncate text-xs font-medium">
								{task.title}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}
