"use client";

import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { formatCurrency } from "../../utils/salesFormatters";
import type { SalesStatistics } from "../../utils/salesStatistics";

/** Four headline figures: the totals the rest of the page breaks down. */
export function StatKpis({ statistics }: { statistics: SalesStatistics }) {
	const cards = [
		{
			id: "companies",
			labelKey: localizationConstants.salesStatsKpiCompanies,
			value: String(statistics.companies),
			accentClassName: "bg-teal-50 text-teal-700",
		},
		{
			id: "meetings",
			labelKey: localizationConstants.salesKpiMeetingsBooked,
			value: String(statistics.meetings),
			accentClassName: "bg-emerald-50 text-emerald-700",
		},
		{
			id: "calls",
			labelKey: localizationConstants.salesKpiCallsMade,
			value: String(statistics.calls),
			accentClassName: "bg-slate-100 text-slate-700",
		},
		{
			id: "invoiced",
			labelKey: localizationConstants.salesStatsKpiInvoicedTotal,
			value: formatCurrency(statistics.invoiced),
			accentClassName: "bg-amber-50 text-amber-600",
		},
	];

	return (
		<div className="grid grid-cols-1 gap-4 @xl:grid-cols-2 @5xl:grid-cols-4">
			{cards.map((card) => (
				<div
					key={card.id}
					className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs"
				>
					<span
						className={`inline-flex rounded-md px-2 py-0.5 text-sm font-medium ${card.accentClassName}`}
					>
						<Translate text={card.labelKey} />
					</span>
					<p className="mt-3 text-3xl font-semibold tabular-nums text-slate-900">
						{card.value}
					</p>
				</div>
			))}
		</div>
	);
}
