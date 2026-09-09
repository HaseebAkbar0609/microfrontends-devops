"use client";

import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { MARKETING_TRAFFIC_SOURCES } from "../../constants/marketingAnalytics.mock";

/**
 * Share bars. A plain div track and fill rather than a progress primitive,
 * matching how the support module draws the same shape.
 */
export function TrafficSourceCard() {
	return (
		<section className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
			<h2 className="text-base font-semibold text-slate-900">
				<Translate text={localizationConstants.marketingSourcesTitle} />
			</h2>
			<p className="mt-0.5 text-sm text-slate-500">
				<Translate text={localizationConstants.marketingSourcesSubtitle} />
			</p>

			<ul className="mt-4 flex flex-col gap-3">
				{MARKETING_TRAFFIC_SOURCES.map((source) => (
					<li key={source.id}>
						<div className="flex items-baseline justify-between gap-3">
							<span className="text-sm text-slate-700">
								<Translate text={source.labelKey} />
							</span>
							<span className="text-sm text-slate-500 tabular-nums">
								{source.share} %
							</span>
						</div>
						<div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
							<div
								className="h-full rounded-full"
								style={{
									width: `${source.share}%`,
									backgroundColor: source.chartColor,
								}}
							/>
						</div>
					</li>
				))}
			</ul>
		</section>
	);
}

export default TrafficSourceCard;
