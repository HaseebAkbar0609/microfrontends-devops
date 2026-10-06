"use client";

import React from "react";
import {
	ProjectGanttRowItem,
	GanttTimeRange,
} from "@/features/personnel/types/worktimeGroup.types";
import { WorktimeProjectGanttRow } from "./WorktimeProjectGanttRow";
import { WorktimeGanttLayout } from "../WorktimeGanttLayout";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface WorktimeProjectGanttViewProps {
	ganttRows: ProjectGanttRowItem[];
	ganttTimeRange: GanttTimeRange;
	onRangeChange: (range: GanttTimeRange) => void;
	startDate?: Date;
}

export function WorktimeProjectGanttView({
	ganttRows,
	ganttTimeRange,
	onRangeChange,
	startDate,
}: WorktimeProjectGanttViewProps) {
	const isMonthView = ganttTimeRange === "manad";

	return (
		<WorktimeGanttLayout
			headerLabel={<Translate text={localizationConstants.worktimeGroupColProjectOrder} />}
			ganttTimeRange={ganttTimeRange}
			onRangeChange={onRangeChange}
			isEmpty={ganttRows.length === 0}
			emptyMessage={<Translate text={localizationConstants.worktimeGroupEmptyProjects} />}
			startDate={startDate}
		>
			{ganttRows.map((row) => (
				<WorktimeProjectGanttRow
					key={row.id}
					row={row}
					isMonthView={isMonthView}
				/>
			))}
		</WorktimeGanttLayout>
	);
}
