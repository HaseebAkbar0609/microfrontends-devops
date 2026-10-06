"use client";

import React from "react";
import { OverheadEmployeeSummary } from "@/features/personnel/types/worktimeGroup.types";
import { WorktimeOverheadListRow } from "./WorktimeOverheadListRow";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface WorktimeOverheadListViewProps {
	employees: OverheadEmployeeSummary[];
	expandedEmployees: Record<string, boolean>;
	onToggleEmployee: (employeeId: string) => void;
	totalOh: number;
}

export function WorktimeOverheadListView({
	employees,
	expandedEmployees,
	onToggleEmployee,
	totalOh,
}: WorktimeOverheadListViewProps) {
	return (
		<div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
			<div className="overflow-x-auto">
				<table className="w-full text-left border-collapse min-w-[800px]">
					<thead>
						<tr className="bg-white border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
							<th className="py-3 px-4 w-64 min-w-[200px]">
								<Translate text={localizationConstants.worktimeGroupColEmployee} />
							</th>
							<th className="py-3 px-4">
								<Translate text={localizationConstants.worktimeGroupColTotalOh} />
							</th>
							<th className="py-3 px-4">
								<Translate text={localizationConstants.worktimeGroupColLoggedTim} />
							</th>
							<th className="py-3 px-4">
								<Translate text={localizationConstants.worktimeGroupColOhDays} />
							</th>
							<th className="py-3 px-4">
								<Translate text={localizationConstants.worktimeGroupColTopProject} />
							</th>
							<th className="py-3 px-4">
								<Translate text={localizationConstants.worktimeGroupColFlags} />
							</th>
							<th className="py-3 px-4">
								<Translate text={localizationConstants.worktimeGroupColStatus} />
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100">
						{employees.length === 0 ? (
							<tr>
								<td colSpan={7} className="py-12 text-center text-xs text-slate-500">
									<Translate text={localizationConstants.worktimeGroupEmptyOverhead} />
								</td>
							</tr>
						) : (
							employees.map((emp) => (
								<WorktimeOverheadListRow
									key={emp.id}
									employee={emp}
									isExpanded={!!expandedEmployees[emp.id]}
									onToggle={onToggleEmployee}
								/>
							))
						)}
					</tbody>
					{employees.length > 0 && (
						<tfoot>
							<tr className="bg-white border-t border-slate-200 text-xs text-slate-900 font-bold">
								<td className="py-3.5 px-4 font-bold text-slate-900">
									<Translate text={localizationConstants.worktimeGroupTotalOvertime} />
								</td>
								<td className="py-3.5 px-4 font-bold text-amber-600">
									{totalOh}h
								</td>
								<td colSpan={5} className="py-3.5 px-4" />
							</tr>
						</tfoot>
					)}
				</table>
			</div>
		</div>
	);
}
