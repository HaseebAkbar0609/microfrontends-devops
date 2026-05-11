import { API_PATH } from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult, ApiError } from "@/types/api";
import type {
	CustomerCategoriesListResponse,
	CustomerCategory,
} from "@/types/category";
import { normalizeCategory } from "./normalizeCategory";

/**
 * Professional subcategories for offers / invitations.
 * GET /api/v1/teams/professionals/subcategories/list
 */
export async function getProfessionalsSubcategoriesListAPIAction(): Promise<
	ActionResult<CustomerCategory[]>
> {
	try {
		const response = await axiosInstance.get<CustomerCategoriesListResponse>(
			API_PATH.TEAMS.PROFESSIONALS_SUBCATEGORIES_LIST,
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
