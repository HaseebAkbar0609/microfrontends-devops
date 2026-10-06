"use client";

import React from "react";
import { OverheadEmployeeSummary, DailyGroupTotal } from "@/features/personnel/types/worktimeGroup.types";
import { WorktimeOverheadCalendarRow } from "./WorktimeOverheadCalendarRow";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface WorktimeOverheadCalendarGridProps {
	employees: OverheadEmployeeSummary[];
	dailyTotals: DailyGroupTotal[];
}

export function WorktimeOverheadCalendarGrid({
	employees,
	dailyTotals,
}: WorktimeOverheadCalendarGridProps) {
	return (
		<div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
			<div className="overflow-x-auto">
				<table className="w-full text-left border-collapse min-w-[760px]">
					<thead>
						<tr className="bg-white border-b border-slate-200">
							<th className="py-3 px-4 w-60 min-w-[200px] text-xs font-semibold text-slate-500 uppercase tracking-wider">
								<Translate text={localizationConstants.worktimeGroupColEmployeeOnlyOt} />
							</th>
							{dailyTotals.map((col) => (
								<th
									key={col.dayIndex}
									className="py-2.5 px-3 text-center border-l border-slate-100 min-w-[85px]"
								>
									<div className="flex flex-col items-center">
										<span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
											{col.dayLabel}
										</span>
										{col.dayDate && (
											<span className="text-[10px] text-slate-400 font-normal">
												{col.dayDate}
											</span>
										)}
									</div>
								</th>
							))}
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100">
						{employees.length === 0 ? (
							<tr>
								<td colSpan={dailyTotals.length + 1} className="py-12 text-center text-xs text-slate-500">
									<Translate text={localizationConstants.worktimeGroupEmptyOverhead} />
								</td>
							</tr>
						) : (
							employees.map((emp) => (
								<WorktimeOverheadCalendarRow
									key={emp.id}
									employee={emp}
									columns={dailyTotals}
								/>
							))
						)}
					</tbody>
					{employees.length > 0 && (
						<tfoot>
							<tr className="bg-white border-t border-slate-200 text-xs text-slate-900 font-bold">
								<td className="py-3 px-4 font-bold text-slate-900">
									<Translate text={localizationConstants.worktimeGroupTotalOtDay} />
								</td>
								{dailyTotals.map((tot) => (
									<td
										key={tot.dayIndex}
										className="py-2.5 px-3 text-center border-l border-slate-100 align-top"
									>
										<div className="flex flex-col items-center">
											<span className="text-xs font-bold text-amber-600">
												{tot.totalHours > 0 ? `${tot.totalHours}h` : "—"}
											</span>
										</div>
									</td>
								))}
							</tr>
						</tfoot>
					)}
				</table>
			</div>
		</div>
	);
}
