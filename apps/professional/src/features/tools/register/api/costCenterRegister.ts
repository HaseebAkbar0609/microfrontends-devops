import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import {
	costCenterDetailSchema,
	type CostCenterRegisterRow,
	type CostCenterDetail,
	type GetCostCenterListParams,
	type GetCostCenterListResponse,
	type CreateCostCenterFormData,
} from "../types";

type ApiListEnvelope<T> = {
	data: T;
	total_items?: number;
	current_page?: number;
	page_size?: number;
	total_pages?: number;
};

const mapCostCenterFromApi = (item: Record<string, unknown>): CostCenterRegisterRow => ({
	id: String(item.id ?? ""),
	kod: String(item.kod ?? item.code ?? ""),
	benamning: String(item.benamning ?? item.name ?? ""),
	anteckningar: String(item.anteckningar ?? item.description ?? item.notes ?? ""),
	status: item.status === "inactive" ? "inactive" : "active",
});

export async function getCostCenterListAPIAction(
	params?: GetCostCenterListParams,
): Promise<GetCostCenterListResponse> {
	const queryParams: Record<string, string | number> = {};
	if (params?.page) queryParams.page = params.page;
	if (params?.limit) queryParams.limit = params.limit;
	if (params?.search) queryParams.search = params.search;
	if (params?.status && params.status !== "all") queryParams.status = params.status;
	if (params?.sortBy) queryParams.sort_by = params.sortBy;
	if (params?.sortOrder) queryParams.sort_order = params.sortOrder;

	const res = await axiosInstance.get<ApiListEnvelope<Record<string, unknown>[]>>(
		API_PATH.COST_CENTERS.LIST,
		{ params: queryParams },
	);
	const items = Array.isArray(res.data?.data) ? res.data.data : [];

	const total = res.data?.total_items ?? items.length;
	const backendPageSize = Number(res.data?.page_size);
	const limit = Number.isFinite(backendPageSize) && backendPageSize > 0
		? backendPageSize
		: (params?.limit && params.limit > 0 ? params.limit : 50);
	const effectiveLimit = Number.isFinite(limit) && limit > 0 ? limit : 50;

	return {
		data: items.map(mapCostCenterFromApi),
		total,
		page: res.data?.current_page ?? params?.page ?? 1,
		limit: effectiveLimit,
		totalPages: res.data?.total_pages ?? (Math.ceil(total / effectiveLimit) || 1),
	};
}

export async function createCostCenterAPIAction(
	data: CreateCostCenterFormData,
): Promise<{ success: boolean; data?: CostCenterRegisterRow; error?: string }> {
	try {
		const res = await axiosInstance.post(API_PATH.COST_CENTERS.CREATE, {
			kod: data.kod,
			benamning: data.benamning,
			anteckningar: data.anteckningar ?? "",
			status: data.status ?? "active",
		});

		return {
			success: true,
			data: res.data?.data ? mapCostCenterFromApi(res.data.data) : undefined,
		};
	} catch (error) {
		throw error;
	}
}

export async function deleteCostCenterAPIAction(id: string): Promise<boolean> {
	await axiosInstance.delete(API_PATH.COST_CENTERS.DELETE(id));
	return true;
}

export async function toggleCostCenterStatusAPIAction(
	ids: string[],
	targetStatus: "active" | "inactive",
): Promise<boolean> {
	await axiosInstance.post(API_PATH.COST_CENTERS.TOGGLE_STATUS, {
		ids,
		status: targetStatus,
	});
	return true;
}

export async function getCostCenterDetailAPIAction(
	id: string,
): Promise<CostCenterDetail | null> {
	try {
		const res = await axiosInstance.get(API_PATH.COST_CENTERS.GET(id));
		const data = res.data?.data;
		if (data) {
			const parsed = costCenterDetailSchema.safeParse({
				id: String(data.id ?? id),
				kod: String(data.kod ?? data.code ?? ""),
				benamning: String(data.benamning ?? data.name ?? ""),
				anteckningar: String(data.anteckningar ?? data.description ?? data.notes ?? ""),
				status: data.status === "inactive" ? "inactive" : "active",
				description: data.description ? String(data.description) : undefined,
				createdDate: data.created_at ? String(data.created_at) : undefined,
				lastUpdated: data.updated_at ? String(data.updated_at) : undefined,
			});
			if (parsed.success) {
				return parsed.data;
			}
		}
		return null;
	} catch (error) {
		throw error;
	}
}