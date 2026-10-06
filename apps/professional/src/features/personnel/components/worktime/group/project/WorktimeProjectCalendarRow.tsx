"use client";

import React from "react";
import { Users } from "lucide-react";
import { ProjectGroupSummary, DailyGroupTotal } from "@/features/personnel/types/worktimeGroup.types";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface WorktimeProjectCalendarRowProps {
	project: ProjectGroupSummary;
	columns: DailyGroupTotal[];
}

export function WorktimeProjectCalendarRow({ project, columns }: WorktimeProjectCalendarRowProps) {
	return (
		<tr className="hover:bg-slate-50/70 transition-colors">
			{/* Project Name, Code & Customer */}
			<td className="py-3 px-4 w-60 min-w-[200px] align-top">
				<div className="flex flex-col">
					<span className="text-xs font-bold text-slate-900 tracking-tight">
						{project.name}
					</span>
					<span className="text-[11px] text-slate-400 font-medium">
						{project.code}
					</span>
					<span className="text-[11px] text-slate-400 font-normal truncate max-w-[190px]">
						{project.customer}
					</span>
				</div>
			</td>

			{/* Day cells rendered by looking up dayIndex from columns */}
			{columns.map((col) => {
				const day = project.days?.find((d) => d.dayIndex === col.dayIndex);
				return (
					<td
						key={col.dayIndex}
						className="py-3 px-3 text-center border-l border-slate-100 align-top min-w-[85px]"
					>
						{day && day.hours > 0 ? (
							<div className="flex flex-col items-center">
								<span className="text-xs font-bold text-slate-900">
									{day.hours}h
								</span>
								<div className="flex items-center gap-1 text-[11px] text-slate-500 font-normal mt-0.5">
									<Users className="w-3 h-3 text-slate-400" />
									<span>
										{day.personCount}{" "}
										<Translate text={localizationConstants.worktimeGroupPersonsSuffix} />
									</span>
								</div>
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
