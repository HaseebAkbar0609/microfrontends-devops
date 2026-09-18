"use client";

import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { SALES_CHART_FILL_CLASS } from "../../constants/salesTheme";
import type { BarRow } from "../../utils/salesStatistics";

type StatBarListProps = {
	titleKey: string;
	rows: BarRow[];
	/** Prefix for rows labelled by data, such as a week number. */
	rowLabelPrefixKey?: string;
};

/**
 * A labelled bar meter: one row per item, each showing its value and a bar
 * scaled against the largest value in the card.
 *
 * One series per card, so the title names it and no legend is needed. Every row
 * carries its value as a direct label, which is what keeps the meaning off
 * colour alone.
 */
export function StatBarList({ titleKey, rows, rowLabelPrefixKey }: StatBarListProps) {
	const t = useTranslate();
	const max = Math.max(0, ...rows.map((row) => row.value));

	return (
		<section className="rounded-xl border border-slate-200 bg-white shadow-2xs">
			<h2 className="border-b border-slate-200 px-5 py-4 text-base font-semibold text-slate-900">
				<Translate text={titleKey} />
			</h2>

			{rows.length === 0 ? (
				<p className="px-5 py-8 text-sm text-slate-500">
					<Translate text={localizationConstants.salesBookerStatsNoData} />
				</p>
			) : (
				<ul className="flex flex-col gap-3 px-5 py-4">
					{rows.map((row) => {
						const label = row.labelKey
							? t(row.labelKey)
							: `${rowLabelPrefixKey ? `${t(rowLabelPrefixKey)} ` : ""}${row.label ?? ""}`;
						const width = max > 0 ? (row.value / max) * 100 : 0;

						return (
							<li key={row.id} title={`${label}: ${row.value}`}>
								<div className="flex items-baseline justify-between gap-3">
									<span className="text-sm text-slate-700">{label}</span>
									<span className="text-sm tabular-nums text-slate-900">
										{row.value}
									</span>
								</div>
								<div className="mt-1 h-1.5 w-full rounded-full bg-slate-100">
									{width > 0 && (
										<div
											className={`h-1.5 rounded-full ${SALES_CHART_FILL_CLASS}`}
											style={{ width: `${width}%` }}
										/>
									)}
								</div>
							</li>
						);
					})}
				</ul>
			)}
		</section>
	);
}
