"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { MOCK_GANTT_ITEMS } from "../data/orders.mock";
import type { GanttItem } from "../types/order.types";

/**
 * Interface representing a Gantt timeline week column structure.
 */
export interface GanttWeekHeader {
	labelKey: string;
	days: number[];
}

/**
 * Presenter component responsible for rendering the Gantt timeline grid cell.
 * Decoupled to allow plugging in third-party Gantt adapters (e.g. Bryntum, DHTMLX, Syncfusion)
 * when interactive timeline editing is connected via backend WebSocket/REST services.
 */
export interface GanttChartGridProps {
	totalDays: number;
	durationDays: number;
	startDayIndex: number;
	color: string;
	level?: 0 | 1 | 2;
}

export function GanttChartGrid({
	totalDays,
	durationDays,
	startDayIndex,
	color,
	level = 0,
}: GanttChartGridProps) {
	const gridBgClass =
		level === 0
			? "bg-[#EBEFF5] group-hover:bg-[#E2E8F0]"
			: "bg-[#F9FAFB] group-hover:bg-[#E2E8F0]";

	return (
		<div className={`${gridBgClass} h-11 relative rounded-r-md overflow-hidden transition-colors`}>
			{/* Vertical Day Lines */}
			<div className="absolute inset-0 flex">
				{Array.from({ length: totalDays }).map((_, colIdx) => (
					<div key={colIdx} className="flex-1 border-r-2 border-white h-full" />
				))}
			</div>

			{/* Timeline Bar */}
			{durationDays > 0 && color !== "transparent" && (
				<div
					className="absolute top-2 bottom-2 flex rounded-xs transition-all overflow-hidden shadow-2xs z-10"
					style={{
						left: `${(startDayIndex / totalDays) * 100}%`,
						width: `${(durationDays / totalDays) * 100}%`,
						backgroundColor: color,
					}}
				>
					{Array.from({ length: durationDays }).map((_, segmentIdx) => (
						<div
							key={segmentIdx}
							className="flex-1 border-r-2 border-white/40 last:border-r-0 h-full"
						/>
					))}
				</div>
			)}
		</div>
	);
}

export function OrderGanttTab() {
	const [items] = useState<GanttItem[]>(MOCK_GANTT_ITEMS);
	const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

	const toggleRowExpand = (id: string) => {
		setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
	};

	const weeks: GanttWeekHeader[] = [
		{ labelKey: localizationConstants.ganttWeek10, days: [8, 9, 10, 11, 12, 13, 14] },
		{ labelKey: localizationConstants.ganttWeek11, days: [8, 9, 10, 11, 12, 13, 14] },
		{ labelKey: localizationConstants.ganttWeek12, days: [8, 9, 10, 11, 12, 13, 14] },
		{ labelKey: localizationConstants.ganttWeek12, days: [8, 9, 10, 11, 12, 13, 14] },
	];

	const totalDays = 28;

	return (
		<div className="flex flex-col border border-slate-200 bg-white overflow-hidden rounded-lg mt-2 shadow-2xs">
			<div className="overflow-x-auto">
				<table className="w-full border-collapse text-left text-sm min-w-[950px]">
					<thead>
						{/* Top Header Row for Month */}
						<tr className="border-b border-slate-200 bg-white">
							<th colSpan={5} className="border-r border-slate-200"></th>
							<th colSpan={totalDays} className="p-2 font-semibold text-slate-900 text-center text-xs border-b border-r border-slate-200">
								<Translate text={localizationConstants.ganttMonthMarch2024} />
							</th>
						</tr>

						{/* Weeks & Merged Left Headers Row */}
						<tr className="border-b border-slate-200 bg-white">
							<th rowSpan={2} className="p-3 font-semibold text-slate-900 w-32 border-r border-slate-200 text-xs align-middle">
								<Translate text={localizationConstants.orderNumber} />
							</th>
							<th rowSpan={2} className="p-3 font-semibold text-slate-900 w-44 border-r border-slate-200 text-xs align-middle">
								<Translate text={localizationConstants.orderName} />
							</th>
							<th rowSpan={2} className="p-3 font-semibold text-slate-900 w-28 border-r border-slate-200 text-xs align-middle">
								<Translate text={localizationConstants.orderStart} />
							</th>
							<th rowSpan={2} className="p-3 font-semibold text-slate-900 w-28 border-r border-slate-200 text-xs align-middle">
								<Translate text={localizationConstants.orderEnd} />
							</th>
							<th rowSpan={2} className="p-2 font-semibold text-slate-900 w-10 border-r border-slate-200 text-center text-xs align-middle"></th>

							{weeks.map((week, idx) => (
								<th
									key={idx}
									colSpan={7}
									className="p-2 font-semibold text-slate-900 text-center text-xs border-r border-slate-200"
								>
									<Translate text={week.labelKey} />
								</th>
							))}
						</tr>

						{/* Days Sub-header Row */}
						<tr className="border-b border-slate-200 bg-white">
							{weeks.flatMap((w) => w.days).map((day, dIdx) => (
								<th
									key={dIdx}
									className="w-8 h-7 text-center font-medium text-slate-700 text-[11px] border-r border-slate-100"
								>
									{day}
								</th>
							))}
						</tr>
					</thead>

					<tbody>
						{items.map((item) => {
							const isExpanded = !!expandedRows[item.id];
							const displayOrderNo = item.orderNoText || item.orderNo;

							return (
								<tr
									key={item.id}
									className="group border-b border-slate-200 last:border-b-0"
								>
									{/* Order nr */}
									<td className="py-1.5 pl-2 pr-0">
										<div className="bg-[#EBEFF5] group-hover:bg-[#E2E8F0] h-10 flex items-center px-2.5 rounded-l-md transition-colors text-slate-900 text-xs font-normal">
											<div className="flex items-center gap-1">
												<button
													type="button"
													onClick={() => toggleRowExpand(item.id)}
													className="p-0.5 text-slate-500 hover:text-slate-900 rounded cursor-pointer"
												>
													{isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
												</button>
												<span>{displayOrderNo}</span>
											</div>
										</div>
									</td>

									{/* Order name */}
									<td className="py-1.5 px-0">
										<div className="bg-[#EBEFF5] group-hover:bg-[#E2E8F0] h-10 flex items-center px-2.5 transition-colors text-slate-900 text-xs font-medium truncate max-w-[170px]">
											{item.orderName}
										</div>
									</td>

									{/* Start date */}
									<td className="py-1.5 px-0">
										<div className="bg-[#EBEFF5] group-hover:bg-[#E2E8F0] h-10 flex items-center px-2.5 transition-colors text-slate-700 text-xs">
											{item.start}
										</div>
									</td>

									{/* End date */}
									<td className="py-1.5 px-0">
										<div className="bg-[#EBEFF5] group-hover:bg-[#E2E8F0] h-10 flex items-center px-2.5 transition-colors text-slate-700 text-xs">
											{item.end}
										</div>
									</td>

									{/* Action (+) */}
									<td className="py-1.5 px-0">
										<div className="bg-[#EBEFF5] group-hover:bg-[#E2E8F0] h-10 flex items-center justify-center px-1 transition-colors">
											<button
												type="button"
												className="h-5 w-5 rounded flex items-center justify-center hover:bg-slate-300/60 text-slate-600 hover:text-slate-900 mx-auto cursor-pointer"
											>
												<Plus className="h-3.5 w-3.5" />
											</button>
										</div>
									</td>

									{/* Timeline Grid Cell */}
									<td colSpan={totalDays} className="py-1.5 pl-0 pr-2">
										<GanttChartGrid
											totalDays={totalDays}
											durationDays={item.durationDays}
											startDayIndex={item.startDayIndex}
											color={item.color}
										/>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default OrderGanttTab;
