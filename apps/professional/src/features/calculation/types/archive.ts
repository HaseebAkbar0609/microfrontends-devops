export type ArchiveViewType = "kalkyl" | "project";

export type ArchiveStatus = "inProgress" | "notStarted" | "completed";

export interface CalculationArchiveRow {
	id: string;
	kalkylNr: string;
	projektNamn: string;
	koppling: string;
	bestellare: string;
	offertDatum: string;
	typ: string;
	status: ArchiveStatus;
	viewType: ArchiveViewType;
}

export type CalculationArchiveSortField = keyof Pick<
	CalculationArchiveRow,
	| "kalkylNr"
	| "projektNamn"
	| "koppling"
	| "bestellare"
	| "offertDatum"
	| "typ"
	| "status"
>;

export interface GetCalculationArchiveParams {
	page?: number;
	limit?: number;
	search?: string;
	status?: string;
	client?: string;
	startDate?: string;
	endDate?: string;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface GetCalculationArchiveResponse {
	data: CalculationArchiveRow[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}
