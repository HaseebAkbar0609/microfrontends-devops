"use client";

import { SalesDashboardCard, SalesDashboardEmpty } from "./SalesDashboardCard";

export type SalesWeekListRow = {
	id: string;
	primary: string;
	secondary: string;
	trailing: string;
};

type SalesWeekListProps = {
	titleKey: string;
	emptyKey: string;
	rows: SalesWeekListRow[];
};

/** A titled list of this week's records, or an empty-state line. */
export function SalesWeekList({ titleKey, emptyKey, rows }: SalesWeekListProps) {
	return (
		<SalesDashboardCard titleKey={titleKey}>
			{rows.length === 0 ? (
				<SalesDashboardEmpty textKey={emptyKey} />
			) : (
				<ul className="divide-y divide-slate-100">
					{rows.map((row) => (
						<li key={row.id} className="flex items-center justify-between gap-4 px-5 py-3">
							<div className="min-w-0">
								<p className="truncate text-sm font-medium text-slate-900">{row.primary}</p>
								<p className="truncate text-xs text-slate-500">{row.secondary}</p>
							</div>
							<span className="shrink-0 text-sm tabular-nums text-slate-700">{row.trailing}</span>
						</li>
					))}
				</ul>
			)}
		</SalesDashboardCard>
	);
}
