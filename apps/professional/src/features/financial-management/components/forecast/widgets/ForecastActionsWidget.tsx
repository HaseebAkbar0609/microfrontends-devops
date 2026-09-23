import { DollarSign } from "lucide-react";

import type { WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";
import { FORECAST_WARNING_TONES, FORECAST_WIDGET_TITLES } from "../../../constants/forecastDashboard.constants";
import type { ForecastDashboardState } from "../../../types/forecastDashboard.types";

/**
 * Åtgärder & varningar: what stands in the way of the forecast, each with its
 * count. The list runs in two columns once the card is wide enough — the
 * full-width row it is drawn in — and in one in a half-width slot.
 */
export function createForecastActionsWidget(state: ForecastDashboardState): Record<string, WidgetProps> {
	return {
		actionsWarnings: {
			title: FORECAST_WIDGET_TITLES.actionsWarnings,
			icon: DollarSign,
			content: (
				<div className="@container flex-1">
					<ul className="grid gap-2 text-sm text-slate-700 @xl:grid-cols-2">
						{state.warnings.map((warning) => {
							const tone = FORECAST_WARNING_TONES[warning.tone];
							const Icon = tone.icon;
							return (
								<li key={warning.id} className="flex items-center gap-3 rounded-sm bg-white px-3 py-2">
									<Icon size={16} aria-hidden className={cn("shrink-0", tone.iconClass)} />
									<span className="min-w-0 flex-1">
										<Translate text={warning.labelKey} />
									</span>
									<span
										className={cn(
											"shrink-0 rounded-sm px-2 py-0.5 text-xs font-semibold tabular-nums",
											tone.countClass,
										)}
									>
										{warning.count}
									</span>
								</li>
							);
						})}
					</ul>
				</div>
			),
		},
	};
}
