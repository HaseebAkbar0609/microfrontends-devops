export type ForecastCategory = "newBuild" | "service" | "contracting";

export type ForecastCustomerType = "b2b" | "private";

export type ForecastListStatus = "done";

/** One forecast in Prognoslista: a project's object, its customer, dates and money. */
export interface ForecastListRow {
	id: string;
	objectNo: string;
	customer: string;
	category: ForecastCategory;
	customerType: ForecastCustomerType;
	projectName: string;
	/** ISO date, YYYY-MM-DD. */
	startDate: string;
	/** ISO date, YYYY-MM-DD. */
	endDate: string;
	costCentre: string;
	responsible: string;
	/** Intäkter, in SEK. */
	revenue: number;
	/** Kostnader, in SEK, negative as the frame writes them. */
	costs: number;
	status: ForecastListStatus;
}

export type ForecastListSortField =
	| "objectNo"
	| "customer"
	| "category"
	| "customerType"
	| "projectName"
	| "startDate"
	| "endDate"
	| "costCentre"
	| "responsible"
	| "revenue"
	| "costs"
	| "contribution"
	| "status";

/** Filter's two groups; `null` is Alla. */
export interface ForecastListFilters {
	category: ForecastCategory | null;
	customerType: ForecastCustomerType | null;
}
