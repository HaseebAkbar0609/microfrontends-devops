import { API_PATH } from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult, ApiError } from "@/types/api";
import type {
	CustomerCategoriesListResponse,
	CustomerCategory,
} from "@/types/category";
import { normalizeCategory } from "./normalizeCategory";

export interface GetCustomerCategoriesListParams {
	page?: number;
	pageSize?: number;
	/** Server-side filter when supported */
	search?: string;
}

function buildCategoriesQuery(params?: GetCustomerCategoriesListParams): string {
	if (!params) return "";
	const q = new URLSearchParams();
	if (params.page != null && params.page > 0) {
		q.set("page", String(params.page));
	}
	if (params.pageSize != null && params.pageSize > 0) {
		q.set("page_size", String(params.pageSize));
	}
	if (params.search != null && String(params.search).trim() !== "") {
		q.set("search", String(params.search).trim());
	}
	const s = q.toString();
	return s ? `?${s}` : "";
}

/**
 * Customer-facing trade categories.
 * GET /api/v1/teams/customers/categories/list?page=&page_size=&search=
 */
export async function getCustomerCategoriesListAPIAction(
	params?: GetCustomerCategoriesListParams,
): Promise<ActionResult<CustomerCategory[]>> {
	try {
		const response = await axiosInstance.get<CustomerCategoriesListResponse>(
			`${API_PATH.TEAMS.CUSTOMER_CATEGORIES_LIST}${buildCategoriesQuery(params)}`,
		);

		const body = response.data;

		if (!body?.success || !Array.isArray(body.data)) {
			return {
				success: false,
				data: null,
				error: body?.message || "Failed to fetch categories",
			};
		}

		const categories = body.data
			.map((item) =>
				normalizeCategory(
					item && typeof item === "object"
						? (item as unknown as Record<string, unknown>)
						: {},
				),
			)
			.filter((c): c is CustomerCategory => c !== null);

		return { success: true, data: categories, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorMessage =
			apiError.response?.data?.message || "Failed to fetch categories";
		return { success: false, data: null, error: errorMessage };
	}
}
