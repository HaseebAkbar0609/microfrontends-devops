"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import { cn } from "@/lib/utils";
import type { TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";

export interface DonutSegment {
	id: string;
	/** Resolved by the caller, so the ring knows nothing of any domain's palette. */
	color: string;
	labelKey: TranslationKeys;
	value: number;
}

export interface StatusDonutProps {
	segments: DonutSegment[];
	/** The ring draws no text a screen reader can follow, so it names itself. */
	ariaLabelKey: TranslationKeys;
	emptyKey: TranslationKeys;
	/** How each legend line reads; it is given `value` and `label`. */
	legendRowKey: TranslationKeys;
	/** Beside the ring, or under it. */
	legendPlacement?: "beside" | "below";
	/** The ring's box; it is square. */
	size?: string;
	className?: string;
}

/**
 * A ring over a handful of named quantities, with a legend that spells out
 * every one of them. Segments worth nothing are left out of the ring — a
 * zero-width slice draws as a hairline — but stay in the legend, so the reader
 * sees that the quantity exists and is empty.
 */
export function StatusDonut({
	segments,
	ariaLabelKey,
	emptyKey,
	legendRowKey,
	legendPlacement = "beside",
	size = "h-20 w-20",
	className,
}: StatusDonutProps) {
	const t = useTranslate();
	const drawn = segments.filter((segment) => segment.value > 0);

	if (drawn.length === 0) {
		return (
			<p className="py-4 text-xs text-slate-500">
				<Translate text={emptyKey} />
			</p>
		);
	}

	const below = legendPlacement === "below";

	return (
		<div className={cn(below ? "flex flex-col items-center gap-3" : "flex items-center gap-4", className)}>
			<div className={cn(size, "shrink-0", below && "order-first")} role="img" aria-label={t(ariaLabelKey)}>
				<ResponsiveContainer width="100%" height="100%">
					<PieChart>
						<Pie
							data={drawn}
							dataKey="value"
							nameKey="id"
							innerRadius="62%"
							outerRadius="100%"
							paddingAngle={2}
							stroke="none"
							isAnimationActive={false}
						>
							{drawn.map((segment) => (
								<Cell key={segment.id} fill={segment.color} />
							))}
						</Pie>
					</PieChart>
				</ResponsiveContainer>
			</div>

			<ul
				className={cn(
					"text-xs text-slate-600",
					below ? "flex flex-wrap justify-center gap-x-4 gap-y-1.5" : "flex min-w-0 flex-1 flex-col gap-1.5",
				)}
			>
				{segments.map((segment) => (
					<li key={segment.id} className="flex items-center gap-2">
						<span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: segment.color }} aria-hidden />
						<span className="truncate">
							{t(legendRowKey, { value: segment.value, label: t(segment.labelKey) })}
						</span>
					</li>
				))}
			</ul>
		</div>
	);
}

export default StatusDonut;
