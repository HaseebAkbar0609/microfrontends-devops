"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Badge } from "@/components/ui/badge";

interface WorktimeSummaryKpisProps {
	originalTotalHours: number;
	originalOtHours: number;
	originalAtaHours: number;
	originalTravelKm: number;
	finalTotalHours: number;
	finalOtHours: number;
	finalAtaHours: number;
	finalTravelKm: number;
	deviationHours: number;
}

export function WorktimeSummaryKpis({
	originalTotalHours,
	originalOtHours,
	originalAtaHours,
	originalTravelKm,
	finalTotalHours,
	finalOtHours,
	finalAtaHours,
	finalTravelKm,
	deviationHours,
}: WorktimeSummaryKpisProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			{/* Card 1: Logged Time (Original) */}
			<div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
				<div className="text-xs font-bold tracking-wider text-slate-500 uppercase">
					<Translate text={localizationConstants.worktimeKpiLoggedTitle} />
				</div>
				<div className="flex items-baseline justify-between">
					<div>
						<div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
							{originalTotalHours}h
						</div>
						<div className="text-xs text-slate-500 font-medium">
							<Translate text={localizationConstants.worktimeKpiTotal} />
						</div>
					</div>
					<div className="flex items-center gap-4 text-xs font-semibold">
						<div className="text-right">
							<span className="text-amber-600 block">{originalOtHours}h</span>
							<span className="text-slate-400 font-normal text-[11px]">
								<Translate text={localizationConstants.worktimeKpiOt} />
							</span>
						</div>
						<div className="text-right">
							<span className="text-purple-600 block">{originalAtaHours}h</span>
							<span className="text-slate-400 font-normal text-[11px]">
								<Translate text={localizationConstants.worktimeKpiAta} />
							</span>
						</div>
						<div className="text-right">
							<span className="text-sky-600 block">{originalTravelKm} km</span>
							<span className="text-slate-400 font-normal text-[11px]">
								<Translate text={localizationConstants.worktimeKpiTravel} />
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Card 2: Final Adjusted Time */}
			<div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4 relative">
				<div className="flex items-center justify-between">
					<div className="text-xs font-bold tracking-wider text-slate-500 uppercase">
						<Translate text={localizationConstants.worktimeKpiFinalTitle} />
					</div>
					{deviationHours !== 0 && (
						<Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 font-bold text-xs px-2 py-0.5">
							{deviationHours > 0 ? `+${deviationHours}h` : `${deviationHours}h`}
						</Badge>
					)}
				</div>
				<div className="flex items-baseline justify-between">
					<div>
						<div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
							{finalTotalHours}h
						</div>
						<div className="text-xs text-slate-500 font-medium">
							<Translate text={localizationConstants.worktimeKpiTotal} />
						</div>
					</div>
					<div className="flex items-center gap-4 text-xs font-semibold">
						<div className="text-right">
							<span className="text-amber-600 block">{finalOtHours}h</span>
							<span className="text-slate-400 font-normal text-[11px]">
								<Translate text={localizationConstants.worktimeKpiOt} />
							</span>
						</div>
						<div className="text-right">
							<span className="text-purple-600 block">{finalAtaHours}h</span>
							<span className="text-slate-400 font-normal text-[11px]">
								<Translate text={localizationConstants.worktimeKpiAta} />
							</span>
						</div>
						<div className="text-right">
							<span className="text-sky-600 block">{finalTravelKm} km</span>
							<span className="text-slate-400 font-normal text-[11px]">
								<Translate text={localizationConstants.worktimeKpiTravel} />
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
