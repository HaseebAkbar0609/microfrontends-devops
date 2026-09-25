"use client";

import { CircleCheck, Info, PieChart } from "lucide-react";
import dynamic from "next/dynamic";

import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { RiskSummary } from "../../../types/forecastRisk.types";
import { formatPercent, formatSek } from "../../../utils/economyFormatters";

/* Recharts measures the DOM, so the ring must not render on the server. */
const RiskStatusDonut = dynamic(() => import("./charts/RiskStatusDonut"), {
	ssr: false,
	loading: () => <div className="h-20 w-full animate-pulse rounded-lg bg-slate-100" />,
});

const CARD = "flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs";

function CardHeading({ icon, labelKey }: { icon: React.ReactNode; labelKey: TranslationKeys }) {
	return (
		<div className="flex items-center gap-2 text-sm font-medium text-slate-600">
			{icon}
			<Translate text={labelKey} />
		</div>
	);
}

export interface RiskSummaryCardsProps {
	summary: RiskSummary;
}

/** The frame's four cards: three plain, then the dark one that totals the lot. */
export function RiskSummaryCards({ summary }: RiskSummaryCardsProps) {
	const t = useTranslate();

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
			<div className={CARD}>
				<CardHeading
					icon={<CircleCheck className="h-4 w-4 text-emerald-500" aria-hidden />}
					labelKey={localizationConstants.forecastRiskExposureTitle}
				/>
				<p className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">{formatSek(summary.exposure)}</p>
				<p className="text-xs text-slate-500">
					{t(localizationConstants.forecastRiskExposureCaption, { count: summary.highRiskCount })}
				</p>
			</div>

			<div className={CARD}>
				<CardHeading
					icon={<CircleCheck className="h-4 w-4 text-emerald-500" aria-hidden />}
					labelKey={localizationConstants.forecastRiskLimitTitle}
				/>
				<p className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
					{formatSek(summary.limitTotal)}
				</p>
				<p className="text-xs text-slate-500">
					{t(localizationConstants.forecastRiskLimitCaption, {
						percent: formatPercent(summary.limitUsedPercent, 0),
					})}
				</p>
			</div>

			<div className={CARD}>
				<CardHeading
					icon={<PieChart className="h-4 w-4 text-slate-500" aria-hidden />}
					labelKey={localizationConstants.forecastRiskDistributionTitle}
				/>
				<RiskStatusDonut slices={summary.distribution} />
			</div>

			{/* The frame's dark card, as the machines and calculation statistics draw theirs. */}
			<div className="flex flex-col gap-2 rounded-xl bg-[#1E293B] p-4 text-white shadow-2xs">
				<div className="flex items-center gap-2 text-sm font-medium text-white/90">
					<Info className="h-4 w-4" aria-hidden />
					<Translate text={localizationConstants.forecastRiskPendingTitle} />
				</div>
				<p className="text-2xl font-bold tracking-tight tabular-nums">{formatSek(summary.pendingTotal)}</p>
				<p className="text-xs text-white/70">
					{t(localizationConstants.forecastRiskPendingCaption, { count: summary.clientCount })}
				</p>
			</div>
		</div>
	);
}

export default RiskSummaryCards;
