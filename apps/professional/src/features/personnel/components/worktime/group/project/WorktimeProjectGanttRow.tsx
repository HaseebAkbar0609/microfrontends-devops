"use client";

import React from "react";
import { ProjectGanttRowItem } from "@/features/personnel/types/worktimeGroup.types";
import { cn } from "@/lib/utils";

interface WorktimeProjectGanttRowProps {
	row: ProjectGanttRowItem;
}

export function WorktimeProjectGanttRow({ row }: WorktimeProjectGanttRowProps) {
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

			{/* Timeline Grid (10 Columns) with Task Bars */}
			<div className="flex-1 relative h-10 border-l border-slate-100 flex items-center">
				{/* Background Grid Lines for 10 Days */}
				<div className="absolute inset-0 grid grid-cols-10 pointer-events-none">
					{Array.from({ length: 10 }).map((_, i) => (
						<div key={i} className="border-r border-slate-100/70 h-full" />
					))}
				</div>

				{/* Task Bars Overlay */}
				{row.tasks.map((task) => {
					// 10-column percentage positioning
					const leftPercent = (task.startDayIndex / 10) * 100;
					const widthPercent = (task.durationDays / 10) * 100;

					return (
						<div
							key={task.id}
							className={cn(
								"absolute h-7 rounded-md px-2.5 flex items-center shadow-xs text-xs font-medium truncate select-none cursor-pointer hover:brightness-105 transition-all",
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
