export interface PriceListArticleItem {
	id: string;
	isFavorite?: boolean;
	articleNo: string;
	benamning: string;
	outPriceListA: string;
	customPrice?: string;
	calculatedCost: string;
	stock: string;
	reserved: string;
	available?: string;
	stockValue?: string;
	country?: string;
	status?: "active" | "inactive";
}

export interface PriceListOverviewRow {
	id: string;
	isFavorite: boolean;
	code: string;
	name: string;
	category: "Service" | "Privat" | "Övrigt" | string;
	linkedCount: number;
	createdBy: string;
	date: string;
	lastUpdated: string;
	status: "active" | "draft" | "expired" | "inactive";
}

export interface PriceListDetail extends PriceListOverviewRow {
	comment?: string;
	unit?: string;
	linkedCustomers: string[];
	linkedSuppliers: string[];
	articles: PriceListArticleItem[];
}

export interface CreatePriceListFormData {
	code: string;
	name: string;
	date: string;
	createdBy: string;
	comment?: string;
	category: string;
	unit: string;
	customer?: string;
	supplier?: string;
	selectedArticleIds: string[];
}

export interface GetPriceListsParams {
	page?: number;
	limit?: number;
	search?: string;
	category?: string;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface PriceListBulkUpdateData {
	baseCalculationOn: string;
	updatePriceListId: string;
	calculationType: "procent" | "index" | "sek";
	rounding: "2decimal" | "helkrona";
	direction: "increase" | "decrease";
	percentage: number;
	indexValue?: number;
	sekAmount?: number;
}

export interface GetPriceListsResponse {
	data: PriceListDetail[];
	total: number;
	page: number;
	totalPages: number;
}
