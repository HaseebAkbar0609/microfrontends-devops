import { API_PATH } from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult, ApiError, ApiResponse } from "@/types/api";
import type { CustomerProfileData } from "./get";

export interface UpdateCustomerProfilePayload {
	first_name?: string;
	last_name?: string;
	phone_number?: string;
	postal_code?: string;
	address?: string;
	city_id?: string;
	city_name?: string;
	country_id?: string;
	personal_id?: string;
	profile_picture_media_id?: string;
	status?: "active" | "inactive" | "pending";
}

/**
 * Update editable fields of signed-in customer profile.
 * PATCH /api/v1/customers/profile/me
 */
export async function updateCustomerProfileAPIAction(
	payload: UpdateCustomerProfilePayload,
): Promise<ActionResult<CustomerProfileData>> {
	try {
		const response = await axiosInstance.patch<
			ApiResponse<CustomerProfileData> | { data: CustomerProfileData }
		>(API_PATH.PROFILE.ME, payload);

		const data =
			"data" in response.data ? response.data.data : response.data;

		return { success: true, data, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorMessage =
			apiError.response?.data?.message || "Failed to update profile";
		return { success: false, data: null, error: errorMessage };
	}
}
