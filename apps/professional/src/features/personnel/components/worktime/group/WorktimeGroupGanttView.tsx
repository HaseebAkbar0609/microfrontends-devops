"use client";

import React from "react";
import {
	EmployeeGroupSummary,
	GanttTimeRange,
} from "@/features/personnel/types/worktimeGroup.types";
import { WorktimeGroupGanttRow } from "./WorktimeGroupGanttRow";
import { WorktimeGanttLayout } from "./WorktimeGanttLayout";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface WorktimeGroupGanttViewProps {
	employees: EmployeeGroupSummary[];
	ganttTimeRange: GanttTimeRange;
	onRangeChange: (range: GanttTimeRange) => void;
	startDate?: Date;
}

export function WorktimeGroupGanttView({
	employees,
	ganttTimeRange,
	onRangeChange,
	startDate,
}: WorktimeGroupGanttViewProps) {
	const isMonthView = ganttTimeRange === "manad";

	return (
		<WorktimeGanttLayout
			headerLabel={<Translate text={localizationConstants.worktimeGroupColEmployeeTeam} />}
			ganttTimeRange={ganttTimeRange}
			onRangeChange={onRangeChange}
			isEmpty={employees.length === 0}
			emptyMessage={<Translate text={localizationConstants.worktimeGroupEmptyEmployees} />}
			startDate={startDate}
		>
			{employees.map((emp) => (
				<WorktimeGroupGanttRow
					key={emp.id}
					employee={emp}
					isMonthView={isMonthView}
				/>
			))}
		</WorktimeGanttLayout>
	);
}
