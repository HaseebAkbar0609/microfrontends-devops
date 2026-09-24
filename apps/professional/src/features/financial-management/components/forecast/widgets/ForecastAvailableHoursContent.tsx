"use client";

import { useState } from "react";

import { SegmentedToggle } from "@/components/ui/SegmentedToggle";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { FORECAST_PERIODS } from "../../../constants/forecastDashboard.constants";
import type {
	ForecastMonthBalance,
	ForecastPeriod,
	ForecastWeekBalance,
} from "../../../types/forecastDashboard.types";
import { formatSignedHours } from "../../../utils/economyFormatters";
import { FORECAST_ROW, FORECAST_ROW_FIGURE, ForecastWidgetBody } from "./ForecastWidgetParts";

export interface ForecastAvailableHoursContentProps {
	weeks: ForecastWeekBalance[];
	months: ForecastMonthBalance[];
}

/**
 * Tillgängliga timmar: each week's — or month's — free capacity, or its
 * overload in red. Vecka / Månad switch between the two.
 */
export function ForecastAvailableHoursContent({ weeks, months }: ForecastAvailableHoursContentProps) {
	const t = useTranslate();
	const [period, setPeriod] = useState<ForecastPeriod>("week");

	const rows =
		period === "week"
			? weeks.map(({ week, hours }) => ({
					id: `week-${week}`,
					label: t(localizationConstants.forecastWeekLabel, { week }),
					hours,
				}))
			: months.map(({ id, labelKey, hours }) => ({ id, label: t(labelKey), hours }));

	return (
		<ForecastWidgetBody className="gap-3">
			<SegmentedToggle
				options={FORECAST_PERIODS}
				value={period}
				onChange={setPeriod}
				ariaLabel={t(localizationConstants.forecastPeriodToggleLabel)}
				className="self-start"
			/>

			<ul className="space-y-1.5">
				{rows.map(({ id, label, hours }) => (
					<li key={id} className={FORECAST_ROW}>
						<span>{label}</span>
						<span className={cn(FORECAST_ROW_FIGURE, "font-medium", hours < 0 ? "text-red-600" : "text-slate-900")}>
							{t(
								hours < 0
									? localizationConstants.forecastHoursOverload
									: localizationConstants.forecastHoursFreeCapacity,
								{ hours: formatSignedHours(hours) },
							)}
						</span>
					</li>
				))}
			</ul>
		</ForecastWidgetBody>
	);
}

export default ForecastAvailableHoursContent;
