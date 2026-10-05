import { INITIAL_FORECAST_LIST } from "../mock/forecastList.mock";
import type { ForecastListRow } from "../types/forecastList.types";

/**
 * Prognos's forecast register, in memory.
 *
 * There is no forecast endpoint, so this stands in for one as the module's
 * other registers do: a module-level array every read goes through, each
 * mutator reassigning it. A hard reload returns to the seed, and nothing is
 * written to browser storage (AGENTS.md rule 6).
 *
 * It has to live here rather than in the hook's state, because Prognoslista
 * and Arkiv are two routes over the same register: a row archived on one is
 * the row the other then lists, and component state unmounts between them.
 */
let forecasts: ForecastListRow[] = INITIAL_FORECAST_LIST.map((row) => ({ ...row }));

/** One side of the register — the archived rows, or the rest. */
export function listForecasts(archived: boolean): ForecastListRow[] {
	return forecasts.filter((row) => row.archived === archived);
}

/** Reversible, which is why the caller does not confirm it. */
export function setForecastArchived(id: string, archived: boolean): void {
	forecasts = forecasts.map((row) => (row.id === id ? { ...row, archived } : row));
}

/** Permanent, from both lists at once. Keep it behind a confirm. */
export function removeForecast(id: string): void {
	forecasts = forecasts.filter((row) => row.id !== id);
}
