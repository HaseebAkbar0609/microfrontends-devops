/** Resultat prognos reads either a year per object, or a year of months per role. */
export type ForecastResultView = "yearly" | "monthly";

/** Årlig: one object's year. Kostnader are held as positive amounts. */
export interface ForecastYearlyRow {
	id: string;
	objectName: string;
	revenue: number;
	costs: number;
	/** ISO date, YYYY-MM-DD. */
	startDate: string;
	/** ISO date, YYYY-MM-DD. */
	endDate: string;
}

/** Månad: one role's result for each of the twelve months, January first. */
export interface ForecastMonthlyRow {
	id: string;
	role: string;
	months: number[];
}

export type ForecastYearlySortField = "objectName" | "revenue" | "costs" | "contribution" | "startDate" | "endDate";

/** Roll, or one month by its index — `month-0` is January. */
export type ForecastMonthlySortField = "role" | `month-${number}`;

/** Whether a row's result is in the black or the red; `null` is Alla. */
export type ForecastResultSign = "positive" | "negative";
