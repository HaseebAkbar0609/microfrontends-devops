"use client";

import type { LucideIcon } from "lucide-react";

type MarketingKpiCardProps = {
	label: string;
	value: string;
	hint: string;
	icon: LucideIcon;
};

/** One tile in the overview KPI row. Every figure is derived from the registers. */
export function MarketingKpiCard({
	label,
	value,
	hint,
	icon: Icon,
}: MarketingKpiCardProps) {
	return (
		<div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
			<div className="flex items-center justify-between gap-3">
				<p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
					{label}
				</p>
				<Icon className="size-4 shrink-0 text-slate-400" aria-hidden />
			</div>
			<p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">
				{value}
			</p>
			<p className="mt-1 text-xs text-slate-500">{hint}</p>
		</div>
	);
}

export default MarketingKpiCard;
