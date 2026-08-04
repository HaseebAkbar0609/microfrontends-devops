import axiosInstance from "@/lib/axiosInstance";
import {
	budgetRegisterRowSchema,
	type BudgetRegisterRow,
	type GetBudgetListParams,
	type GetBudgetListResponse,
} from "../types";
import { MOCK_BUDGET_DATA } from "../mockdata/budgets";
import { z } from "zod";

// Add API endpoint in local structure if not in API_PATH yet
const BUDGET_API_PATH = {
	LIST: "/api/v1/professionals/budgets",
	TOGGLE_STATUS: "/api/v1/professionals/budgets/toggle-status",
};

export async function getBudgetListAPIAction(
	params?: GetBudgetListParams,
): Promise<GetBudgetListResponse> {
	try {
		const res = await axiosInstance.get(BUDGET_API_PATH.LIST, {
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
			const validated = z.array(budgetRegisterRowSchema).safeParse(
				items.map((item: Record<string, unknown>) => ({
					id: String(item.id ?? ""),
					budgetnr: String(item.budgetnr ?? item.budget_nr ?? ""),
					budgetName: String(item.budgetName ?? item.name ?? ""),
					datum: String(item.datum ?? item.date ?? ""),
					totalKostnad: String(item.totalKostnad ?? item.total_cost ?? ""),
					totalInkomst: String(item.totalInkomst ?? item.total_income ?? ""),
					status: item.status === "inactive" ? "inactive" : "active",
					isFavorite: Boolean(item.isFavorite ?? item.is_favorite ?? false),
				})),
			);

			if (validated.success) {
				return {
					data: validated.data,
					total: res.data?.data?.total ?? items.length,
					page: res.data?.data?.page ?? params?.page ?? 1,
					limit: res.data?.data?.limit ?? params?.limit ?? 50,
					totalPages: res.data?.data?.totalPages ?? 1,
				};
			}
		}
	} catch (error) {
		if (process.env.NODE_ENV !== "development") {
			throw error;
		}
	}

	// Local development mock fallback
	if (process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_USE_MOCK === "true") {
		const page = Math.max(1, params?.page ?? 1);
		const limit = Math.max(1, params?.limit ?? 50);
		const search = params?.search?.toLowerCase().trim();
		const statusFilter = params?.status?.toLowerCase().trim();

		let filtered = [...MOCK_BUDGET_DATA];

		if (search) {
			filtered = filtered.filter(
				(item) =>
					item.budgetnr.toLowerCase().includes(search) ||
					item.budgetName.toLowerCase().includes(search) ||
					item.datum.toLowerCase().includes(search),
			);
		}

		if (statusFilter && statusFilter !== "all") {
			filtered = filtered.filter((item) => item.status.toLowerCase() === statusFilter);
		}

		if (params?.sortBy) {
			const field = params.sortBy as keyof BudgetRegisterRow;
			const order = params.sortOrder === "desc" ? -1 : 1;

			filtered.sort((a, b) => {
				const aVal = a[field as keyof typeof a];
				const bVal = b[field as keyof typeof b];

				if (typeof aVal === "boolean" && typeof bVal === "boolean") {
					return ((aVal ? 1 : 0) - (bVal ? 1 : 0)) * order;
				}

				if (field === "budgetnr" || field === "totalKostnad") {
					const numA = parseFloat(String(aVal).replace(/\s/g, "")) || 0;
					const numB = parseFloat(String(bVal).replace(/\s/g, "")) || 0;
					return (numA - numB) * order;
				}

				return String(aVal).localeCompare(String(bVal)) * order;
			});
		}

		const total = filtered.length;
		const totalPages = Math.ceil(total / limit) || 1;
		const startIndex = (page - 1) * limit;
		const paginatedData = filtered.slice(startIndex, startIndex + limit);

		return { data: paginatedData, total, page, limit, totalPages };
	}

	return { data: [], total: 0, page: 1, limit: 50, totalPages: 1 };
}

export async function toggleBudgetStatusAPIAction(
	ids: string[],
	targetStatus: "active" | "inactive",
): Promise<boolean> {
	try {
		await axiosInstance.post(BUDGET_API_PATH.TOGGLE_STATUS, {
			ids,
			status: targetStatus,
		});
		return true;
	} catch (error) {
		if (process.env.NODE_ENV !== "development") {
			throw error;
		}
		// Local development mock implementation
		MOCK_BUDGET_DATA.forEach((item) => {
			if (ids.includes(item.id)) {
				item.status = targetStatus;
			}
		});
		return true;
	}
}

export async function toggleBudgetFavoriteAPIAction(
	id: string,
	isFavorite: boolean,
): Promise<boolean> {
	try {
		await axiosInstance.post(`/api/v1/professionals/budgets/${id}/favorite`, {
			isFavorite,
		});
		return true;
	} catch (error) {
		if (process.env.NODE_ENV !== "development") {
			throw error;
		}
		// Local development mock implementation
		const found = MOCK_BUDGET_DATA.find((item) => item.id === id);
		if (found) {
			found.isFavorite = isFavorite;
		}
		return true;
	}
}
