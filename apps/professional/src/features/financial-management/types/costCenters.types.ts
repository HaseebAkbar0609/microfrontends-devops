export type CostCenterStatus = "active" | "inactive";

export interface CostCenterItem {
	id: string;
	kod: string;
	benamning: string;
	anteckningar: string;
	status: CostCenterStatus;
	createdAt?: string;
	updatedAt?: string;
}

export interface CreateCostCenterFormData {
	kod: string;
	benamning: string;
	anteckningar: string;
	status?: CostCenterStatus;
}

export interface CostCenterQueryParams {
	page?: number;
	limit?: number;
	search?: string;
	status?: string;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface CostCenterListResponse {
	data: CostCenterItem[];
	total: number;
	page: number;
	limit: number;
}
