"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import {
	GANTT_COLORS,
	GANTT_TOTAL_DAYS,
	GANTT_WEEK_DAYS,
	MOCK_MACHINE_SCHEDULE,
} from "../data/machineSchedule.mock";
import type {
	MachineScheduleRow,
	MachineScheduleSpan,
} from "../types/machine.types";

const WEEK_LABELS: TranslationKeys[] = [
	localizationConstants.ganttWeek10,
	localizationConstants.ganttWeek11,
	localizationConstants.ganttWeek12,
	localizationConstants.ganttWeek13,
];

function spanContains(span: MachineScheduleSpan | undefined, day: number) {
	return !!span && day >= span.from && day <= span.to;
}

interface ScheduleCellProps {
	row: MachineScheduleRow;
	day: number;
}

/**
 * One day cell of the timeline. The design layers two things: a track tinted to
 * show the planned window, and a solid bar for the actual assignment. A bar is
 * capped on the left at its first day, and on the right only when it ends
 * inside the visible window — otherwise it runs off the edge as in the design.
 */
function ScheduleCell({ row, day }: ScheduleCellProps) {
	const trackColor = spanContains(row.window, day)
		? row.window!.color
		: GANTT_COLORS.emptyTrack;

	const inBar = spanContains(row.bar, day);
	const isBarStart = inBar && row.bar!.from === day;
	const isBarEnd = inBar && row.bar!.to === day && day < GANTT_TOTAL_DAYS - 1;
	const barColor =
		isBarStart && row.bar!.leadColor ? row.bar!.leadColor : row.bar?.color;

	return (
		<td className="h-14 border-r border-[#F4F4F5] p-0 align-middle">
			<div className="flex h-14 items-center py-2">
				{/* 40px track. Its vertical padding is what lets a tinted planning
				    window stay visible as bands above and below the bar. */}
				<div
					className={`flex h-10 flex-1 items-center py-2 ${isBarStart ? "pl-1" : ""} ${
						isBarEnd ? "pr-1" : ""
					}`}
					style={{ backgroundColor: trackColor }}
				>
					{inBar && (
						<div
							className={`h-full min-w-px flex-1 ${isBarStart ? "rounded-l-[4px]" : ""} ${
								isBarEnd ? "rounded-r-[4px]" : ""
							}`}
							style={{ backgroundColor: barColor }}
						/>
					)}
				</div>
			</div>
		</td>
	);
}

/**
 * Machine Gantt schema (TFS-804) — the second tab of the Machine module.
 * Renders the booking timeline from the Figma frame "Maskin - Gantschema":
 * four fixed columns, a four-week day grid, and per-day assignment bars.
 *
 * The grid is deliberately a presentational component with no timeline editing:
 * per the platform architecture, interactive scheduling is expected to be built
 * on a licensed Gantt component (Bryntum / Syncfusion / DHTMLX), and this view
 * is the seam it would replace.
 */
export function MachineGanttTab() {
	const [rows] = useState<MachineScheduleRow[]>(MOCK_MACHINE_SCHEDULE);
	const [collapsedRows, setCollapsedRows] = useState<Record<string, boolean>>(
		{}
	);

	const toggleRow = (id: string) => {
		setCollapsedRows((prev) => ({ ...prev, [id]: !prev[id] }));
	};

	const days = Array.from({ length: GANTT_TOTAL_DAYS }, (_, index) => ({
		index,
		label: GANTT_WEEK_DAYS[index % GANTT_WEEK_DAYS.length],
	}));

	return (
		<div className="mt-2 flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xs">
			<div className="overflow-x-auto">
				{/* 652px of fixed columns + 28 day cells at 36px = the design's 1660px
				    timeline, which scrolls horizontally below that width. */}
				<table className="min-w-[1660px] w-full border-collapse text-left text-sm">
					<thead>
						{/* Month band. Left blank in the design, but kept so the header
						    keeps its three-row height. */}
						<tr className="border-b border-slate-200 bg-white">
							<th
								rowSpan={3}
								className="w-32 lg:w-45 border-r border-slate-200 px-4 py-3 align-middle text-xs font-semibold text-slate-900"
							>
								<Translate text={localizationConstants.machineGanttObjectNo} />
							</th>
							<th
								rowSpan={3}
								className="w-32 lg:w-45 border-r border-slate-200 px-4 py-3 align-middle text-xs font-semibold text-slate-900"
							>
								<Translate text={localizationConstants.machineGanttLabel} />
							</th>
							<th
								rowSpan={3}
								className="w-24 lg:w-30 border-r border-slate-200 px-4 py-3 align-middle text-xs font-semibold text-slate-900"
							>
								<Translate text={localizationConstants.machineGanttStart} />
							</th>
							<th
								rowSpan={3}
								className="w-24 lg:w-30 border-r border-slate-200 px-4 py-3 align-middle text-xs font-semibold text-slate-900"
							>
								<Translate text={localizationConstants.machineGanttCount} />
							</th>
							<th
								rowSpan={3}
								className="w-13 border-r border-slate-200 px-2 py-3 align-middle"
							/>
							<th
								colSpan={GANTT_TOTAL_DAYS}
								className="h-12 border-b border-slate-200 px-2"
							/>
						</tr>

						{/* Week band */}
						<tr className="border-b border-slate-200 bg-white">
							{WEEK_LABELS.map((labelKey, weekIdx) => (
								<th
									key={`${labelKey}-${weekIdx}`}
									colSpan={GANTT_WEEK_DAYS.length}
									className="border-r border-slate-200 p-2 text-center text-xs font-semibold text-slate-900"
								>
									<Translate text={labelKey} />
								</th>
							))}
						</tr>

						{/* Day band */}
						<tr className="border-b border-slate-200 bg-white">
							{days.map((day) => (
								<th
									key={day.index}
									className="h-11 w-9 border-r border-slate-100 text-center text-[11px] font-medium text-slate-700"
								>
									{day.label}
								</th>
							))}
						</tr>
					</thead>

					<tbody>
						{rows.map((row) => {
							const isCollapsed = !!collapsedRows[row.id];

							return (
								<tr
									key={row.id}
									className="group border-b border-slate-100 last:border-b-0"
								>
									<td className="p-0">
										<div className="flex h-14 items-center rounded-l-md bg-[#E2E8F0] px-3 text-xs text-slate-900 transition-colors group-hover:bg-[#D8E0EA]">
											<button
												type="button"
												onClick={() => toggleRow(row.id)}
												aria-expanded={!isCollapsed}
												className="mr-1 cursor-pointer rounded p-0.5 text-slate-600 hover:text-slate-900"
											>
												{isCollapsed ? (
													<ChevronDown className="h-3.5 w-3.5" />
												) : (
													<ChevronUp className="h-3.5 w-3.5" />
												)}
											</button>
											<span className="truncate">{row.objectNo}</span>
										</div>
									</td>
									<td className="p-0">
										<div className="flex h-14 items-center bg-[#E2E8F0] px-3 text-xs text-slate-900 transition-colors group-hover:bg-[#D8E0EA]">
											<span className="truncate">{row.label}</span>
										</div>
									</td>
									<td className="p-0">
										<div className="flex h-14 items-center bg-[#E2E8F0] px-3 text-xs text-slate-700 transition-colors group-hover:bg-[#D8E0EA]">
											{row.start}
										</div>
									</td>
									<td className="p-0">
										<div className="flex h-14 items-center bg-[#E2E8F0] px-3 text-xs text-slate-700 transition-colors group-hover:bg-[#D8E0EA]">
											{row.machineCount}
										</div>
									</td>
									<td className="p-0">
										<div className="flex h-14 items-center justify-center bg-[#E2E8F0] px-1 transition-colors group-hover:bg-[#D8E0EA]">
											<button
												type="button"
												aria-label={localizationConstants.machineGanttAddBooking}
												className="flex h-5 w-5 cursor-pointer items-center justify-center rounded text-slate-600 hover:bg-slate-300/60 hover:text-slate-900"
											>
												<Plus className="h-3.5 w-3.5" />
											</button>
										</div>
									</td>

									{days.map((day) => (
										<ScheduleCell key={day.index} row={row} day={day.index} />
									))}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default MachineGanttTab;
