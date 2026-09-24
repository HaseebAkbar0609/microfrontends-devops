"use client";

import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { TaskRow } from "../taskTree";
import type { Timeline } from "../timeline";
import { ADD_COL_PX, DAY_COL_PX, LEFT_COLS_PX, START_COL_PX, TASK_COL_PX } from "./ganttLayout";
import { TimeplanGanttHeader } from "./TimeplanGanttHeader";
import { TimeplanGanttRow } from "./TimeplanGanttRow";

export interface TimeplanGanttProps {
	timeline: Timeline;
	rows: TaskRow[];
	collapsed: ReadonlySet<string>;
	onToggle: (id: string) => void;
	onAdd: (parentId: string | null) => void;
}

/**
 * The schedule: a fixed-layout table whose left three columns stay pinned while
 * the day grid scrolls.
 *
 * `border-separate` with zero spacing rather than `border-collapse`: Chromium
 * drops the borders of sticky cells in a collapsed table. `table-layout: fixed`
 * with a `<colgroup>` is what makes each row's single spanning timeline cell the
 * exact width of the header's day cells above it.
 */
export function TimeplanGantt({ timeline, rows, collapsed, onToggle, onAdd }: TimeplanGanttProps) {
	const totalCols = timeline.days.length;
	const timelineStart = timeline.days[0]?.iso ?? "";

	return (
		<div className="w-full overflow-x-auto rounded-lg border border-slate-200 bg-white">
			<table
				className="table-fixed border-separate border-spacing-0"
				style={{ width: LEFT_COLS_PX + totalCols * DAY_COL_PX }}
			>
				<colgroup>
					<col style={{ width: TASK_COL_PX }} />
					<col style={{ width: START_COL_PX }} />
					<col style={{ width: ADD_COL_PX }} />
					{timeline.days.map((day) => (
						<col key={day.iso} style={{ width: DAY_COL_PX }} />
					))}
				</colgroup>

				<TimeplanGanttHeader timeline={timeline} onAddPhase={() => onAdd(null)} />

				<tbody>
					{rows.length === 0 ? (
						<tr>
							<td
								colSpan={3 + totalCols}
								className="h-24 px-4 text-sm text-slate-500"
							>
								<span className="sticky left-4">
									<Translate text={localizationConstants.projectTimeplanNoTasks} />
								</span>
							</td>
						</tr>
					) : (
						rows.map((row) => (
							<TimeplanGanttRow
								key={row.task.id}
								row={row}
								timelineStart={timelineStart}
								totalCols={totalCols}
								expanded={!collapsed.has(row.task.id)}
								onToggle={onToggle}
								onAdd={onAdd}
							/>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}

export default TimeplanGantt;
