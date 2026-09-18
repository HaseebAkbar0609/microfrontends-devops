"use client";

import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { SalesDashboardStats } from "../../utils/salesDashboard";
import { formatCurrency } from "../../utils/salesFormatters";

type KpiCard = {
	id: string;
	labelKey: string;
	value: number;
	accentClassName: string;
	hintKey?: string;
	hintAmount?: number;
};

function getKpiCards(stats: SalesDashboardStats): KpiCard[] {
	return [
		{
			id: "deals",
			labelKey: localizationConstants.salesKpiDealsThisWeek,
			value: stats.dealsThisWeek,
			hintAmount: stats.dealsAmountThisWeek,
			accentClassName: "bg-teal-50 text-teal-700",
		},
		{
			id: "calls",
			labelKey: localizationConstants.salesKpiCallsMade,
			value: stats.callsThisWeek,
			hintKey: localizationConstants.salesKpiCallsHint,
			accentClassName: "bg-amber-50 text-amber-600",
		},
		{
			id: "meetings",
			labelKey: localizationConstants.salesKpiMeetingsBooked,
			value: stats.meetingsThisWeek,
			hintKey: localizationConstants.salesKpiMeetingsHint,
			accentClassName: "bg-emerald-50 text-emerald-700",
		},
		{
			id: "quotes",
			labelKey: localizationConstants.salesKpiQuotesSent,
			value: stats.quotesThisWeek,
			hintKey: localizationConstants.salesKpiQuotesHint,
			accentClassName: "bg-slate-100 text-slate-700",
		},
		{
			id: "new-customers",
			labelKey: localizationConstants.salesKpiNewCustomers,
			value: stats.newCustomersThisWeek,
			hintKey: localizationConstants.salesKpiNewCustomersHint,
			accentClassName: "bg-yellow-50 text-yellow-600",
		},
		{
			id: "pipeline",
			labelKey: localizationConstants.salesKpiPipelineTotal,
			value: stats.pipelineTotal,
			hintAmount: stats.invoicedTotal,
			hintKey: localizationConstants.salesKpiInvoicedSuffix,
			accentClassName: "bg-cyan-50 text-cyan-700",
		},
	];
}

/** The six headline figures across the top of the sales dashboard. */
export function SalesKpiCards({ stats }: { stats: SalesDashboardStats }) {
	return (
		<div className="grid grid-cols-1 gap-4 @xl:grid-cols-2 @3xl:grid-cols-3 @7xl:grid-cols-6">
			{getKpiCards(stats).map((card) => (
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
					<p className="text-sm text-slate-500">
						{card.hintAmount !== undefined && formatCurrency(card.hintAmount)}
						{card.hintAmount !== undefined && card.hintKey ? " " : null}
						{card.hintKey && <Translate text={card.hintKey} />}
					</p>
				</div>
			))}
		</div>
	);
}
