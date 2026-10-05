"use client";

import React from "react";
import { EmployeeDayBreakdown } from "@/features/personnel/types/worktimeGroup.types";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface WorktimeGroupListSubRowProps {
	day: EmployeeDayBreakdown;
	employeeId: string;
	onApproveDay: (employeeId: string, dayId: string) => void;
	onRejectDay: (employeeId: string, dayId: string) => void;
}

export function WorktimeGroupListSubRow({
	day,
	employeeId,
	onApproveDay,
	onRejectDay,
}: WorktimeGroupListSubRowProps) {
	const isWeekend = day.dayOfWeek === 5 || day.dayOfWeek === 6;
	const hasAction = !isWeekend;

	return (
		<tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors text-xs">
			{/* Day Column */}
			<td className="py-2.5 px-4 font-normal text-slate-800 w-44">
				{day.dayLabel}
			</td>

			{/* Total Time */}
			<td className="py-2.5 px-3 text-center font-bold text-slate-900">
				{day.loggedHours > 0 ? `${day.loggedHours}h` : "—"}
			</td>

			{/* OT */}
			<td className="py-2.5 px-3 text-center">
				{day.otHours > 0 ? (
					<span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-0.5 rounded-full inline-block">
						{day.otHours}h
					</span>
				) : (
					<span className="text-slate-400">—</span>
				)}
			</td>

			{/* ATA */}
			<td className="py-2.5 px-3 text-center">
				{day.ataHours > 0 ? (
					<span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full inline-block">
						{day.ataHours}h
					</span>
				) : (
					<span className="text-slate-400">—</span>
				)}
			</td>

			{/* Travel KM */}
			<td className="py-2.5 px-3 text-center text-slate-600 font-medium">
				{day.travelKm > 0 ? `${day.travelKm} km` : <span className="text-slate-400">—</span>}
			</td>

			{/* Action Column: [Avböj] [Godkänn] buttons matching Figma */}
			<td className="py-2.5 px-4 text-center">
				{hasAction ? (
					<div className="inline-flex items-center gap-2 justify-center">
						<button
							type="button"
							onClick={() => onRejectDay(employeeId, day.id)}
							className="px-3 py-1 text-xs border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-md shadow-2xs cursor-pointer transition-colors"
						>
							<Translate text={localizationConstants.worktimeGroupBtnAvboj} />
						</button>
						<button
							type="button"
							onClick={() => onApproveDay(employeeId, day.id)}
							className="px-3 py-1 text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-md shadow-2xs cursor-pointer transition-colors"
						>
							<Translate text={localizationConstants.worktimeGroupBtnGodkann} />
						</button>
					</div>
				) : (
					<span className="text-slate-300">—</span>
				)}
			</td>
		</tr>
	);
}
