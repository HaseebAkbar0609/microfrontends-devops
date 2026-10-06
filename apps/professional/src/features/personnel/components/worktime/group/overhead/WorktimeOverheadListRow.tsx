"use client";

import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { OverheadEmployeeSummary } from "@/features/personnel/types/worktimeGroup.types";
import { WorktimeOverheadListSubRow } from "./WorktimeOverheadListSubRow";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { cn } from "@/lib/utils";

interface WorktimeOverheadListRowProps {
	employee: OverheadEmployeeSummary;
	isExpanded: boolean;
	onToggle: (id: string) => void;
}

export function WorktimeOverheadListRow({
	employee,
	isExpanded,
	onToggle,
}: WorktimeOverheadListRowProps) {
	const getStatusBadge = (status: OverheadEmployeeSummary["status"]) => {
		switch (status) {
			case "inkickad":
				return (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-2xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 shadow-2xs">
						<Translate text={localizationConstants.worktimeGroupStatusInkickad} />
					</span>
				);
			case "godkand":
				return (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-2xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
						<Translate text={localizationConstants.worktimeGroupStatusGodkand} />
					</span>
				);
			case "returned":
				return (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-2xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
						<Translate text={localizationConstants.worktimeGroupStatusReturned} />
					</span>
				);
			default:
				return (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-2xs font-semibold bg-slate-100 text-slate-600 border border-slate-200 shadow-2xs">
						<Translate text={localizationConstants.worktimeGroupStatusMangler} />
					</span>
				);
		}
	};

	return (
		<>
			{/* Main Summary Row */}
			<tr className="hover:bg-slate-50/70 transition-colors">
				{/* Caret + Initials Avatar + Name & Code */}
				<td className="py-3.5 px-4 min-w-[200px]">
					<div className="flex items-center gap-2.5">
						<button
							type="button"
							onClick={() => onToggle(employee.id)}
							className="p-0.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
							aria-label={isExpanded ? "Collapse row" : "Expand row"}
						>
							{isExpanded ? (
								<ChevronDown className="w-4 h-4 text-slate-500" />
							) : (
								<ChevronRight className="w-4 h-4 text-slate-400" />
							)}
						</button>
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
						</div>
					</div>
				</td>

				{/* TOTAL ÖH */}
				<td className="py-3.5 px-4">
					<span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
						{employee.totalOhHours}h
					</span>
				</td>

				{/* LOGGAT TIM */}
				<td className="py-3.5 px-4 text-xs font-medium text-slate-700">
					{employee.loggedHours}h
				</td>

				{/* ÖH DAGAR */}
				<td className="py-3.5 px-4 text-xs font-bold text-slate-800">
					{employee.ohDaysCount}
				</td>

				{/* TOPPPROJEKT */}
				<td className="py-3.5 px-4 text-xs font-medium text-slate-700">
					{employee.topProject}
				</td>

				{/* FLAGGOR */}
				<td className="py-3.5 px-4">
					{employee.flags && employee.flags > 0 ? (
						<span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-2xs font-bold bg-rose-50 text-rose-600 border border-rose-200">
							{employee.flags}
						</span>
					) : (
						<span className="text-xs text-slate-300 font-normal">—</span>
					)}
				</td>

				{/* STATUS */}
				<td className="py-3.5 px-4">
					{getStatusBadge(employee.status)}
				</td>
			</tr>

			{/* Expanded Detail Sub-Table */}
			{isExpanded && (
				<>
					{/* Sub-table Header */}
					<tr className="bg-slate-100/70 border-t border-slate-200 text-2xs font-bold text-slate-500 uppercase tracking-wider">
						<th className="py-2 pl-12 pr-4 text-left">
							<Translate text={localizationConstants.worktimeGroupColDay} />
						</th>
						<th className="py-2 px-4 text-left">
							<Translate text={localizationConstants.worktimeGroupColOhTim} />
						</th>
						<th className="py-2 px-4 text-left">
							<Translate text={localizationConstants.worktimeGroupColAssociatedProject} />
						</th>
						<th colSpan={4} className="py-2 px-4 text-left">
							<Translate text={localizationConstants.worktimeGroupColTimeInterval} />
						</th>
					</tr>

					{/* Sub-rows */}
					{employee.overtimeEntries.map((entry) => (
						<WorktimeOverheadListSubRow key={entry.id} entry={entry} />
					))}
				</>
			)}
		</>
	);
}
