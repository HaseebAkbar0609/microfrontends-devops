"use client";

import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ProjectGroupSummary } from "@/features/personnel/types/worktimeGroup.types";
import { WorktimeProjectListSubRow } from "./WorktimeProjectListSubRow";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface WorktimeProjectListRowProps {
	project: ProjectGroupSummary;
	isExpanded: boolean;
	onToggleExpand: (projectId: string) => void;
}

export function WorktimeProjectListRow({
	project,
	isExpanded,
	onToggleExpand,
}: WorktimeProjectListRowProps) {
	const { t } = useTranslation();

	return (
		<React.Fragment>
			{/* Main Project Row */}
			<tr
				onClick={() => onToggleExpand(project.id)}
				className="hover:bg-slate-50/80 cursor-pointer transition-colors select-none"
			>
				{/* PROJEKT / ORDER with Caret */}
				<td className="py-3 px-4 text-xs">
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								onToggleExpand(project.id);
							}}
							className="text-slate-400 hover:text-slate-700 transition-colors p-0.5 cursor-pointer"
							aria-label={
								isExpanded
									? t(localizationConstants.worktimeGroupCollapseRow)
									: t(localizationConstants.worktimeGroupExpandRow)
							}
						>
							{isExpanded ? (
								<ChevronDown className="w-4 h-4 text-slate-500" />
							) : (
								<ChevronRight className="w-4 h-4 text-slate-500" />
							)}
						</button>
						<div className="flex flex-col">
							<span className="font-bold text-slate-900">{project.name}</span>
							<span className="text-[11px] text-slate-400 font-medium">
								{project.code}
							</span>
						</div>
					</div>
				</td>

				{/* KUND */}
				<td className="py-3 px-4 text-xs text-slate-600 font-normal">
					{project.customer}
				</td>

				{/* LOGGAT TIM */}
				<td className="py-3 px-4 text-center text-xs font-bold text-slate-900">
					{project.loggedHours}h
				</td>

				{/* ÖT TIM */}
				<td className="py-3 px-4 text-center text-xs">
					{project.otHours > 0 ? (
						<span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-2xs font-semibold bg-amber-100 text-amber-800">
							{project.otHours}h
						</span>
					) : (
						<span className="text-slate-300 font-normal">—</span>
					)}
				</td>

				{/* ATA TIM */}
				<td className="py-3 px-4 text-center text-xs">
					{project.ataHours > 0 ? (
						<span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-2xs font-semibold bg-indigo-100 text-indigo-800">
							{project.ataHours}h
						</span>
					) : (
						<span className="text-slate-300 font-normal">—</span>
					)}
				</td>

				{/* # PERSONER */}
				<td className="py-3 px-4 text-center text-xs font-semibold text-slate-900">
					{project.personCount}
				</td>

				{/* RESA (KM) */}
				<td className="py-3 px-4 text-center text-xs text-slate-600 font-medium">
					{project.travelKm} km
				</td>

				{/* FLAGGOR */}
				<td className="py-3 px-4 text-center text-xs">
					{project.flags && project.flags > 0 ? (
						<span className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold bg-rose-500 text-white shadow-2xs">
							{project.flags}
						</span>
					) : (
						<span className="text-slate-300 font-normal">—</span>
					)}
				</td>
			</tr>

			{/* Nested Employee Subtable */}
			{isExpanded && (
				<tr>
					<td colSpan={8} className="p-0 border-b border-slate-200">
						<div className="bg-slate-50/40 py-2 px-3">
							<table className="w-full text-left border-collapse">
								<thead>
									<tr className="text-2xs font-semibold text-slate-500 uppercase tracking-wider">
										<th className="py-2 px-4 pl-10 text-left">
											<Translate text={localizationConstants.worktimeGroupColEmployee} />
										</th>
										<th className="py-2 px-4 text-center">
											<Translate text={localizationConstants.worktimeGroupColLoggedTim} />
										</th>
										<th className="py-2 px-4 text-center">
											<Translate text={localizationConstants.worktimeGroupColOtTim} />
										</th>
										<th className="py-2 px-4 text-center">
											<Translate text={localizationConstants.worktimeGroupColAtaTim} />
										</th>
										<th className="py-2 px-4 text-center">
											<Translate text={localizationConstants.worktimeGroupColDaysWorked} />
										</th>
										<th className="py-2 px-4 text-center">
											<Translate text={localizationConstants.worktimeGroupColFlags} />
										</th>
										<th className="py-2 px-4 text-center">
											<Translate text={localizationConstants.worktimeGroupColStatus} />
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-100">
									{project.employees.map((emp) => (
										<WorktimeProjectListSubRow key={emp.id} employee={emp} />
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
