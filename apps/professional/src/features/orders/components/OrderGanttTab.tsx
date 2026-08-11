"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { MOCK_GANTT_ITEMS } from "../data/orders.mock";
import type { GanttItem } from "../types/order.types";

export function OrderGanttTab() {
	const [items] = useState<GanttItem[]>(MOCK_GANTT_ITEMS);
	const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

	const toggleRowExpand = (id: string) => {
		setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
	};

	const weeks = [
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
										<div className="bg-[#EBEFF5] group-hover:bg-[#E2E8F0] h-10 relative rounded-r-md overflow-hidden transition-colors">
											{/* White Vertical Day Lines */}
											<div className="absolute inset-0 flex">
												{Array.from({ length: totalDays }).map((_, colIdx) => (
													<div key={colIdx} className="flex-1 border-r-2 border-white h-full" />
												))}
											</div>

											{/* Timeline Gantt Bar */}
											{item.durationDays > 0 && item.color !== "transparent" && (
												<div
													className="absolute top-1 bottom-1 flex rounded-xs transition-all overflow-hidden shadow-2xs z-10"
													style={{
														left: `${(item.startDayIndex / totalDays) * 100}%`,
														width: `${(item.durationDays / totalDays) * 100}%`,
														backgroundColor: item.color,
													}}
												>
													{Array.from({ length: item.durationDays }).map((_, segmentIdx) => (
														<div
															key={segmentIdx}
															className="flex-1 border-r-2 border-white/40 last:border-r-0 h-full"
														/>
													))}
												</div>
											)}
										</div>
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
