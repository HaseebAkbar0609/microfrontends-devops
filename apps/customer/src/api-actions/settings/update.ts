import { API_PATH } from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult, ApiError, ApiResponse } from "@/types/api";
import type { CustomerSettingsData } from "./get";

export interface UpdateCustomerSettingsPayload {
	language_preference?: string;
	language_other?: string;
	notify_email?: boolean;
	notify_sms?: boolean;
	notify_web_push?: boolean;
}

/**
 * Persist updated customer settings / preferences.
 * PATCH /api/v1/customers/settings/me
 */
export async function updateCustomerSettingsAPIAction(
	payload: UpdateCustomerSettingsPayload,
): Promise<ActionResult<CustomerSettingsData>> {
	try {
		const response = await axiosInstance.patch<
			ApiResponse<CustomerSettingsData> | CustomerSettingsData
		>(API_PATH.SETTINGS.ME, payload);

		const data =
			"data" in response.data && response.data.data !== undefined
				? response.data.data
				: (response.data as CustomerSettingsData);

		return { success: true, data, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorMessage =
			apiError.response?.data?.message || "Failed to update settings";
		return { success: false, data: null, error: errorMessage };
	}
}
