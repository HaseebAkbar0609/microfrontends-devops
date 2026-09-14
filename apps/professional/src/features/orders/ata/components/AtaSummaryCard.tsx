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
		<div className="bg-slate-100 rounded-lg px-4 py-3 grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-2.5 min-w-[210px] w-fit">
			<span className="font-sans font-semibold text-sm leading-none tracking-normal text-slate-900">
				<Translate text={localizationConstants.ataTotalAta} />
			</span>
			<span className="font-sans font-semibold text-sm leading-none tracking-normal text-slate-600 text-left">
				{formattedTotal}
			</span>
			<span className="font-sans font-semibold text-sm leading-none tracking-normal text-slate-900">
				<Translate text={localizationConstants.ataCountAta} />
			</span>
			<span className="font-sans font-semibold text-sm leading-none tracking-normal text-slate-600 text-left">
				{summary.countAta}
			</span>
		</div>
	);
}

export default AtaSummaryCard;
