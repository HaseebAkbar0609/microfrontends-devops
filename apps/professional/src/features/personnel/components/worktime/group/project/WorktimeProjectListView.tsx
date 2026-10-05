"use client";

import React from "react";
import {
	ProjectGroupSummary,
	WorktimeProjectTotals,
} from "@/features/personnel/types/worktimeGroup.types";
import { WorktimeProjectListRow } from "./WorktimeProjectListRow";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface WorktimeProjectListViewProps {
	projects: ProjectGroupSummary[];
	totals: WorktimeProjectTotals;
	expandedProjects: Record<string, boolean>;
	onToggleExpand: (projectId: string) => void;
}

export function WorktimeProjectListView({
	projects,
	totals,
	expandedProjects,
	onToggleExpand,
}: WorktimeProjectListViewProps) {
	return (
		<div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
			<div className="overflow-x-auto">
				<table className="w-full text-left border-collapse min-w-[760px]">
					<thead>
						<tr className="bg-white border-b border-slate-200 text-2xs font-semibold text-slate-500 uppercase tracking-wider">
							<th className="py-3 px-4 text-left">
								<Translate text={localizationConstants.worktimeGroupColProjectOrder} />
							</th>
							<th className="py-3 px-4 text-left">
								<Translate text={localizationConstants.worktimeGroupColCustomer} />
							</th>
							<th className="py-3 px-4 text-center">
								<Translate text={localizationConstants.worktimeGroupColLoggedTim} />
							</th>
							<th className="py-3 px-4 text-center">
								<Translate text={localizationConstants.worktimeGroupColOtTim} />
							</th>
							<th className="py-3 px-4 text-center">
								<Translate text={localizationConstants.worktimeGroupColAtaTim} />
							</th>
							<th className="py-3 px-4 text-center">
								<Translate text={localizationConstants.worktimeGroupColNumPersons} />
							</th>
							<th className="py-3 px-4 text-center">
								<Translate text={localizationConstants.worktimeGroupColTravel} />
							</th>
							<th className="py-3 px-4 text-center">
								<Translate text={localizationConstants.worktimeGroupColFlags} />
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100">
						{projects.length === 0 ? (
							<tr>
								<td colSpan={8} className="py-12 text-center text-xs text-slate-500">
									<Translate text={localizationConstants.worktimeGroupEmptyProjects} />
								</td>
							</tr>
						) : (
							projects.map((proj) => (
								<WorktimeProjectListRow
									key={proj.id}
									project={proj}
									isExpanded={Boolean(expandedProjects[proj.id])}
									onToggleExpand={onToggleExpand}
								/>
							))
						)}
					</tbody>
					{projects.length > 0 && (
						<tfoot>
							<tr className="bg-white border-t border-slate-200 text-xs font-bold text-slate-900">
								<td className="py-3 px-4">
									<Translate text={localizationConstants.worktimeGroupTotalRowLabel} />
								</td>
								<td className="py-3 px-4" />
								<td className="py-3 px-4 text-center text-slate-900 font-bold">
									{totals.totalLogged}h
								</td>
								<td className="py-3 px-4 text-center text-amber-600 font-bold">
									{totals.totalOt}h
								</td>
								<td className="py-3 px-4 text-center text-indigo-600 font-bold">
									{totals.totalAta}h
								</td>
								<td className="py-3 px-4 text-center" />
								<td className="py-3 px-4 text-center" />
								<td className="py-3 px-4 text-center" />
							</tr>
						</tfoot>
					)}
				</table>
			</div>
		</div>
	);
}
