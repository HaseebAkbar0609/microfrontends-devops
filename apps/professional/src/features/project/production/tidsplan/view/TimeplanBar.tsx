"use client";

import { cn } from "@/lib/utils";
import { phaseColor } from "../timeplan.config";
import { DAY_COL_PX, pillPlacement } from "./ganttLayout";

export interface TimeplanBarProps {
	name: string;
	/** Day column the bar starts in. */
	startCol: number;
	/** Days it covers, end date included. */
	spanCols: number;
	totalCols: number;
	phaseIndex: number;
	depth: number;
	/** Read to a screen reader in place of the bar, which is decoration. */
	rangeLabel: string;
}

/**
 * One task's bar, split into day segments, with its name pill beside it.
 *
 * Positioned in pixels from fixed-width day columns, so it lines up with the
 * header exactly. The bar sits in a container that does **not** clip, or the
 * pill would be cut off where it runs past the bar — the problem the order
 * module's `GanttChartGrid` would have, being `overflow-hidden`.
 */
export function TimeplanBar({
	name,
	startCol,
	spanCols,
	totalCols,
	phaseIndex,
	depth,
	rangeLabel,
}: TimeplanBarProps) {
	if (spanCols <= 0) return <span className="sr-only">{rangeLabel}</span>;

	const left = startCol * DAY_COL_PX;
	const width = spanCols * DAY_COL_PX;
	const placement = pillPlacement(startCol, spanCols, totalCols, name);
	const color = phaseColor(phaseIndex, depth);

	return (
		<>
			<span className="sr-only">{rangeLabel}</span>
			<div
				aria-hidden
				className="absolute top-1/2 flex h-6 -translate-y-1/2 gap-0.5 px-0.5"
				style={{ left, width }}
			>
				{Array.from({ length: spanCols }, (_, index) => (
					<span key={index} className={cn("h-full flex-1 rounded-[3px]", color)} />
				))}
			</div>
			{placement !== "none" && (
				<span
					aria-hidden
					className="absolute top-1/2 z-10 -translate-y-1/2 rounded-md bg-slate-900 px-3 py-1 text-xs font-medium whitespace-nowrap text-white shadow-sm"
					style={
						placement === "right"
							? { left: left + width + 8 }
							: { right: `calc(100% - ${left - 8}px)` }
					}
				>
					{name}
				</span>
			)}
		</>
	);
}

export default TimeplanBar;
