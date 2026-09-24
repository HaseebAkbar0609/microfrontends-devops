export type SupplierStatus = "active" | "inactive" | "prospect";

export interface SupplierOverviewRow {
	id: string;
	levNr: string;
	name: string;
	orgNo: string;
	address: string;
	postNr: string;
	city: string;
	country: string;
	phone: string;
	email: string;
	status: SupplierStatus;
	dateAdded?: string;
}

export interface GetSupplierOverviewListParams {
	page?: number;
	limit?: number;
	search?: string;
	status?: "all" | SupplierStatus;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface GetSupplierOverviewListResponse {
	data: SupplierOverviewRow[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}
