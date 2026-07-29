import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import type {
	CostCenterRegisterRow,
	GetCostCenterListParams,
	GetCostCenterListResponse,
} from "../types";
import { MOCK_COST_CENTER_DATA } from "../mockdata/costCenters";

export async function getCostCenterListAPIAction(
	params?: GetCostCenterListParams,
): Promise<GetCostCenterListResponse> {
	try {
		const res = await axiosInstance.get(API_PATH.COST_CENTERS.LIST, {
			params: {
				page: params?.page ?? 1,
				limit: params?.limit ?? 50,
				search: params?.search,
				status: params?.status,
				sort_by: params?.sortBy,
				sort_order: params?.sortOrder,
			},
		});

		const data = res.data?.data;
		const items = Array.isArray(data) ? data : data?.items ?? [];

		if (items.length > 0) {
			const formattedData: CostCenterRegisterRow[] = items.map((item: Record<string, unknown>) => ({
				id: String(item.id ?? ""),
				kod: String(item.kod ?? item.code ?? ""),
				benamning: String(item.benamning ?? item.name ?? ""),
				anteckningar: String(item.anteckningar ?? item.description ?? item.notes ?? ""),
				status: (item.status as "active" | "inactive") ?? "active",
			}));

			return {
				data: formattedData,
				total: res.data?.data?.total ?? items.length,
				page: res.data?.data?.page ?? params?.page ?? 1,
				limit: res.data?.data?.limit ?? params?.limit ?? 50,
				totalPages: res.data?.data?.totalPages ?? 1,
			};
		}
	} catch (error) {
		if (process.env.NODE_ENV !== "production") {
			const sanitizedMessage = error instanceof Error ? error.message : String(error);
			console.warn("[getCostCenterListAPIAction] API request failed, falling back to mock data:", sanitizedMessage);
		}
		// TODO: Remove mock fallback once BE is ready
	}

	const page = Math.max(1, params?.page ?? 1);
	const limit = Math.max(1, params?.limit ?? 50);
	const search = params?.search?.toLowerCase().trim();
	const statusFilter = params?.status?.toLowerCase().trim();

	let filtered = [...MOCK_COST_CENTER_DATA];

	if (search) {
		filtered = filtered.filter(
			(item) =>
				item.kod.toLowerCase().includes(search) ||
				item.benamning.toLowerCase().includes(search) ||
				item.anteckningar.toLowerCase().includes(search),
		);
	}

	if (statusFilter && statusFilter !== "all") {
		filtered = filtered.filter((item) => item.status.toLowerCase() === statusFilter);
	}

	const total = filtered.length;
	const totalPages = Math.ceil(total / limit) || 1;
	const startIndex = (page - 1) * limit;
	const paginatedData = filtered.slice(startIndex, startIndex + limit);

	return { data: paginatedData, total, page, limit, totalPages };
}

export async function deleteCostCenterAPIAction(id: string): Promise<boolean> {
	try {
		await axiosInstance.delete(API_PATH.COST_CENTERS.DELETE(id));
		return true;
	} catch (error) {
		if (process.env.NODE_ENV !== "production") {
			const sanitizedMessage = error instanceof Error ? error.message : String(error);
			console.warn("[deleteCostCenterAPIAction] API request failed:", sanitizedMessage);
		}
		return true;
	}
}

export async function toggleCostCenterStatusAPIAction(
	ids: string[],
	targetStatus: "active" | "inactive",
): Promise<boolean> {
	try {
		await axiosInstance.post(API_PATH.COST_CENTERS.TOGGLE_STATUS, {
			ids,
			status: targetStatus,
		});
		return true;
	} catch (error) {
		if (process.env.NODE_ENV !== "production") {
			const sanitizedMessage = error instanceof Error ? error.message : String(error);
			console.warn("[toggleCostCenterStatusAPIAction] API request failed:", sanitizedMessage);
		}
		return true;
	}
}
