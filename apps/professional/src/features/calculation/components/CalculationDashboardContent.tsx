"use client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { WidgetErrorState, WidgetLoadingState } from "@/features/widgetdashboard/components/WidgetContent";
import { CALCULATION_OVERVIEW_HREF, type CalculationDashboardData } from "../api/calculationDashboard";

export const CALCULATION_CONNECTED_WIDGETS = ["calcOverview", "calcStatus", "calcValue", "calcCalendar", "calcLatest", "calcStatistics"] as const;
type ConnectedWidget = typeof CALCULATION_CONNECTED_WIDGETS[number];
type Props = { kind: ConnectedWidget; data?: CalculationDashboardData; loading: boolean; error: boolean };
const statusLabels = {
    not_started: localizationConstants.calcDashboardNotStarted,
    in_progress: localizationConstants.calcWidgetOverviewOngoing,
    completed: localizationConstants.calcWidgetOverviewCompleted,
};

function Metric({ label, value }: { label: string; value: React.ReactNode }) {
    return <div className="flex min-w-0 items-baseline justify-between gap-3 py-1.5 text-sm">
        <span className="min-w-0 break-words text-slate-500"><Translate text={label} /></span>
        <span className="shrink-0 text-right font-semibold tabular-nums text-slate-800">{value}</span>
    </div>;
}

function Empty() {
    return <p className="py-6 text-sm text-slate-500"><Translate text={localizationConstants.noDataFound} /></p>;
}

function ItemList({ items, deadline }: { items: CalculationDashboardData["recentActivity"]; deadline?: boolean }) {
    if (!items.length) return <Empty />;
    return <ul className="divide-y divide-slate-200">{items.map((item) => <li key={item.id} className="min-w-0 py-2">
        <Link href={CALCULATION_OVERVIEW_HREF} className="block break-words text-sm font-medium text-slate-700 hover:underline">{item.project_name}</Link>
        <p className="break-all text-xs text-slate-500">{item.calc_no}</p>
        {deadline && <time className="text-xs text-slate-500" dateTime={item.latest_offer_date ?? undefined}>{item.latest_offer_date}</time>}
    </li>)}</ul>;
}

export default function CalculationDashboardContent({ kind, data, loading, error }: Props) {
    const t = useTranslate();
    if (loading) return <WidgetLoadingState />;
    if (error || !data) return <WidgetErrorState message={localizationConstants.widgetSourceLoadError} />;
    const summary = data.summary;
    const formatMoney = (value: string, currency: string) => new Intl.NumberFormat(undefined, { style: "currency", currency }).format(Number(value));
    let content: React.ReactNode;
    switch (kind) {
        case "calcOverview":
        case "calcStatus":
            content = <>
                {kind === "calcOverview" && <Metric label={localizationConstants.calcWidgetOverviewTotal} value={summary.total} />}
                {Object.entries(statusLabels).map(([status, label]) => <Metric key={status} label={label} value={summary.status_counts[status as keyof typeof statusLabels]} />)}
            </>;
            break;
        case "calcValue":
            content = <>
                {!summary.values.length && <Empty />}
                {summary.values.map((value) => <div key={value.currency} className="min-w-0 border-b border-slate-200 py-2 last:border-0">
                    <p className="text-xs font-medium text-slate-500">{value.currency}</p>
                    <div className="space-y-2">
                        <p className="break-words text-xs text-slate-500"><Translate text={localizationConstants.calcWidgetValueTotal} /></p>
                        <p className="break-words text-lg font-semibold tabular-nums text-slate-800">{formatMoney(value.total, value.currency)}</p>
                        <p className="break-words text-xs text-slate-500"><Translate text={localizationConstants.calcWidgetValueAverage} />: {formatMoney(value.average, value.currency)}</p>
                    </div>
                </div>)}
                {summary.missing_value_count > 0 && <Metric label={localizationConstants.calcDashboardMissingValue} value={summary.missing_value_count} />}
            </>;
            break;
        case "calcCalendar": content = <ItemList items={data.upcomingItems} deadline />; break;
        case "calcLatest": content = <ItemList items={data.recentActivity} />; break;
        case "calcStatistics":
            content = data.monthlyCounts.length ? <ul>{data.monthlyCounts.map((month) => <li key={month.month} className="flex justify-between gap-3 py-2 text-sm text-slate-700">
                <time dateTime={month.month}>{month.month}</time><span className="font-semibold tabular-nums">{month.count}</span>
            </li>)}</ul> : <Empty />;
    }
    return <div className="min-w-0 space-y-3">{content}
        <Link href={CALCULATION_OVERVIEW_HREF} className="inline-flex min-h-10 items-center gap-2 text-xs font-medium text-slate-600 hover:text-slate-900">
            {t(localizationConstants.calcOverviewPage)}<ArrowUpRight size={14} aria-hidden="true" />
        </Link>
    </div>;
}
