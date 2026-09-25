"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { Timeline } from "../timeline";
import {
	ADD_COL_LEFT,
	DAY_COL_PX,
	SHORT_MONTH_BELOW_DAYS,
	START_COL_LEFT,
} from "./ganttLayout";

export interface TimeplanGanttHeaderProps {
	timeline: Timeline;
	onAddPhase?: () => void;
}

const CORNER = "sticky z-30 border-b border-r border-slate-200 bg-white px-4 text-left text-sm font-medium text-slate-500";
const BAND = "h-12 border-b border-l border-slate-200 bg-white text-center text-sm font-normal text-slate-500";

/**
 * The three header rows: month, ISO week, day — all from the plan's dates.
 *
 * Replaces the project Gantt's hardcoded "Mars 2026" over "Vecka 10–13" with
 * the same days 8–14 under every week. Labels are composed from translation
 * keys at render, so they switch language with the rest of the page.
 *
 * The `+` in the empty third corner adds a top-level phase. The frame leaves
 * that cell blank, but without it a plan made in the form could never hold a
 * task, and a plan with one phase could never get a second.
 */
export function TimeplanGanttHeader({ timeline, onAddPhase }: TimeplanGanttHeaderProps) {
	const t = useTranslate();

	return (
		<thead>
			<tr>
				<th rowSpan={3} className={CORNER} style={{ left: 0 }}>
					<Translate text={localizationConstants.planningTask} />
				</th>
				<th rowSpan={3} className={CORNER} style={{ left: START_COL_LEFT }}>
					<Translate text={localizationConstants.projectDetailColStart} />
				</th>
				<th rowSpan={3} className={`${CORNER} text-center`} style={{ left: ADD_COL_LEFT }}>
					{onAddPhase && <Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={onAddPhase}
						aria-label={t(localizationConstants.projectTimeplanAddPhase)}
						title={t(localizationConstants.projectTimeplanAddPhase)}
						className="h-8 w-8 cursor-pointer text-slate-600 hover:text-slate-900"
					>
						<Plus className="h-4 w-4" />
					</Button>}
				</th>
				{timeline.months.map((month) => (
					<th key={month.key} colSpan={month.span} className={BAND}>
						{`${t(
							(month.span < SHORT_MONTH_BELOW_DAYS
								? month.shortLabelKey
								: month.labelKey) ?? "",
						)} ${month.value}`}
					</th>
				))}
			</tr>
			<tr>
				{timeline.weeks.map((week) => (
					<th key={week.key} colSpan={week.span} className={BAND}>
						{`${t(localizationConstants.ganttWeek)} ${week.value}`}
					</th>
				))}
			</tr>
			<tr>
				{timeline.days.map((day) => (
					<th
						key={day.iso}
						className="h-12 border-b border-l border-slate-200 bg-white text-center text-sm font-normal text-slate-500"
						style={{ width: DAY_COL_PX }}
					>
						{day.dayOfMonth}
					</th>
				))}
			</tr>
		</thead>
	);
}

export default TimeplanGanttHeader;
