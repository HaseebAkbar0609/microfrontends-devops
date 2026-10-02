"use client";

import React from "react";
import { CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { WorktimeDayRecord } from "@/features/personnel/types/worktime.types";
import { WorktimeAllocationTable } from "./WorktimeAllocationTable";
import { WorktimeComparisonSplit } from "./WorktimeComparisonSplit";

interface WorktimeDayRowProps {
	day: WorktimeDayRecord;
	isExpanded: boolean;
	isComparisonOn: boolean;
	onToggleDay: (dayId: string) => void;
	onAddObject: (dayId: string) => void;
	onDeleteAllocation?: (dayId: string, allocId: string) => void;
}

export function WorktimeDayRow({
	day,
	isExpanded,
	isComparisonOn,
	onToggleDay,
	onAddObject,
	onDeleteAllocation,
}: WorktimeDayRowProps) {
	return (
		<div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs transition-all">
			{/* Accordion Header */}
			<div
				role="button"
				tabIndex={0}
				onClick={() => onToggleDay(day.id)}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						onToggleDay(day.id);
					}
				}}
				className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50/70 cursor-pointer select-none transition-colors"
			>
				<div className="flex items-center gap-2.5">
					<CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-50 shrink-0" />
					<span className="text-sm font-bold text-slate-900">
						{day.dayNameKey ? (
							<>
								<Translate
									text={
										localizationConstants[
											day.dayNameKey as keyof typeof localizationConstants
										]
									}
								/>{" "}
								{day.dayLabel}
							</>
						) : (
							day.dayLabel
						)}
					</span>
					{day.isModified && (
						<Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100 text-[10px] px-2 py-0.5 font-semibold">
							<Translate text={localizationConstants.worktimeBadgeModified} />
						</Badge>
					)}
				</div>

				<div className="flex items-center gap-3">
					<div className="text-xs text-slate-500 font-medium">
						<span>
							<Translate text={localizationConstants.worktimeLabelOriginal} />: {day.originalHours}h
						</span>
						<span className="mx-2 text-slate-300">•</span>
						<span className="font-semibold text-slate-800">
							<Translate text={localizationConstants.worktimeLabelFinal} />: {day.finalHours}h
						</span>
						{day.deviationHours !== 0 && (
							<span className="ml-2 font-bold text-emerald-600">
								+{day.deviationHours}h
							</span>
						)}
					</div>
					{isExpanded ? (
						<ChevronUp className="w-4 h-4 text-slate-400" />
					) : (
						<ChevronDown className="w-4 h-4 text-slate-400" />
					)}
				</div>
			</div>

			{/* Accordion Expanded Content */}
			{isExpanded && (
				<div className="p-4 pt-1 border-t border-slate-100 bg-slate-50/20">
					{isComparisonOn ? (
						<WorktimeComparisonSplit
							dayId={day.id}
							fieldLogs={day.fieldLogs}
							allocations={day.allocations}
							onAddObject={onAddObject}
							onDeleteAllocation={onDeleteAllocation}
						/>
					) : (
						<WorktimeAllocationTable
							dayId={day.id}
							allocations={day.allocations}
							onAddObject={onAddObject}
							onDeleteAllocation={onDeleteAllocation}
						/>
					)}
				</div>
			)}
		</div>
	);
}
