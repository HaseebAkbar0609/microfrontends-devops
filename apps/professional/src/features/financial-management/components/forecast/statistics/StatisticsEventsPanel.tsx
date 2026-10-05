"use client";

import type { TranslationKeys } from "@/utils/translation/constants";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { StatisticsEvent } from "../../../types/forecastStatistics.types";
import { PANEL_SURFACE, PANEL_TITLE } from "../SummaryCardParts";

export interface StatisticsEventsPanelProps {
	titleKey: TranslationKeys;
	events: StatisticsEvent[];
	/** The bullet's colour, so the two cards can be told apart at a glance. */
	dotClassName: string;
}

/**
 * What has happened lately, as a short list.
 *
 * The page shows two of these. The frame titles both of them the same, which
 * cannot be right for two different lists, so each is given its own heading.
 */
export function StatisticsEventsPanel({ titleKey, events, dotClassName }: StatisticsEventsPanelProps) {
	return (
		<section className={PANEL_SURFACE}>
			<h3 className={PANEL_TITLE}>
				<Translate text={titleKey} />
			</h3>

			{events.length === 0 ? (
				<p className="py-4 text-sm text-slate-500">
					<Translate text={localizationConstants.forecastStatisticsEventsEmpty} />
				</p>
			) : (
				<ul className="flex flex-col gap-2">
					{events.map((event) => (
						<li
							key={event.id}
							className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2.5"
						>
							<span className={`mt-1.5 size-2 shrink-0 rounded-full ${dotClassName}`} aria-hidden />
							<span className="flex min-w-0 flex-col gap-0.5">
								<span className="text-sm text-slate-700">
									<Translate text={event.labelKey} />
								</span>
								<span className="text-xs text-slate-400 tabular-nums">{event.date}</span>
							</span>
						</li>
					))}
				</ul>
			)}
		</section>
	);
}

export default StatisticsEventsPanel;
