import { API_PATH } from "@/constants/api";
import { authMessages } from "@/constants/messages";
import { authStorage } from "@/lib/authStorage";
import axiosInstance from "@/lib/axiosInstance";
import { showToast } from "@/lib/toast";
import type { AuthAPIOptions, ActionResult, ApiError, ApiResponse, AuthResponseData } from "@/types/api";

const LOGIN_PATH = API_PATH.AUTH.LOGIN;

export type LoginAPIPayload = {
	email: string;
	password: string;
};


export async function loginAPIAction(
	payload: LoginAPIPayload,
	options?: AuthAPIOptions,
): Promise<ActionResult<AuthResponseData>> {
	try {
		const response = await axiosInstance.post<
			ApiResponse<AuthResponseData> | { data: AuthResponseData }
		>(LOGIN_PATH, payload);

		const apiData =
			"data" in response.data
				? (response.data.data as AuthResponseData)
				: (response.data as AuthResponseData);

		if (!apiData) {
			const errorMsg = authMessages.login.invalidResponse;
			showToast("error", errorMsg);
			return { success: false, data: null, error: errorMsg };
		}

		const accessToken = apiData.access_token ?? apiData.token;
		const refreshToken = apiData.refresh_token;
		const normalizedUser =
			apiData.user ??
			({
				id: apiData.id,
				email: apiData.email,
				first_name: apiData.first_name,
				last_name: apiData.last_name,
				status: apiData.status,
				user_profile: apiData.user_profile,
				last_visited_company: apiData.last_visited_company,
			} as AuthResponseData);

		const serverMessage = (response.data as { message?: string })?.message;

		if (!accessToken) {
			const errorMsg = serverMessage || authMessages.login.tokenNotReceived;
			showToast("error", errorMsg);
			return { success: false, data: null, error: errorMsg };
		}

		authStorage.setAuthData(accessToken);
		if (refreshToken) {
			authStorage.setRefreshToken(refreshToken);
		}
		authStorage.setUserData(normalizedUser);
		options?.setAccessToken?.(accessToken);
		options?.setUser?.(normalizedUser);
		showToast("success", authMessages.login.success);
		return { success: true, data: apiData, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorResponse = apiError.response?.data;

		const errorMessage = errorResponse?.message;

		if (errorResponse?.is_verified === false) {
			showToast("error", errorMessage || authMessages.login.failed);
			return {
				success: false,
				data: {
					is_verified: false,
					email: errorResponse.email || payload.email,
				} as AuthResponseData,
				error: errorMessage || authMessages.login.failed,
			};
		}

		if (errorMessage) {
			showToast("error", errorMessage);
			return { success: false, data: null, error: errorMessage };
		}

		showToast("error", authMessages.login.failed);
		return {
			success: false,
			data: null,
			error: authMessages.login.failed,
		};
	}
}
