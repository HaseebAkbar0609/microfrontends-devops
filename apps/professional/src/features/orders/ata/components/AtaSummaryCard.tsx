"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { AtaSummary } from "../types/ata.types";

export interface AtaSummaryCardProps {
	summary: AtaSummary;
}

export function AtaSummaryCard({ summary }: AtaSummaryCardProps) {
	const formattedTotal = new Intl.NumberFormat("sv-SE").format(
		Math.round(summary.totalAtaValue || 0)
	);

	return (
		<div className="w-[192px] h-[68px] bg-slate-100 rounded-lg px-4 py-2 flex flex-col justify-center gap-2">
			<div className="flex items-center justify-between">
				<span className="font-sans font-semibold text-sm leading-none tracking-normal text-slate-900">
					<Translate text={localizationConstants.ataTotalAta} />
				</span>
				<span className="font-sans font-semibold text-base leading-6 tracking-normal text-slate-500 text-center">
					{formattedTotal}
				</span>
			</div>
			<div className="flex items-center justify-between">
				<span className="font-sans font-semibold text-sm leading-none tracking-normal text-slate-900">
					<Translate text={localizationConstants.ataCountAta} />
				</span>
				<span className="font-sans font-semibold text-base leading-6 tracking-normal text-slate-500 text-center">
					{summary.countAta}
				</span>
			</div>
		</div>
	);
}

export default AtaSummaryCard;
