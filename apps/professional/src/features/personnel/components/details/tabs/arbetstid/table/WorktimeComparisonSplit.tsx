"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { FieldLogEntry, WorktimeAllocationItem } from "@/features/personnel/types/worktime.types";
import { WorktimeAllocationTable } from "./WorktimeAllocationTable";

interface WorktimeComparisonSplitProps {
	dayId: string;
	fieldLogs: FieldLogEntry[];
	allocations: WorktimeAllocationItem[];
	onAddObject: (dayId: string) => void;
	onDeleteAllocation?: (dayId: string, allocId: string) => void;
}

export function WorktimeComparisonSplit({
	dayId,
	fieldLogs,
	allocations,
	onAddObject,
	onDeleteAllocation,
}: WorktimeComparisonSplitProps) {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
			{/* Left Column: Field Log (Original mobile entries) - 5 cols */}
			<div className="lg:col-span-5 bg-slate-50/70 border border-slate-200 rounded-lg p-3 space-y-3">
				<div className="text-xs font-bold tracking-wider text-slate-600 uppercase">
					<Translate text={localizationConstants.worktimeFieldLogTitle} />
				</div>

				<div className="space-y-2.5">
					{fieldLogs.map((log) => (
						<div
							key={log.id}
							className="bg-white border border-slate-200 rounded-md p-3 text-xs space-y-1 shadow-2xs"
						>
							<p className="font-bold text-slate-800">{log.title}</p>
							<div className="flex items-center gap-3 text-slate-600 text-[11px] font-medium pt-0.5">
								<span>
									<span className="text-slate-400 mr-1">
										<Translate text={localizationConstants.worktimeFieldLogTime} />
									</span>
									{log.time}
								</span>
								<span>
									<span className="text-slate-400 mr-1">
										<Translate text={localizationConstants.worktimeFieldLogDuration} />
									</span>
									{log.duration}
								</span>
							</div>

							{(log.ot || log.ata || log.travel) && (
								<div className="flex items-center gap-2.5 text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex-wrap">
									{log.ot && (
										<span>
											<span className="text-slate-400 mr-1">
												<Translate text={localizationConstants.worktimeFieldLogOt} />
											</span>
											<span className="text-amber-700 font-semibold">{log.ot}</span>
										</span>
									)}
									{log.ata && (
										<span>
											<span className="text-slate-400 mr-1">
												<Translate text={localizationConstants.worktimeFieldLogAta} />
											</span>
											<span className="text-purple-700 font-semibold">{log.ata}</span>
										</span>
									)}
									{log.travel && (
										<span>
											<span className="text-slate-400 mr-1">
												<Translate text={localizationConstants.worktimeFieldLogTravel} />
											</span>
											<span className="text-sky-700 font-semibold">{log.travel}</span>
										</span>
									)}
								</div>
							)}
						</div>
					))}
				</div>
			</div>

			{/* Right Column: Billing Allocation Table - 7 cols */}
			<div className="lg:col-span-7">
				<WorktimeAllocationTable
					dayId={dayId}
					allocations={allocations}
					onAddObject={onAddObject}
					onDeleteAllocation={onDeleteAllocation}
					titleKey={localizationConstants.worktimeBillingAllocationTitle}
				/>
			</div>
		</div>
	);
}
