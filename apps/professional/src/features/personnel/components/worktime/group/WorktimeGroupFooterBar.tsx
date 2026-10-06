"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface WorktimeGroupFooterBarProps {
	totalEmployees: number;
	weekNumber: number;
	year: number;
	totalLogged: number;
	totalOt: number;
	totalAta: number;
}

export function WorktimeGroupFooterBar({
	totalEmployees,
	weekNumber,
	year,
	totalLogged,
	totalOt,
	totalAta,
}: WorktimeGroupFooterBarProps) {
	return (
		<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 pt-1 pb-4 px-1">
			{/* Left: Showing 4 employees • Week 52, 2024 matching Figma */}
			<div>
				<Translate text={localizationConstants.worktimeGroupFooterShowing} />{" "}
				{totalEmployees}{" "}
				<Translate text={localizationConstants.worktimeGroupFooterEmployees} /> •{" "}
				<Translate text={localizationConstants.worktimeGroupFooterWeek} /> {weekNumber}, {year}
			</div>

			{/* Right: Total Logged, Total OT, Total ATA matching Figma */}
			<div className="flex items-center gap-5 flex-wrap">
				<div>
					<span>
						<Translate text={localizationConstants.worktimeGroupFooterTotalLogged} />:{" "}
					</span>
					<strong className="text-slate-900 font-bold">{totalLogged}h</strong>
				</div>

				<div>
					<span>
						<Translate text={localizationConstants.worktimeGroupFooterTotalOt} />:{" "}
					</span>
					<strong className="text-amber-600 font-bold">{totalOt}h</strong>
				</div>

				<div>
					<span>
						<Translate text={localizationConstants.worktimeGroupFooterTotalAta} />:{" "}
					</span>
					<strong className="text-indigo-600 font-bold">{totalAta}h</strong>
				</div>
			</div>
		</div>
	);
}
