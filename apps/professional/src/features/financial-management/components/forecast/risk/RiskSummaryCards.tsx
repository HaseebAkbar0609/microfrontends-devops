"use client";

import { CircleCheck, Info, PieChart } from "lucide-react";
import dynamic from "next/dynamic";

import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import type { RiskSummary } from "../../../types/forecastRisk.types";
import { formatPercent, formatSek } from "../../../utils/economyFormatters";
import {
	SUMMARY_CAPTION,
	SUMMARY_CAPTION_DARK,
	SUMMARY_CARD,
	SUMMARY_CARD_DARK,
	SUMMARY_CARD_GRID,
	SUMMARY_VALUE,
	SummaryCardHeading,
} from "../SummaryCardParts";

/* Recharts measures the DOM, so the ring must not render on the server. */
const RiskStatusDonut = dynamic(() => import("./charts/RiskStatusDonut"), {
	ssr: false,
	loading: () => <div className="h-20 w-full animate-pulse rounded-lg bg-slate-100" />,
});

export interface RiskSummaryCardsProps {
	summary: RiskSummary;
}

/** The frame's four cards: three plain, then the dark one that totals the lot. */
export function RiskSummaryCards({ summary }: RiskSummaryCardsProps) {
	const t = useTranslate();

	return (
		<div className={SUMMARY_CARD_GRID}>
			<div className={SUMMARY_CARD}>
				<SummaryCardHeading
					icon={<CircleCheck className="h-4 w-4 text-emerald-500" aria-hidden />}
					labelKey={localizationConstants.forecastRiskExposureTitle}
				/>
				<p className={cn(SUMMARY_VALUE, "text-slate-900")}>{formatSek(summary.exposure)}</p>
				<p className={SUMMARY_CAPTION}>
					{t(localizationConstants.forecastRiskExposureCaption, { count: summary.highRiskCount })}
				</p>
			</div>

			<div className={SUMMARY_CARD}>
				<SummaryCardHeading
					icon={<CircleCheck className="h-4 w-4 text-emerald-500" aria-hidden />}
					labelKey={localizationConstants.forecastRiskLimitTitle}
				/>
				<p className={cn(SUMMARY_VALUE, "text-slate-900")}>{formatSek(summary.limitTotal)}</p>
				<p className={SUMMARY_CAPTION}>
					{t(localizationConstants.forecastRiskLimitCaption, {
						percent: formatPercent(summary.limitUsedPercent, 0),
					})}
				</p>
			</div>

			<div className={SUMMARY_CARD}>
				<SummaryCardHeading
					icon={<PieChart className="h-4 w-4 text-slate-500" aria-hidden />}
					labelKey={localizationConstants.forecastRiskDistributionTitle}
				/>
				<RiskStatusDonut slices={summary.distribution} />
			</div>

			<div className={SUMMARY_CARD_DARK}>
				<SummaryCardHeading
					icon={<Info className="h-4 w-4" aria-hidden />}
					labelKey={localizationConstants.forecastRiskPendingTitle}
					tone="dark"
				/>
				<p className={SUMMARY_VALUE}>{formatSek(summary.pendingTotal)}</p>
				<p className={SUMMARY_CAPTION_DARK}>
					{t(localizationConstants.forecastRiskPendingCaption, { count: summary.clientCount })}
				</p>
			</div>
		</div>
	);
}

export default RiskSummaryCards;
