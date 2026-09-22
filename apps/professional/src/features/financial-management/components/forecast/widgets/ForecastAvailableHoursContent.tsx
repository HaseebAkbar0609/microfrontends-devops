"use client";

import { useState } from "react";

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
			<div
				role="group"
				aria-label={t(localizationConstants.forecastPeriodToggleLabel)}
				className="inline-flex self-start rounded-sm bg-white p-0.5"
			>
				{FORECAST_PERIODS.map((option) => {
					const active = period === option.id;
					return (
						<button
							key={option.id}
							type="button"
							aria-pressed={active}
							onClick={() => setPeriod(option.id)}
							className={cn(
								"cursor-pointer rounded-sm px-3 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:outline-none",
								active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100",
							)}
						>
							{t(option.labelKey)}
						</button>
					);
				})}
			</div>

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
