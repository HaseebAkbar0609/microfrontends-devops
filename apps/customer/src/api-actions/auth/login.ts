import { API_PATH } from "@/constants/api";
import { authMessages } from "@/constants/messages";
import { authStorage } from "@/lib/authStorage";
import axiosInstance from "@/lib/axiosInstance";
import { showToast } from "@/lib/toast";
import type { AuthAPIOptions, ActionResult, ApiError, ApiResponse, AuthResponseData, AuthUserInfo } from "@/types/api";

const LOGIN_PATH = API_PATH.AUTH.LOGIN;

export type LoginAPIPayload = {
	email: string;
	password: string;
};

/** Login API body — accessToken, token, or access_token. */
/**
 * Authenticate user with email and password.
 * POST api/v1/customers/auth/login
 * Optionally updates auth context via setAccessToken/setUser when provided.
 */
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

		const user: AuthUserInfo = {
			id: apiData.id,
			email: apiData.email,
			first_name: apiData.first_name,
			last_name: apiData.last_name,
			is_active: apiData.is_active,
			status: apiData.status,
			user_profile: apiData.user_profile,
		};

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
		if (user.id) {
			authStorage.setUserData(user);
		}
		options?.setAccessToken?.(accessToken);
		if (user.id) options?.setUser?.(user);
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
