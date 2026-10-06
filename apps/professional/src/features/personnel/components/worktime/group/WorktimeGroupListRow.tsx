"use client";

import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { EmployeeGroupSummary } from "@/features/personnel/types/worktimeGroup.types";
import { WorktimeGroupListSubRow } from "./WorktimeGroupListSubRow";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface WorktimeGroupListRowProps {
	employee: EmployeeGroupSummary;
	isExpanded: boolean;
	onToggleExpand: (employeeId: string) => void;
	onApproveDay: (employeeId: string, dayId: string) => void;
	onRejectDay: (employeeId: string, dayId: string) => void;
	onRemind?: (employeeId: string) => void;
}

export function WorktimeGroupListRow({
	employee,
	isExpanded,
	onToggleExpand,
	onApproveDay,
	onRejectDay,
	onRemind,
}: WorktimeGroupListRowProps) {
	return (
		<React.Fragment>
			{/* Main Row */}
			<tr
				onClick={() => onToggleExpand(employee.id)}
				className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors cursor-pointer text-xs"
			>
				{/* Employee Column with Avatar & Caret */}
				<td className="py-3.5 px-4 font-medium text-slate-900">
					<div className="flex items-center gap-2.5">
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								onToggleExpand(employee.id);
							}}
							className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer p-0.5"
						>
							{isExpanded ? (
								<ChevronDown className="w-4 h-4 text-slate-500" />
							) : (
								<ChevronRight className="w-4 h-4 text-slate-500" />
							)}
						</button>

						<div className="h-8 w-8 rounded-full bg-slate-800 text-white text-xs font-semibold flex items-center justify-center shrink-0">
							{employee.initials}
						</div>

						<div className="min-w-0">
							<p className="font-bold text-slate-900 truncate">{employee.name}</p>
							<p className="text-[11px] text-slate-400 font-normal truncate">
								{employee.empCode || employee.role}
							</p>
						</div>
					</div>
				</td>

				{/* Planned */}
				<td className="py-3.5 px-3 text-center text-slate-600 font-medium">
					{employee.plannedHours}h
				</td>

				{/* Logged */}
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

				{/* Status Pill */}
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
						) : employee.status === "returned" ? (
							<span className="bg-rose-50 text-rose-700 border border-rose-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
								<Translate text={localizationConstants.worktimeGroupStatusReturned} />
							</span>
						) : employee.status === "mangler" ? (
							<span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
								<Translate text={localizationConstants.worktimeGroupStatusMangler} />
							</span>
						) : (
							<span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
								<Translate text={localizationConstants.worktimeGroupStatusGodkand} />
							</span>
						)}
					</div>
				</td>

				{/* Action Button */}
				<td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
					{employee.status === "mangler" && onRemind ? (
						<button
							type="button"
							onClick={() => onRemind(employee.id)}
							className="inline-flex items-center justify-center bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium px-4 py-1.5 rounded-md cursor-pointer transition-colors shadow-2xs"
						>
							<Translate text={localizationConstants.worktimeGroupBtnRemind} />
						</button>
					) : (
						<button
							type="button"
							onClick={() => onToggleExpand(employee.id)}
							className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium px-4 py-1.5 rounded-md cursor-pointer transition-colors shadow-2xs"
						>
							<Translate text={localizationConstants.worktimeGroupBtnGranska} />
						</button>
					)}
				</td>
			</tr>

			{/* Expandable Sub-table for Employee Days */}
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
								<tbody>
									{employee.days.map((day) => (
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
		</React.Fragment>
	);
}
