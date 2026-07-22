import { API_PATH } from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult, ApiError, ApiResponse } from "@/types/api";

export interface CustomerSettingsData {
	language_preference: string;
	language_other?: string | null;
	notify_email: boolean;
	notify_sms: boolean;
	notify_web_push: boolean;
}

/**
 * Fetch signed-in customer settings / preferences.
 * GET /api/v1/customers/settings/me
 */
export async function getCustomerSettingsAPIAction(): Promise<
	ActionResult<CustomerSettingsData>
> {
	try {
		const response = await axiosInstance.get<
			ApiResponse<CustomerSettingsData> | CustomerSettingsData
		>(API_PATH.SETTINGS.ME);

		const data =
			"data" in response.data && response.data.data !== undefined
				? response.data.data
				: (response.data as CustomerSettingsData);

		return { success: true, data, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorMessage =
			apiError.response?.data?.message || "Failed to fetch settings";
		return { success: false, data: null, error: errorMessage };
	}
}
