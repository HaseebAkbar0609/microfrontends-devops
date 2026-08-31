"use client";

import { Translate } from "@/utils/translation/translate";
import { BadgeCheck, BadgeDollarSign, BadgeInfo } from "lucide-react";

interface StatisticsKpiCardsProps {
	variant: "machines" | "vehicles";
	card1: { labelKey: string; value: string | number };
	card2: { labelKey: string; value: string | number };
	card3: { labelKey: string; value: string | number };
}

export function StatisticsKpiCards({
	variant: _variant,
	card1,
	card2,
	card3,
}: StatisticsKpiCardsProps) {
	const icons = [
		<BadgeCheck key="1" className="h-4 w-4 text-slate-300 stroke-[2.2]" />,
		<BadgeDollarSign key="2" className="h-4 w-4 text-slate-300 stroke-[2.2]" />,
		<BadgeInfo key="3" className="h-4 w-4 text-slate-300 stroke-[2.2]" />,
	];

	const cards = [
		{ ...card1, icon: icons[0] },
		{ ...card2, icon: icons[1] },
		{ ...card3, icon: icons[2] },
	];

	return (
		<div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
				{cards.map((card, idx) => (
					<div
						key={idx}
						className="flex flex-col justify-between rounded-lg bg-[#1E293B] px-5 py-4 text-white shadow-xs"
					>
						<div className="flex items-center gap-2 text-xs font-medium text-white/90">
							{card.icon}
							<span>
								<Translate text={card.labelKey} />
							</span>
						</div>
						<div className="mt-3 text-2xl font-bold tracking-tight text-white">
							{card.value}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
