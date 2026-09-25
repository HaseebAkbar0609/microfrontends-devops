"use client";

import { ChevronDown, ChevronUp, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import type { TaskRow } from "../taskTree";
import { daysBetween, formatStartDate } from "../timeline";
import {
	ADD_COL_LEFT,
	DAY_COL_PX,
	INDENT_PX,
	MAX_INDENT_DEPTH,
	START_COL_LEFT,
} from "./ganttLayout";
import { TimeplanBar } from "./TimeplanBar";

export interface TimeplanGanttRowProps {
	row: TaskRow;
	/** The timeline's first day, `yyyy-MM-dd`. */
	timelineStart: string;
	totalCols: number;
	expanded: boolean;
	onToggle: (id: string) => void;
	onAdd?: (parentId: string) => void;
}

/**
 * One task: its name, start date and `+` pinned left, and its bar on the day
 * grid.
 *
 * Top-level phases carry the grey band across the whole row, as the frame draws
 * them; the sticky cells need an opaque background anyway, or bars would show
 * through them while scrolling. Leaves two levels down are greyed.
 */
export function TimeplanGanttRow({
	row,
	timelineStart,
	totalCols,
	expanded,
	onToggle,
	onAdd,
}: TimeplanGanttRowProps) {
	const t = useTranslate();
	const { task, depth, hasChildren } = row;
	const band = depth === 0 ? "bg-slate-100" : "bg-white";
	const muted = depth >= 2;
	const sticky = cn("sticky z-20 border-b border-r border-slate-200", band);

	return (
		<tr className="h-14">
			<td className={sticky} style={{ left: 0 }}>
				<div
					className={cn(
						"flex items-center gap-1 pr-2 text-sm",
						muted ? "text-slate-500" : "font-medium text-slate-900",
					)}
					style={{ paddingLeft: 12 + Math.min(depth, MAX_INDENT_DEPTH) * INDENT_PX }}
				>
					{hasChildren ? (
						<button
							type="button"
							onClick={() => onToggle(task.id)}
							aria-expanded={expanded}
							aria-label={task.name}
							className="shrink-0 cursor-pointer rounded p-0.5 text-slate-600 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:outline-none"
						>
							{expanded ? (
								<ChevronUp className="h-4 w-4" aria-hidden />
							) : (
								<ChevronDown className="h-4 w-4" aria-hidden />
							)}
						</button>
					) : (
						<span className="w-5 shrink-0" aria-hidden />
					)}
					<span className="truncate" title={task.name}>
						{task.name}
					</span>
				</div>
			</td>
			<td
				className={cn(sticky, "px-4 text-sm", muted ? "text-slate-500" : "text-slate-900")}
				style={{ left: START_COL_LEFT }}
			>
				{formatStartDate(row.startDate)}
			</td>
			<td className={cn(sticky, "text-center")} style={{ left: ADD_COL_LEFT }}>
				{onAdd && <Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={() => onAdd(task.id)}
					aria-label={t(localizationConstants.projectTimeplanAddTaskUnder, { name: task.name })}
					className="h-8 w-8 cursor-pointer text-slate-600 hover:text-slate-900"
				>
					<Plus className="h-4 w-4" />
				</Button>}
			</td>
			<td
				colSpan={totalCols}
				className={cn("relative border-b border-slate-200 p-0", band)}
				style={{
					backgroundImage: `repeating-linear-gradient(to right, transparent 0, transparent ${DAY_COL_PX - 1}px, rgb(226 232 240) ${DAY_COL_PX - 1}px, rgb(226 232 240) ${DAY_COL_PX}px)`,
				}}
			>
				<TimeplanBar
					name={task.name}
					startCol={daysBetween(timelineStart, row.startDate)}
					spanCols={daysBetween(row.startDate, row.endDate) + 1}
					totalCols={totalCols}
					phaseIndex={row.phaseIndex}
					depth={depth}
					rangeLabel={`${formatStartDate(row.startDate)} – ${formatStartDate(row.endDate)}`}
				/>
			</td>
		</tr>
	);
}

export default TimeplanGanttRow;
