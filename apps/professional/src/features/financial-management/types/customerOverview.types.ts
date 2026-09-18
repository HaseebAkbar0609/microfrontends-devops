export type CustomerStatus = "active" | "inactive" | "prospect";

export interface CustomerOverviewRow {
	id: string;
	customerNo: string;
	name: string;
	orgNo: string;
	address: string;
	postNr: string;
	city: string;
	country: string;
	phone: string;
	email: string;
	status: CustomerStatus;
	dateAdded?: string;
}

export interface GetCustomerOverviewListParams {
	page?: number;
	limit?: number;
	search?: string;
	status?: "all" | CustomerStatus;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface GetCustomerOverviewListResponse {
	data: CustomerOverviewRow[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}
