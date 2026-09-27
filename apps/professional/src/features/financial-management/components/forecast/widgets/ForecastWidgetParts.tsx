import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

/**
 * A label and its figure on one line; when the card is too narrow for both,
 * the figure drops below the label and keeps to the right.
 */
export const FORECAST_ROW = "flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5";
export const FORECAST_ROW_FIGURE = "ml-auto shrink-0 text-right tabular-nums";

/** A Prognos widget's body, its blocks stacked from the top of the card. */
export function ForecastWidgetBody({ children, className }: { children: ReactNode; className?: string }) {
	return <div className={cn("flex flex-1 flex-col gap-4 text-sm text-slate-600", className)}>{children}</div>;
}

export function ForecastStatList({ children }: { children: ReactNode }) {
	return <dl className="space-y-2">{children}</dl>;
}

export function ForecastStat({ label, children }: { label: TranslationKeys; children: ReactNode }) {
	return (
		<div className={FORECAST_ROW}>
			<dt>
				<Translate text={label} />
			</dt>
			<dd className={cn(FORECAST_ROW_FIGURE, "font-medium text-slate-900")}>{children}</dd>
		</div>
	);
}

/** A figure that turns red when it is a problem: overload, a forecast over plan. */
export function ForecastFigure({ alert, children }: { alert: boolean; children: ReactNode }) {
	return <span className={alert ? "text-red-600" : undefined}>{children}</span>;
}
