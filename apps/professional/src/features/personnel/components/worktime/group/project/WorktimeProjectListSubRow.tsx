"use client";

import React from "react";
import { ProjectEmployeeItem } from "@/features/personnel/types/worktimeGroup.types";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { cn } from "@/lib/utils";

interface WorktimeProjectListSubRowProps {
	employee: ProjectEmployeeItem;
}

export function WorktimeProjectListSubRow({ employee }: WorktimeProjectListSubRowProps) {
	return (
		<tr className="bg-slate-50/50 hover:bg-slate-100/60 transition-colors border-t border-slate-100/80">
			{/* Employee Avatar & Name */}
			<td className="py-2.5 px-4 pl-10 text-xs">
				<div className="flex items-center gap-3">
					<div
						className={cn(
							"w-7 h-7 rounded-full flex items-center justify-center font-bold text-2xs text-white shrink-0 shadow-2xs",
							employee.avatarColor || "bg-slate-800"
						)}
					>
						{employee.initials}
					</div>
					<div className="flex flex-col">
						<span className="font-semibold text-slate-800">{employee.name}</span>
						<span className="text-[10px] text-slate-400 font-mono">
							{employee.empCode}
						</span>
					</div>
				</div>
			</td>

			{/* Logged hours */}
			<td className="py-2.5 px-4 text-center text-xs font-semibold text-slate-900">
				{employee.loggedHours}h
			</td>

			{/* ÖT Tim */}
			<td className="py-2.5 px-4 text-center text-xs">
				{employee.otHours > 0 ? (
					<span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-2xs font-semibold bg-amber-100 text-amber-800">
						{employee.otHours}h
					</span>
				) : (
					<span className="text-slate-300 font-normal">—</span>
				)}
			</td>

			{/* ATA Tim */}
			<td className="py-2.5 px-4 text-center text-xs">
				{employee.ataHours > 0 ? (
					<span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-2xs font-semibold bg-indigo-100 text-indigo-800">
						{employee.ataHours}h
					</span>
				) : (
					<span className="text-slate-300 font-normal">—</span>
				)}
			</td>

			{/* Dagar arbetade */}
			<td className="py-2.5 px-4 text-center text-xs font-medium text-slate-700">
				{employee.daysWorked}
			</td>

			{/* Flaggor */}
			<td className="py-2.5 px-4 text-center text-xs">
				{employee.flags && employee.flags > 0 ? (
					<span className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold bg-rose-500 text-white shadow-2xs">
						{employee.flags}
					</span>
				) : (
					<span className="text-slate-300 font-normal">—</span>
				)}
			</td>

			{/* Status */}
			<td className="py-2.5 px-4 text-center text-xs">
				{employee.status === "inkickad" ? (
					<span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-2xs font-medium bg-blue-50 text-blue-600 border border-blue-200">
						<Translate text={localizationConstants.worktimeGroupStatusInkickad} />
					</span>
				) : (
					<span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-2xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-200">
						<Translate text={localizationConstants.worktimeGroupStatusGodkand} />
					</span>
				)}
			</td>
		</tr>
	);
}
