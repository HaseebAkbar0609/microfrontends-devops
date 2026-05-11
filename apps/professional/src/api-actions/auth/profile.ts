import { API_PATH } from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult, ApiError, ApiResponse } from "@/types/api";

export type UserProfile = {
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  company: {
    id: string;
    company_name: string;
    company_category: string;
    organization_number: string;
  };
  company_user: {
    id: string;
    role: string;
    status: string;
  };
  subscription: {
    id: string;
    status: string;
    plan?: unknown;
  } | null;
};

/**
 * Fetch the current professional's profile.
 * GET /professionals/profile/me
 */
export async function getProfileAPIAction(): Promise<ActionResult<UserProfile>> {
  try {
    const response = await axiosInstance.get<ApiResponse<UserProfile>>(
      API_PATH.AUTH.GET_PROFILE
    );

    if (response.data?.data) {
      return { success: true, data: response.data.data, error: null };
    }

    return {
      success: false,
      data: null,
      error: response.data?.message || "Failed to fetch profile",
    };
  } catch (error: unknown) {
    const apiError = error as ApiError;
    const errorResponse = apiError.response?.data as
      | { message?: string }
      | undefined;
    return {
      success: false,
      data: null,
      error: errorResponse?.message || "An error occurred while fetching profile",
    };
  }
}
