import { t } from "i18next";
import { API_PATH } from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult, ApiError } from "@/types/api";
import type {
	CustomerCategoriesListResponse,
	CustomerCategory,
} from "@/types/category";
import localizationConstants from "@/utils/translation/constants";
import { normalizeCategory } from "./normalizeCategory";

/** The endpoint defaults to 10 items per page, so ask for more and follow total_pages. */
const SUBCATEGORIES_PAGE_SIZE = 100;

/**
 * All professional subcategories for offers / invitations / suppliers.
 * GET /api/v1/teams/professionals/subcategories/list?page=&page_size=
 */
export async function getProfessionalsSubcategoriesListAPIAction(): Promise<
	ActionResult<CustomerCategory[]>
> {
	try {
		const items: CustomerCategory[] = [];
		let page = 1;
		let totalPages = 1;

		while (page <= totalPages) {
			const response = await axiosInstance.get<CustomerCategoriesListResponse>(
				API_PATH.TEAMS.PROFESSIONALS_SUBCATEGORIES_LIST,
				{ params: { page, page_size: SUBCATEGORIES_PAGE_SIZE } },
			);

			const body = response.data;

			if (!body?.success || !Array.isArray(body.data)) {
				return {
					success: false,
					data: null,
					error: body?.message || t(localizationConstants.categoriesLoadFailed),
				};
			}

			if (body.data.length === 0) break;
			items.push(...body.data);
			// No total_pages means an unpaginated response: stop after this page.
			totalPages = body.total_pages ?? page;
			page++;
		}

		const categories = items
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
			apiError.response?.data?.message ||
			t(localizationConstants.categoriesLoadFailed);
		return { success: false, data: null, error: errorMessage };
	}
}
