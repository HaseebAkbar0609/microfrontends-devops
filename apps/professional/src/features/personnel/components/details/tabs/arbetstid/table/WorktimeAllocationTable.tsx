"use client";

import React, { useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { WorktimeAllocationItem } from "@/features/personnel/types/worktime.types";
import { cn } from "@/lib/utils";

interface WorktimeAllocationTableProps {
	dayId: string;
	allocations: WorktimeAllocationItem[];
	onAddObject: (dayId: string) => void;
	onDeleteAllocation?: (dayId: string, allocId: string) => void;
	titleKey?: string;
}

export function WorktimeAllocationTable({
	dayId,
	allocations,
	onAddObject,
	onDeleteAllocation,
	titleKey = localizationConstants.worktimeSubcardCostCenter,
}: WorktimeAllocationTableProps) {
	const totals = useMemo(() => {
		return allocations.reduce(
			(acc, item) => ({
				regular: acc.regular + item.regularHours,
				ot: acc.ot + item.otHours,
				ataHours: acc.ataHours + item.ataHours,
				travel: acc.travel + item.travelKm,
			}),
			{ regular: 0, ot: 0, ataHours: 0, travel: 0 }
		);
	}, [allocations]);

	return (
		<div className="bg-slate-50/50 border border-slate-200 rounded-lg p-3 space-y-3">
			{/* Subcard Header: Cost Center + Add Project */}
			<div className="flex items-center justify-between">
				<span className="text-xs font-bold tracking-wider text-slate-600 uppercase">
					<Translate text={titleKey} />
				</span>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={() => onAddObject(dayId)}
					className="h-7 px-2 text-xs font-semibold text-sky-700 hover:text-sky-800 hover:bg-sky-50 cursor-pointer"
				>
					<Plus className="w-3.5 h-3.5 mr-1" />
					<Translate text={localizationConstants.worktimeBtnAddObject} />
				</Button>
			</div>

			{/* Allocation Data Table */}
			<div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
				<table className="w-full text-left text-xs border-collapse">
					<thead>
						<tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase">
							<th className="py-2 px-3">
								<Translate text={localizationConstants.worktimeColObject} />
							</th>
							<th className="py-2 px-2.5 text-center w-20">
								<Translate text={localizationConstants.worktimeColNormal} />
							</th>
							<th className="py-2 px-2.5 text-center w-16">
								<Translate text={localizationConstants.worktimeColOt} />
							</th>
							<th className="py-2 px-2.5 text-center w-24">
								<Translate text={localizationConstants.worktimeColAtaNr} />
							</th>
							<th className="py-2 px-2.5 text-center w-20">
								<Translate text={localizationConstants.worktimeColAtaHours} />
							</th>
							<th className="py-2 px-2.5 text-center w-20">
								<Translate text={localizationConstants.worktimeColTravel} />
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100">
						{allocations.map((row) => (
							<tr key={row.id} className="hover:bg-slate-50/50">
								<td className="py-2 px-3 font-medium text-slate-800">
									{row.object}
								</td>
								<td className="py-2 px-2.5 text-center text-slate-700 font-semibold">
									{row.regularHours}
								</td>
								<td
									className={cn(
										"py-2 px-2.5 text-center font-semibold",
										row.isModified
											? "bg-amber-50 text-amber-800 font-bold"
											: "text-slate-700"
									)}
								>
									{row.otHours}
								</td>
								<td className="py-2 px-2.5 text-center text-slate-600">
									{row.ataNr}
								</td>
								<td className="py-2 px-2.5 text-center text-slate-700 font-semibold">
									{row.ataHours}
								</td>
								<td className="py-2 px-2.5 text-center text-slate-600">
									<div className="flex items-center justify-center gap-1">
										<span>{row.travelKm > 0 ? `${row.travelKm} km` : "0"}</span>
										{row.isModified && onDeleteAllocation && (
											<button
												type="button"
												onClick={() => onDeleteAllocation(dayId, row.id)}
												className="ml-1 text-slate-400 hover:text-rose-600 cursor-pointer p-0.5"
											>
												<Trash2 className="w-3 h-3" />
											</button>
										)}
									</div>
								</td>
							</tr>
						))}
					</tbody>
					<tfoot>
						<tr className="border-t-2 border-slate-200 bg-slate-50/90 font-bold text-xs text-slate-800">
							<td className="py-2 px-3">
								<Translate text={localizationConstants.worktimeDailyCheck} />
							</td>
							<td className="py-2 px-2.5 text-center">{totals.regular}</td>
							<td className="py-2 px-2.5 text-center">{totals.ot}</td>
							<td className="py-2 px-2.5 text-center">-</td>
							<td className="py-2 px-2.5 text-center">{totals.ataHours}</td>
							<td className="py-2 px-2.5 text-center">
								{totals.travel > 0 ? `${totals.travel} km` : "0"}
							</td>
						</tr>
					</tfoot>
				</table>
			</div>
		</div>
	);
}
