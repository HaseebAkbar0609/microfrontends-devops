"use client";

import React from "react";
import { EmployeeGroupSummary, WorktimeGroupTotals } from "@/features/personnel/types/worktimeGroup.types";
import { WorktimeGroupListRow } from "./WorktimeGroupListRow";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface WorktimeGroupListViewProps {
	employees: EmployeeGroupSummary[];
	totals: WorktimeGroupTotals;
	expandedEmployees: Record<string, boolean>;
	onToggleExpand: (employeeId: string) => void;
	onApproveDay: (employeeId: string, dayId: string) => void;
	onRejectDay: (employeeId: string, dayId: string) => void;
}

export function WorktimeGroupListView({
	employees,
	totals,
	expandedEmployees,
	onToggleExpand,
	onApproveDay,
	onRejectDay,
}: WorktimeGroupListViewProps) {
	return (
		<div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
			<div className="overflow-x-auto">
				<table className="w-full text-left border-collapse min-w-[800px]">
					<thead>
						<tr className="bg-white border-b border-slate-200 text-2xs font-semibold text-slate-500 uppercase tracking-wider">
							<th className="py-3 px-4 w-72 min-w-[220px]">
								<Translate text={localizationConstants.worktimeGroupColEmployee} />
							</th>
							<th className="py-3 px-3 text-center">
								<Translate text={localizationConstants.worktimeGroupColPlanned} />
							</th>
							<th className="py-3 px-3 text-center">
								<Translate text={localizationConstants.worktimeGroupColLogged} />
							</th>
							<th className="py-3 px-3 text-center">
								<Translate text={localizationConstants.worktimeGroupColOt} />
							</th>
							<th className="py-3 px-3 text-center">
								<Translate text={localizationConstants.worktimeGroupColAta} />
							</th>
							<th className="py-3 px-3 text-center">
								<Translate text={localizationConstants.worktimeGroupColTravel} />
							</th>
							<th className="py-3 px-3 text-center">
								<Translate text={localizationConstants.worktimeGroupColStatus} />
							</th>
							<th className="py-3 px-4 text-center">
								<Translate text={localizationConstants.worktimeGroupColActions} />
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100">
						{employees.length === 0 ? (
							<tr>
								<td colSpan={8} className="py-12 text-center text-xs text-slate-500">
									<Translate text={localizationConstants.worktimeGroupEmptyEmployees} />
								</td>
							</tr>
						) : (
							employees.map((emp) => (
								<WorktimeGroupListRow
									key={emp.id}
									employee={emp}
									isExpanded={Boolean(expandedEmployees[emp.id])}
									onToggleExpand={onToggleExpand}
									onApproveDay={onApproveDay}
									onRejectDay={onRejectDay}
								/>
							))
						)}
					</tbody>
					{employees.length > 0 && (
						<tfoot>
							<tr className="bg-white border-t border-slate-200 text-xs font-bold text-slate-900">
								<td className="py-3.5 px-4 font-bold text-slate-900">
									<Translate text={localizationConstants.worktimeGroupTotalRowLabel} />
								</td>
								<td className="py-3.5 px-3 text-center text-slate-700 font-medium">
									{totals.totalPlanned}h
								</td>
								<td className="py-3.5 px-3 text-center font-bold text-slate-900">
									{totals.totalLogged}h
								</td>
								<td className="py-3.5 px-3 text-center">
									{totals.totalOt > 0 ? (
										<span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-0.5 rounded-full inline-block">
											{totals.totalOt}h
										</span>
									) : (
										"—"
									)}
								</td>
								<td className="py-3.5 px-3 text-center">
									{totals.totalAta > 0 ? (
										<span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full inline-block">
											{totals.totalAta}h
										</span>
									) : (
										"—"
									)}
								</td>
								<td className="py-3.5 px-3 text-center text-slate-700 font-medium" colSpan={3} />
							</tr>
						</tfoot>
					)}
				</table>
			</div>
		</div>
	);
}
