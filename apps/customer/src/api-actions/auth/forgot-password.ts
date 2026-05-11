import { API_PATH, getErrorMessageByCode } from "@/constants/api";
import { authMessages } from "@/constants/messages";
import { authStorage } from "@/lib/authStorage";
import axiosInstance from "@/lib/axiosInstance";
import { showToast } from "@/lib/toast";
import type {
	ActionResult,
	AuthAPIOptions,
	ApiError,
	AuthResponseData,
	ApiResponse,
	AuthUserInfo,
} from "@/types/api";

const FORGOT_PASSWORD_PATH = API_PATH.AUTH.FORGOT_PASSWORD;
const VALIDATE_OTP_PATH = API_PATH.AUTH.VALIDATE_OTP;
const RESET_PASSWORD_PATH = API_PATH.AUTH.RESET_PASSWORD;

export type ForgotPasswordAPIPayload = {
	email: string;
};

export type ForgotPasswordAPIResponse = {
	message?: string;
	data?: unknown;
};

export type ResetPasswordAPIPayload = {
	email: string;
	otp_code: string;
	password: string;
};

export type ValidateOTPAPIPayload = {
	email: string;
	otp_code: string;
	otp_type: "forgot_password" | "verify_email";
};

export type ValidateOTPAPIResponse = {
	message?: string;
	data?: AuthResponseData;
};

/**
 * Request password reset email for customer account.
 * POST /api/v1/customers/auth/forgot-password
 */
export async function forgotPasswordAPIAction(
	payload: ForgotPasswordAPIPayload,
	options?: AuthAPIOptions,
): Promise<ActionResult<AuthResponseData>> {
	try {
		const response = await axiosInstance.post<
			ApiResponse<AuthResponseData>
		>(FORGOT_PASSWORD_PATH, payload);

		const serverMessage =
			typeof response.data?.message === "string"
				? response.data.message
				: undefined;

		const apiData = response.data.data;
		const accessToken = apiData?.access_token || apiData?.token;

		if (accessToken) {
			authStorage.setAuthData(accessToken);
			options?.setAccessToken?.(accessToken);
		}

		showToast(
			"success",
			serverMessage ?? authMessages.forgotPassword.success,
		);
		return { success: true, data: apiData, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorResponse = apiError.response?.data as
			| { code?: string; message?: string }
			| undefined;
		const errorCode = errorResponse?.code;
		const errorMessage = errorResponse?.message;

		if (errorCode) {
			const msg = getErrorMessageByCode(String(errorCode));
			showToast("error", msg);
			return { success: false, data: null, error: msg, errorCode };
		}

		if (errorMessage) {
			showToast("error", errorMessage);
			return { success: false, data: null, error: errorMessage };
		}

		showToast("error", authMessages.forgotPassword.failed);
		return {
			success: false,
			data: null,
			error: authMessages.forgotPassword.failed,
		};
	}
}

/**
 * Validate OTP
 * POST /auth/validate-otp
 */
export async function validateOTPAction(
	payload: ValidateOTPAPIPayload,
	options?: AuthAPIOptions,
): Promise<ActionResult<ValidateOTPAPIResponse>> {
	try {
		const response = await axiosInstance.post<ValidateOTPAPIResponse>(
			VALIDATE_OTP_PATH,
			payload,
		);

		const apiData = response.data.data;
		const accessToken = apiData?.access_token || apiData?.token;

		if (accessToken) {
			authStorage.setAuthData(accessToken);
			options?.setAccessToken?.(accessToken);
		}

		if (apiData) {
			const user: AuthUserInfo = {
				id: apiData.id,
				email: apiData.email,
				first_name: apiData.first_name,
				last_name: apiData.last_name,
				user_profile: apiData.user_profile,
				is_active: apiData.is_active,
				status: apiData.status,
			};
			if (user.id) {
				authStorage.setUserData(user);
				options?.setUser?.(user);
			}
		}

		showToast("success", authMessages.validateOTP.success);
		return { success: true, data: response.data ?? {}, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorResponse = apiError.response?.data as
			| { code?: string; message?: string }
			| undefined;

		const errorCode = errorResponse?.code;
		const errorMessage = errorResponse?.message;

		if (errorCode) {
			const msg = getErrorMessageByCode(String(errorCode));
			showToast("error", msg);
			return { success: false, data: null, error: msg, errorCode };
		}

		if (errorMessage) {
			showToast("error", errorMessage);
			return { success: false, data: null, error: errorMessage };
		}

		showToast("error", authMessages.validateOTP.failed);
		return {
			success: false,
			data: null,
			error: authMessages.validateOTP.failed,
		};
	}
}

/**
 * Reset password
 * POST /auth/reset-password
 */
export async function resetPasswordAction(
	payload: ResetPasswordAPIPayload,
): Promise<ActionResult<ApiResponse<unknown>>> {
	try {
		const response = await axiosInstance.post<ApiResponse<unknown>>(
			RESET_PASSWORD_PATH,
			payload,
		);

		const serverMessage =
			typeof response.data?.message === "string"
				? response.data.message
				: undefined;

		showToast(
			"success",
			serverMessage ?? authMessages.resetPassword.success,
		);
		return { success: true, data: response.data, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorResponse = apiError.response?.data as
			| { code?: string; message?: string }
			| undefined;

		const errorCode = errorResponse?.code;
		const errorMessage = errorResponse?.message;

		if (errorCode) {
			const msg = getErrorMessageByCode(String(errorCode));
			showToast("error", msg);
			return { success: false, data: null, error: msg, errorCode };
		}

		if (errorMessage) {
			showToast("error", errorMessage);
			return { success: false, data: null, error: errorMessage };
		}

		showToast("error", authMessages.resetPassword.failed);
		return {
			success: false,
			data: null,
			error: authMessages.resetPassword.failed,
		};
	}
}
