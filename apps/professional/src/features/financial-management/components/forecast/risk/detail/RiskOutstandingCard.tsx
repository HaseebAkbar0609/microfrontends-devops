"use client";

import { CircleAlert } from "lucide-react";
import dynamic from "next/dynamic";

import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { RiskClient, RiskClientTotals } from "../../../../types/forecastRisk.types";
import { formatSek } from "../../../../utils/economyFormatters";

/* Recharts measures the DOM, so the dial must not render on the server. */
const RiskGauge = dynamic(() => import("./charts/RiskGauge"), {
	ssr: false,
	loading: () => <div className="h-[120px] w-[220px] animate-pulse rounded-lg bg-slate-100" />,
});

export interface RiskOutstandingCardProps {
	client: RiskClient;
	totals: RiskClientTotals;
}

/** What the client owes, against what it was allowed to owe. */
export function RiskOutstandingCard({ client, totals }: RiskOutstandingCardProps) {
	const t = useTranslate();
	const threshold = client.settings.spendingThreshold;
	const over = totals.pendingAmount - threshold;

	return (
		<section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
			<h3 className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
				<Translate text={localizationConstants.forecastRiskSummaryTitle} />
			</h3>

			<div className="flex flex-col gap-1">
				<span className="text-sm text-slate-600">
					<Translate text={localizationConstants.forecastRiskOutstandingLabel} />
				</span>
				<p className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
					{formatSek(totals.pendingAmount)}
				</p>
				<span className="text-xs text-slate-500">
					{t(localizationConstants.forecastRiskOfLimit, { limit: formatSek(threshold) })}
				</span>
			</div>

			<div className="flex justify-center">
				<RiskGauge percent={totals.thresholdPercent} />
			</div>

			{over > 0 && (
				<div className="flex gap-2 rounded-lg bg-red-50 p-3 text-red-700">
					<CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
					<div className="flex flex-col gap-0.5 text-xs">
						<span className="font-semibold">
							<Translate text={localizationConstants.forecastRiskLimitExceededTitle} />
						</span>
						<span>
							{t(localizationConstants.forecastRiskLimitExceededBody, { amount: formatSek(over) })}
						</span>
					</div>
				</div>
			)}
		</section>
	);
}

export default RiskOutstandingCard;
