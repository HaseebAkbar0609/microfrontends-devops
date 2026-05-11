import { API_PATH } from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import { authStorage } from "@/lib/authStorage";
import type {
	ActionResult,
	AuthAPIOptions,
	ApiError,
	AuthResponseData,
	ApiResponse,
	AuthUserInfo,
} from "@/types/api";
import { authMessages } from "@/constants/messages";
import { showToast } from "@/lib/toast";

const REGISTER_PATH = API_PATH.AUTH.REGISTER;
const VERIFY_EMAIL_PATH = API_PATH.AUTH.VERIFY_EMAIL;

export type RegisterAPIPayload = {
	email: string;
	password: string;
	first_name: string;
	last_name: string;
	phone_number: string;
	postal_code: string;
	country: string;
	city: string;
	address: string;
};

export type VerifyEmailAPIPayload = {
	email: string;
	otp_code: string;
};


/**
 * Register a new customer.
 * POST api/v1/customers/auth/register
 */
export async function registerAPIAction(
	payload: RegisterAPIPayload,
	options?: AuthAPIOptions,
): Promise<ActionResult<AuthResponseData>> {
	try {
		const response = await axiosInstance.post<
			ApiResponse<AuthResponseData> | { data: AuthResponseData }
		>(REGISTER_PATH, payload);

		const apiData =
			"data" in response.data
				? (response.data.data as AuthResponseData)
				: (response.data as AuthResponseData);

		if (!apiData) {
			const errorMsg = authMessages.register.invalidResponse;
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

		if (accessToken) {
			authStorage.setAuthData(accessToken);
			options?.setAccessToken?.(accessToken);
		}
		if (refreshToken) {
			authStorage.setRefreshToken(refreshToken);
		}
		if (user.id) {
			authStorage.setUserData(user);
			options?.setUser?.(user);
		}

		showToast("success", authMessages.register.success);
		return { success: true, data: apiData, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorResponse = apiError.response?.data;
		const errorMessage = errorResponse?.message;

		if (errorMessage) {
			showToast("error", errorMessage);
			return { success: false, data: null, error: errorMessage };
		}

		showToast("error", authMessages.register.failed);
		return {
			success: false,
			data: null,
			error: authMessages.register.failed,
		};
	}
}


/**
 * Verify email OTP
 * POST api/v1/customers/auth/verify-email
 */
export async function verifyEmailAction(
	payload: VerifyEmailAPIPayload,
	options?: AuthAPIOptions,
): Promise<ActionResult<AuthResponseData>> {
	try {
		const response = await axiosInstance.post<
			ApiResponse<AuthResponseData> | { data: AuthResponseData }
		>(VERIFY_EMAIL_PATH, payload);

		const apiData =
			"data" in response.data
				? (response.data.data as AuthResponseData)
				: (response.data as AuthResponseData);

		if (!apiData) {
			const errorMsg = authMessages.register.invalidResponse;
			showToast("error", errorMsg);
			return { success: false, data: null, error: errorMsg };
		}

		const tokens = apiData as AuthResponseData & {
			accessToken?: string;
			refreshToken?: string;
		};
		const accessToken =
			tokens.access_token ?? tokens.token ?? tokens.accessToken;
		const refreshToken = tokens.refresh_token ?? tokens.refreshToken;

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
			const errorMsg = serverMessage || authMessages.verifyEmail.failed;
			showToast("error", errorMsg);
			return { success: false, data: null, error: errorMsg };
		}

		authStorage.setAuthData(accessToken);
		if (refreshToken) {
			authStorage.setRefreshToken(refreshToken);
		}
		if (user.id) {
			authStorage.setUserData(user);
			options?.setUser?.(user);
		}
		options?.setAccessToken?.(accessToken);

		showToast("success", serverMessage ?? authMessages.verifyEmail.success);
		return { success: true, data: apiData, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorResponse = apiError.response?.data;
		const errorMessage = errorResponse?.message;

		if (errorMessage) {
			showToast("error", errorMessage);
			return { success: false, data: null, error: errorMessage };
		}

		showToast("error", authMessages.verifyEmail.failed);
		return {
			success: false,
			data: null,
			error: authMessages.verifyEmail.failed,
		};
	}
}
