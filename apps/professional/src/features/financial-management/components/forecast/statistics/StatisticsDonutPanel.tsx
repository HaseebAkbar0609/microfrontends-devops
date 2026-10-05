"use client";

import dynamic from "next/dynamic";

import type { TranslationKeys } from "@/utils/translation/constants";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { StatisticsDistributionSlice } from "../../../types/forecastStatistics.types";
import { PANEL_SURFACE, PANEL_TITLE } from "../SummaryCardParts";

/* Recharts measures the DOM, so every ring in Prognos comes in client-side. */
const StatusDonut = dynamic(() => import("../charts/StatusDonut"), {
	ssr: false,
	loading: () => <div className="h-40 w-full animate-pulse rounded-lg bg-slate-100" />,
});

export interface StatisticsDonutPanelProps<Id extends string> {
	titleKey: TranslationKeys;
	slices: StatisticsDistributionSlice<Id>[];
	/**
	 * Resolved here, so the ring stays ignorant of any domain's palette. `Id`
	 * travels with the slices, so a caller can index its palette directly
	 * rather than casting and falling back on a default colour.
	 */
	colorOf: (slice: StatisticsDistributionSlice<Id>) => string;
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
export function StatisticsDonutPanel<Id extends string>({
	titleKey,
	slices,
	colorOf,
	ariaLabelKey,
	emptyKey,
}: StatisticsDonutPanelProps<Id>) {
	return (
		<section className={PANEL_SURFACE}>
			<h3 className={PANEL_TITLE}>
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
