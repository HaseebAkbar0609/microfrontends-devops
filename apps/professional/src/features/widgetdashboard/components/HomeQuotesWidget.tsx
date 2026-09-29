"use client";

import Link from "next/link";
import { AlertCircle, ArrowRight, RefreshCw } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { useOfferDashboardCounts } from "@/features/offer/hooks/useOfferDashboardCounts";
import { OFFER_COUNT_KEYS, type OfferCountKey } from "@/features/offer/services/offerDashboardCounts";
import { WidgetErrorState, WidgetLoadingState } from "./WidgetContent";

const labels: Record<OfferCountKey, string> = {
	available: localizationConstants.offerWidgetProjectsTitle,
	requested: localizationConstants.offerWidgetRequestsTitle,
	offered: localizationConstants.offerWidgetSentTitle,
	accepted: localizationConstants.offerWidgetAcceptedTitle,
	archived: localizationConstants.offerWidgetHistoryTitle,
};
const QUOTES_DASHBOARD_PATH = "/module/business/offer/dashboard";

export const HomeQuotesWidget = () => {
	const { counts, loading, refresh } = useOfferDashboardCounts();
	const t = useTranslate();

	return (
		<div className="min-w-0 space-y-2">
			{loading ? <WidgetLoadingState rows={OFFER_COUNT_KEYS.length} /> : !counts ? (
				<WidgetErrorState message={localizationConstants.widgetDataLoadError} />
			) : (
				<dl className="space-y-1 text-xs">
					{OFFER_COUNT_KEYS.map((id) => (
						<div key={id} className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
							<dt className="min-w-0 break-words text-slate-500"><Translate text={labels[id]} /></dt>
							<dd className="font-medium tabular-nums text-slate-800">
								{counts[id] === null ? (
									<span role="alert" title={t(localizationConstants.widgetDataLoadError)} aria-label={t(localizationConstants.widgetDataLoadError)}>
										<AlertCircle size={16} className="text-red-600" aria-hidden="true" />
									</span>
								) : counts[id]}
							</dd>
						</div>
					))}
				</dl>
			)}
			<div className="flex min-w-0 items-center justify-between gap-2 border-t border-slate-200 pt-2">
				<Link href={QUOTES_DASHBOARD_PATH} className="inline-flex min-h-11 min-w-0 items-center gap-2 text-xs text-slate-700 hover:underline">
					<span className="min-w-0 break-words"><Translate text={localizationConstants.homeQuotesOpen} /></span>
					<ArrowRight size={16} className="shrink-0" aria-hidden="true" />
				</Link>
				<button type="button" onClick={refresh} disabled={loading} title={t(localizationConstants.homeQuotesRefresh)} aria-label={t(localizationConstants.homeQuotesRefresh)}
					className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-sm text-slate-700 hover:bg-white disabled:opacity-50">
					<RefreshCw size={16} className={loading ? "animate-spin" : ""} aria-hidden="true" />
				</button>
			</div>
		</div>
	);
};
