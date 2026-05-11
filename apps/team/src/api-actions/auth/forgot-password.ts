import { API_PATH, getErrorMessageByCode } from "@/constants/api";
import { authMessages } from "@/constants/messages";
import { authStorage } from "@/lib/authStorage";
import axiosInstance from "@/lib/axiosInstance";
import { OTP_TYPE } from "@/constants/constant";
import { showToast } from "@/lib/toast";
import type { ActionResult, AuthAPIOptions, ApiError, AuthResponseData, ApiResponse } from "@/types/api";

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
export type ValidateOTPAPIPayload = {
	email: string;
	otp_code: string;
	otp?: string;
	otp_type?: (typeof OTP_TYPE)[keyof typeof OTP_TYPE];
};

export type ResetPasswordAPIPayload = {
	email: string;
	otp_code: string;
	otp?: string;
	password: string;
	new_password?: string;
	otp_type?: (typeof OTP_TYPE)[keyof typeof OTP_TYPE];
};


export async function forgotPasswordAPIAction(
	payload: ForgotPasswordAPIPayload,
): Promise<ActionResult<AuthResponseData>> {
	try {
		const response = await axiosInstance.post<ApiResponse<AuthResponseData>>(
			FORGOT_PASSWORD_PATH,
			payload,
		);

		const serverMessage =
			typeof response.data?.message === "string"
				? response.data.message
				: undefined;

		const apiData = response.data.data;
		const accessToken = apiData?.access_token || apiData?.token;

		if (accessToken) {
			authStorage.setAuthData(accessToken);
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
): Promise<ActionResult<AuthResponseData>> {
	const payloadWithFallback: ValidateOTPAPIPayload = {
		...payload,
		otp: payload.otp ?? payload.otp_code,
		otp_type: payload.otp_type ?? OTP_TYPE.FORGOT_PASSWORD,
	};

	try {
		const response = await axiosInstance.post<ApiResponse<AuthResponseData>>(
			VALIDATE_OTP_PATH,
			payloadWithFallback,
		);
		const apiData = response.data.data;
		const accessToken = apiData?.access_token || apiData?.token;

		if (accessToken) {
			authStorage.setAuthData(accessToken);
			options?.setAccessToken?.(accessToken);
		}
		const user = apiData?.user;
		if (user) {
			authStorage.setUserData(user);
			options?.setUser?.(user);
		}

		showToast("success", authMessages.validateOTP.success);
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
		const payloadWithFallback = {
			...payload,
			otp: payload.otp ?? payload.otp_code,
			new_password: payload.new_password ?? payload.password,
			otp_type: payload.otp_type ?? OTP_TYPE.FORGOT_PASSWORD,
		};
		const response = await axiosInstance.post<ApiResponse<unknown>>(
			RESET_PASSWORD_PATH,
			payloadWithFallback,
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
