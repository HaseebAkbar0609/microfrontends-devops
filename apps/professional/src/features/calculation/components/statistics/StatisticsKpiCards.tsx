"use client";

import { BadgeCheck, BadgeDollarSign, BadgeInfo } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CalculationStatKpis } from "../../types/statistics";

interface StatisticsKpiCardsProps {
	kpis: CalculationStatKpis;
	isLoading?: boolean;
}

export function StatisticsKpiCards({ kpis }: StatisticsKpiCardsProps) {
	return (
		<div className="rounded-lg border border-slate-200 bg-white p-5">
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
				{/* Card 1: Totala erbjudanden */}
				<div className="flex flex-col justify-between rounded-lg bg-[#1E293B] p-5 text-white shadow-xs">
					<div className="flex items-center gap-2 text-slate-300">
						<BadgeCheck size={24} className="text-white shrink-0" aria-hidden />
						<span className="text-base font-normal leading-6 tracking-normal text-slate-200">
							<Translate text={localizationConstants.calcStatKpiTotal} />
						</span>
					</div>
					<div className="mt-3 pl-8 text-left text-xl font-semibold leading-7 tracking-normal text-white tabular-nums">
						{kpis.totalOffers.toLocaleString("sv-SE")}
					</div>
				</div>

				{/* Card 2: Totalt vunnen */}
				<div className="flex flex-col justify-between rounded-lg bg-[#1E293B] p-5 text-white shadow-xs">
					<div className="flex items-center gap-2 text-slate-300">
						<BadgeDollarSign size={24} className="text-white shrink-0" aria-hidden />
						<span className="text-base font-normal leading-6 tracking-normal text-slate-200">
							<Translate text={localizationConstants.calcStatKpiWon} />
						</span>
					</div>
					<div className="mt-3 pl-8 text-left text-xl font-semibold leading-7 tracking-normal text-white tabular-nums">
						{kpis.won.toLocaleString("sv-SE")}
					</div>
				</div>

				{/* Card 3: Totalt förlorat */}
				<div className="flex flex-col justify-between rounded-lg bg-[#1E293B] p-5 text-white shadow-xs">
					<div className="flex items-center gap-2 text-slate-300">
						<BadgeInfo size={24} className="text-white shrink-0" aria-hidden />
						<span className="text-base font-normal leading-6 tracking-normal text-slate-200">
							<Translate text={localizationConstants.calcStatKpiLost} />
						</span>
					</div>
					<div className="mt-3 pl-8 text-left text-xl font-semibold leading-7 tracking-normal text-white tabular-nums">
						{kpis.lost.toLocaleString("sv-SE")}
					</div>
				</div>
			</div>
		</div>
	);
}
