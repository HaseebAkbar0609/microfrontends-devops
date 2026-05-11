import { API_PATH } from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult, ApiError } from "@/types/api";
import type { CitiesResponse } from "@/types/location";

export interface GetCitiesParams {
	countryId: string;
	page?: number;
	pageSize?: number;
	/** Server-side filter (query param `search`) */
	search?: string;
}

/**
 * Fetch cities by country
 * GET /api/v1/location/cities?page_size={pageSize}&page={page}&country_id={countryId}&search={search}
 */
export async function getCitiesAPIAction(
	params: GetCitiesParams,
): Promise<ActionResult<CitiesResponse>> {
	try {
		const { countryId, page = 1, pageSize = 50, search } = params;
		const searchParam =
			search != null && String(search).trim() !== ""
				? `&search=${encodeURIComponent(String(search).trim())}`
				: "";
		const response = await axiosInstance.get<CitiesResponse>(
			`${API_PATH.LOCATION.CITIES}?page_size=${pageSize}&page=${page}&country_id=${countryId}${searchParam}`,
		);

		if (response.data?.success) {
			return { success: true, data: response.data, error: null };
		}

		return {
			success: false,
			data: null,
			error: response.data?.message || "Failed to fetch cities",
		};
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorMessage =
			apiError.response?.data?.message || "Failed to fetch cities";
		return { success: false, data: null, error: errorMessage };
	}
}
