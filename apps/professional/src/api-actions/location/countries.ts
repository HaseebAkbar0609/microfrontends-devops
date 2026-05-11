import { API_PATH } from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult, ApiError } from "@/types/api";
import { CountriesResponse, Country } from "@/types/location";

/**
 * Fetch all countries
 * GET /api/v1/location/countries
 */
export async function getCountriesAPIAction(): Promise<ActionResult<Country[]>> {
	try {
		const response = await axiosInstance.get<CountriesResponse>(
			API_PATH.LOCATION.COUNTRIES
		);

		if (response.data?.success) {
			return { success: true, data: response.data.data, error: null };
		}

		return {
			success: false,
			data: null,
			error: response.data?.message || "Failed to fetch countries",
		};
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorMessage = apiError.response?.data?.message || "Failed to fetch countries";
		return { success: false, data: null, error: errorMessage };
	}
}
