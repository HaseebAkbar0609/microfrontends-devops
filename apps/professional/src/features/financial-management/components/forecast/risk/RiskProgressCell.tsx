"use client";

import { formatPercent } from "../../../utils/economyFormatters";

export interface RiskProgressCellProps {
	/** What has been spent, as a percentage of the budget. */
	percent: number;
	/** The figure the bar sits under, already formatted. */
	amount: string;
	/** What the bar measures, for a screen reader. */
	label: string;
}

/**
 * An amount with its spend bar under it, as the register draws it. The bar is
 * a real progressbar rather than a coloured div, so it is readable without
 * seeing it; the percentage stays beside it for everyone else.
 */
export function RiskProgressCell({ percent, amount, label }: RiskProgressCellProps) {
	const clamped = Math.min(Math.max(percent, 0), 100);

	return (
		<div className="flex min-w-[10rem] flex-col gap-1.5">
			<span className="text-sm text-slate-900 tabular-nums">{amount}</span>
			<div className="flex items-center gap-2">
				<div
					className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200"
					role="progressbar"
					aria-valuemin={0}
					aria-valuemax={100}
					aria-valuenow={Math.round(clamped)}
					aria-label={label}
				>
					<div className="h-full rounded-full bg-slate-900" style={{ width: `${clamped}%` }} />
				</div>
				<span className="w-12 shrink-0 text-right text-xs font-medium text-slate-500 tabular-nums">
					{formatPercent(percent, 0)}
				</span>
			</div>
		</div>
	);
}

export default RiskProgressCell;
