"use client";

import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { WeeklyTimesheetData, WorktimeDayRecord } from "@/features/personnel/types/worktime.types";
import { WorktimeSummaryKpis } from "./WorktimeSummaryKpis";
import { WorktimeDayRow } from "./WorktimeDayRow";

interface WorktimeTableViewProps {
	timesheet: WeeklyTimesheetData;
	isComparisonOn: boolean;
	expandedDays: Record<string, boolean>;
	onToggleComparison: () => void;
	onToggleDay: (dayId: string) => void;
	onAddObject: (dayId: string) => void;
	onDeleteAllocation?: (dayId: string, allocId: string) => void;
}

export function WorktimeTableView({
	timesheet,
	isComparisonOn,
	expandedDays,
	onToggleComparison,
	onToggleDay,
	onAddObject,
	onDeleteAllocation,
}: WorktimeTableViewProps) {
	return (
		<div className="space-y-6">
			{/* Top KPI Cards */}
			<WorktimeSummaryKpis
				originalTotalHours={timesheet.originalTotalHours}
				originalOtHours={timesheet.originalOtHours}
				originalAtaHours={timesheet.originalAtaHours}
				originalTravelKm={timesheet.originalTravelKm}
				finalTotalHours={timesheet.finalTotalHours}
				finalOtHours={timesheet.finalOtHours}
				finalAtaHours={timesheet.finalAtaHours}
				finalTravelKm={timesheet.finalTravelKm}
				deviationHours={timesheet.deviationHours}
			/>

			{/* Day Breakdown Section Header with Comparison Switch */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
				<h3 className="text-base font-bold text-slate-900">
					<Translate text={localizationConstants.worktimeSectionDayBreakdown} />
				</h3>

				<div className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-2xs">
					<Label
						htmlFor="toggle-worktime-comparison"
						className="text-xs font-semibold text-slate-700 cursor-pointer"
					>
						<Translate text={localizationConstants.worktimeToggleComparison} />
					</Label>
					<Switch
						id="toggle-worktime-comparison"
						checked={isComparisonOn}
						onCheckedChange={onToggleComparison}
						className="cursor-pointer"
					/>
				</div>
			</div>

			{/* Day Records Accordion List */}
			<div className="space-y-3">
				{timesheet.days.map((day: WorktimeDayRecord) => (
					<WorktimeDayRow
						key={day.id}
						day={day}
						isExpanded={Boolean(expandedDays[day.id])}
						isComparisonOn={isComparisonOn}
						onToggleDay={onToggleDay}
						onAddObject={onAddObject}
						onDeleteAllocation={onDeleteAllocation}
					/>
				))}
			</div>
		</div>
	);
}
