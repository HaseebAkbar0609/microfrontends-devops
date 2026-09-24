export interface CalculationStatRow {
	id: string;
	datum: string;
	bestellare: string;
	kategori: string;
	typ: string;
	entreprenadform: string;
	antalOffert: number;
	vunna: number;
	forlorade: number;
}

export type CalculationStatSortField = keyof Pick<
	CalculationStatRow,
	| "datum"
	| "bestellare"
	| "kategori"
	| "typ"
	| "entreprenadform"
	| "antalOffert"
	| "vunna"
	| "forlorade"
>;

export interface CalculationStatKpis {
	totalOffers: number;
	won: number;
	lost: number;
}

export interface CalculationStatFilters {
	bestellare: string;
	kategori: string[];
	typ: string[];
	entreprenadform: string;
	startDate: string;
	endDate: string;
}

export interface GetCalculationStatisticsParams {
	search?: string;
	bestellare?: string;
	kategori?: string[];
	typ?: string[];
	entreprenadform?: string;
	startDate?: string;
	endDate?: string;
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface GetCalculationStatisticsResponse {
	data: CalculationStatRow[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}
