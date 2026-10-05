"use client";

import React from "react";
import { ChevronRight, Minus } from "lucide-react";
import { EmployeeGroupSummary, EmployeeDayBreakdown } from "@/features/personnel/types/worktimeGroup.types";
import { WorktimeGroupListSubRow } from "./WorktimeGroupListSubRow";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { cn } from "@/lib/utils";

interface WorktimeGroupListRowProps {
	employee: EmployeeGroupSummary;
	isExpanded: boolean;
	onToggleExpand: (employeeId: string) => void;
	onApproveDay: (employeeId: string, dayId: string) => void;
	onRejectDay: (employeeId: string, dayId: string) => void;
}

export function WorktimeGroupListRow({
	employee,
	isExpanded,
	onToggleExpand,
	onApproveDay,
	onRejectDay,
}: WorktimeGroupListRowProps) {
	return (
		<>
			{/* Main Employee Row matching Figma Image 2 */}
			<tr
				className={cn(
					"border-b border-slate-100 hover:bg-slate-50/50 transition-colors cursor-pointer text-xs",
					isExpanded && "bg-slate-50/30"
				)}
				onClick={() => onToggleExpand(employee.id)}
			>
				{/* Caret, Avatar, Name & Code */}
				<td className="py-3.5 px-4 w-72 min-w-[220px]">
					<div className="flex items-center gap-3">
						<span className="text-slate-400 w-3.5 flex items-center justify-center shrink-0">
							{isExpanded ? (
								<Minus className="w-3.5 h-3.5 text-slate-500" />
							) : (
								<ChevronRight className="w-3.5 h-3.5 text-slate-400" />
							)}
						</span>
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

				{/* Planned Hours */}
				<td className="py-3.5 px-3 text-center text-slate-600 font-medium">
					{employee.plannedHours}h
				</td>

				{/* Logged Hours */}
				<td className="py-3.5 px-3 text-center font-bold text-slate-900">
					{employee.loggedHours}h
				</td>

				{/* OT */}
				<td className="py-3.5 px-3 text-center">
					{employee.otHours > 0 ? (
						<span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-0.5 rounded-full inline-block">
							{employee.otHours}h
						</span>
					) : (
						<span className="text-slate-400">—</span>
					)}
				</td>

				{/* ATA */}
				<td className="py-3.5 px-3 text-center">
					{employee.ataHours > 0 ? (
						<span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full inline-block">
							{employee.ataHours}h
						</span>
					) : (
						<span className="text-slate-400">—</span>
					)}
				</td>

				{/* Travel KM */}
				<td className="py-3.5 px-3 text-center text-slate-600 font-medium">
					{employee.travelKm > 0 ? `${employee.travelKm} km` : <span className="text-slate-400">—</span>}
				</td>

				{/* Status Pill matching Figma */}
				<td className="py-3.5 px-3 text-center">
					<div className="inline-flex items-center gap-1.5 justify-center">
						{employee.status === "inkickad" ? (
							<>
								<span className="bg-sky-50 text-sky-700 border border-sky-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
									<Translate text={localizationConstants.worktimeGroupStatusInkickad} />
								</span>
								{employee.statusCount && (
									<span className="text-xs text-slate-500 font-medium">{employee.statusCount}</span>
								)}
							</>
						) : (
							<span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
								<Translate text={localizationConstants.worktimeGroupStatusGodkand} />
							</span>
						)}
					</div>
				</td>

				{/* Granska Action Button matching Figma */}
				<td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
					<button
						type="button"
						onClick={() => onToggleExpand(employee.id)}
						className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium px-4 py-1.5 rounded-md cursor-pointer transition-colors shadow-2xs"
					>
						<Translate text={localizationConstants.worktimeGroupBtnGranska} />
					</button>
				</td>
			</tr>

			{/* Expandable Sub-table for Employee Days matching Figma Image 2 */}
			{isExpanded && employee.days && employee.days.length > 0 && (
				<tr className="bg-slate-50/40 border-b border-slate-200">
					<td colSpan={8} className="py-2 px-6 sm:px-12">
						<div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs my-1">
							<table className="w-full text-left border-collapse text-xs">
								<thead>
									<tr className="bg-white border-b border-slate-200 text-2xs font-semibold text-slate-500 uppercase tracking-wider">
										<th className="py-2 px-4 w-44">
											<Translate text={localizationConstants.worktimeGroupColDay} />
										</th>
										<th className="py-2 px-3 text-center">
											<Translate text={localizationConstants.worktimeGroupColTotalHours} />
										</th>
										<th className="py-2 px-3 text-center">
											<Translate text={localizationConstants.worktimeGroupColOt} />
										</th>
										<th className="py-2 px-3 text-center">
											<Translate text={localizationConstants.worktimeGroupColAta} />
										</th>
										<th className="py-2 px-3 text-center">
											<Translate text={localizationConstants.worktimeGroupColTravel} />
										</th>
										<th className="py-2 px-4 text-center">
											<Translate text={localizationConstants.worktimeGroupColActions} />
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-100">
									{employee.days.map((day: EmployeeDayBreakdown) => (
										<WorktimeGroupListSubRow
											key={day.id}
											day={day}
											employeeId={employee.id}
											onApproveDay={onApproveDay}
											onRejectDay={onRejectDay}
										/>
									))}
								</tbody>
							</table>
						</div>
					</td>
				</tr>
			)}
		</>
	);
}
