"use client";

import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { getSupportChannelMeta } from "../../constants/supportStatuses";
import type { ChannelShare } from "../../hooks/useSupportMetrics";

type ChannelShareCardProps = {
	share: ChannelShare[];
};

/** Share of the week's ticket volume per channel. */
export function ChannelShareCard({ share }: ChannelShareCardProps) {
	return (
		<section className="@container rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
			<h2 className="text-base font-semibold text-slate-900">
				<Translate text={localizationConstants.supportChannelShareTitle} />
			</h2>
			<ul className="mt-4 space-y-4">
				{share.map((entry) => {
					const meta = getSupportChannelMeta(entry.channel);
					return (
						<li key={entry.channel}>
							<div className="flex items-baseline justify-between gap-2 text-sm">
								<span className="text-slate-700">
									<Translate text={meta.labelKey} />
								</span>
								<span className="tabular-nums text-slate-500">
									{entry.count} · {entry.percent} %
								</span>
							</div>
							<div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
								<div
									className="h-full rounded-full"
									style={{
										width: `${entry.percent}%`,
										backgroundColor: meta.chartColor,
									}}
								/>
							</div>
						</li>
					);
				})}
			</ul>
		</section>
	);
}
