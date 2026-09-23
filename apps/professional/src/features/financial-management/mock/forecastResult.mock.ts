import type { ForecastMonthlyRow, ForecastYearlyRow } from "../types/forecastResult.types";

/**
 * Resultat prognos's rows, from the TFS-1053 frames, until a forecast API
 * exists. Overhead carries cost with no revenue, so its TB-bidrag is the one
 * that reads red; the totals under each table are summed from these rows.
 */
export const INITIAL_FORECAST_YEARLY: ForecastYearlyRow[] = [
	{ id: "fy-overhead", objectName: "Overhead", revenue: 0, costs: 1580000, startDate: "2026-01-01", endDate: "2026-12-31" },
	{ id: "fy-2025-01", objectName: "Projekt 2025-01", revenue: 4500000, costs: 3000000, startDate: "2026-01-01", endDate: "2026-09-30" },
	{ id: "fy-2022-002", objectName: "Projekt 2022-002", revenue: 4500000, costs: 3000000, startDate: "2026-01-01", endDate: "2026-10-30" },
	{ id: "fy-2022-003", objectName: "Projekt 2022-003", revenue: 4500000, costs: 3000000, startDate: "2026-01-01", endDate: "2026-11-30" },
	{ id: "fy-2021-1", objectName: "2021-1", revenue: 4500000, costs: 3000000, startDate: "2026-01-01", endDate: "2026-06-30" },
	{ id: "fy-2021-2", objectName: "2021-2", revenue: 4500000, costs: 3000000, startDate: "2026-01-01", endDate: "2026-08-31" },
];

/* The frame's two shapes: a role in the red over the winter months, and one in
   the black, both levelling out at 5 860 from March to June. */
const LOSS_YEAR = [-145000, -145000, 5860, 5860, 5860, 5860, -145000, -145000, -145000, -145000, -145000, -145000];
const PROFIT_YEAR = [125000, 125000, 5860, 5860, 5860, 5860, 125000, 125000, 125000, 125000, 125000, 125000];

export const INITIAL_FORECAST_MONTHLY: ForecastMonthlyRow[] = [
	{ id: "fm-01", role: "Roll 01", months: LOSS_YEAR },
	{ id: "fm-02", role: "Roll 02", months: PROFIT_YEAR },
	{ id: "fm-03", role: "Roll 03", months: PROFIT_YEAR },
	{ id: "fm-04", role: "Roll 04", months: PROFIT_YEAR },
	{ id: "fm-05", role: "Roll 05", months: PROFIT_YEAR },
	{ id: "fm-06", role: "Roll 06", months: LOSS_YEAR },
];
