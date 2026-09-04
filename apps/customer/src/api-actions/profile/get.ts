import { API_PATH } from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult, ApiError, ApiResponse } from "@/types/api";

export interface CustomerProfileData {
	id: string;
	email: string;
	first_name?: string | null;
	last_name?: string | null;
	user_type?: string | null;
	status?: string | null;
	phone_number?: string | null;
	postal_code?: string | null;
	address?: string | null;
	city_id?: string | null;
	city_name?: string | null;
	country_id?: string | null;
	country_name?: string | null;
	personal_id?: string | null;
	profile_picture_media_id?: string | null;
	profile_picture_url?: string | null;
	created_at?: number | string | null;
	created_by?: string | null;
	permissions?: {
		viewProjects?: boolean;
		createProjects?: boolean;
		editProjects?: boolean;
		viewOffers?: boolean;
		approveOffers?: boolean;
		manageUsers?: boolean;
	} | null;
}

/**
 * Fetch signed-in customer profile details.
 * GET /api/v1/customers/profile/me
 */
export async function getCustomerProfileAPIAction(): Promise<
	ActionResult<CustomerProfileData>
> {
	try {
		const response = await axiosInstance.get<
			ApiResponse<CustomerProfileData> | CustomerProfileData
		>(API_PATH.PROFILE.ME);

		const data =
			"data" in response.data && response.data.data !== undefined
				? response.data.data
				: (response.data as CustomerProfileData);

		return { success: true, data, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorMessage =
			apiError.response?.data?.message || "Failed to fetch profile details";
		return { success: false, data: null, error: errorMessage };
	}
}
