"use client";

import { useMemo, useState } from "react";

import { INITIAL_FORECAST_DASHBOARD_DATA } from "../mock/forecastDashboard.mock";
import { buildForecastDashboardState } from "../utils/forecastDashboard";

/** The Prognos dashboard's figures and whether its cards are being rearranged. */
export function useForecastDashboard() {
	const state = useMemo(() => buildForecastDashboardState(INITIAL_FORECAST_DASHBOARD_DATA), []);
	const [isRearranging, setIsRearranging] = useState(false);

	return { state, isRearranging, setIsRearranging };
}
