"use client";

import type { ReactNode } from "react";

type QuoteTotalsRowProps = {
	label: ReactNode;
	value: ReactNode;
	/** Emphasised line, used for the monthly cost and the first invoice. */
	strong?: boolean;
	muted?: boolean;
};

export function QuoteTotalsRow({
	label,
	value,
	strong,
	muted,
}: QuoteTotalsRowProps) {
	return (
		<div className="flex items-baseline justify-between gap-4">
			<span className={muted ? "text-slate-500" : "text-slate-700"}>
				{label}
			</span>
			<span
				className={`tabular-nums ${
					strong
						? "text-base font-semibold text-slate-900"
						: muted
							? "text-slate-500"
							: "text-slate-700"
				}`}
			>
				{value}
			</span>
		</div>
	);
}
