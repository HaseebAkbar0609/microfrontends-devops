"use client";

import dynamic from "next/dynamic";

import type { TranslationKeys } from "@/utils/translation/constants";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { StatisticsDistributionSlice } from "../../../types/forecastStatistics.types";

/* Recharts measures the DOM, so every ring in Prognos comes in client-side. */
const StatusDonut = dynamic(() => import("../charts/StatusDonut"), {
	ssr: false,
	loading: () => <div className="h-40 w-full animate-pulse rounded-lg bg-slate-100" />,
});

const PANEL = "flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs";

export interface StatisticsDonutPanelProps {
	titleKey: TranslationKeys;
	slices: StatisticsDistributionSlice[];
	/** Resolved here, so the ring stays ignorant of any domain's palette. */
	colorOf: (slice: StatisticsDistributionSlice) => string;
	ariaLabelKey: TranslationKeys;
	emptyKey: TranslationKeys;
}

/**
 * One of the two rings, titled, with its legend beneath.
 *
 * Beneath rather than beside: in a third of the page's width the side legend
 * truncates its rows, which is the reason Personal's distribution panel made
 * the same choice.
 */
export function StatisticsDonutPanel({
	titleKey,
	slices,
	colorOf,
	ariaLabelKey,
	emptyKey,
}: StatisticsDonutPanelProps) {
	return (
		<section className={PANEL}>
			<h3 className="text-base font-semibold text-slate-900">
				<Translate text={titleKey} />
			</h3>
			<div className="flex flex-1 items-center justify-center py-2">
				<StatusDonut
					segments={slices.map((slice) => ({
						id: slice.id,
						color: colorOf(slice),
						labelKey: slice.labelKey,
						value: slice.value,
					}))}
					ariaLabelKey={ariaLabelKey}
					emptyKey={emptyKey}
					legendRowKey={localizationConstants.forecastStatisticsDistributionRow}
					legendPlacement="below"
					size="h-40 w-40"
				/>
			</div>
		</section>
	);
}

export default StatisticsDonutPanel;
