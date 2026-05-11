import { API_PATH, getErrorMessageByCode } from "@/constants/api";
import { authMessages } from "@/constants/messages";
import { authStorage } from "@/lib/authStorage";
import {
	coerceRequiresSubscription,
	setRequiresSubscriptionCookie,
} from "@/lib/requiresSubscriptionCookie";
import axiosInstance from "@/lib/axiosInstance";
import { showToast } from "@/lib/toast";
import type { ActionResult, ApiError } from "@/types/api";

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
	company_name: string;
	organisation_number: string;
	company_category: string;
};

export type RegisterAPIResponse = {
	message?: string;
	data?: unknown;
};

export type VerifyEmailAPIPayload = {
	email: string;
	otp_code: string;
};

export type VerifyEmailAPIResponse = {
	last_visited_company?: unknown;
	email?: string;
	first_name?: string;
	last_name?: string;
	access_token?: string;
	accessToken?: string;
	refresh_token?: string;
	refreshToken?: string;
	user_profile?: unknown;
	userProfile?: unknown;
	user?: unknown;
	message?: string;
	requires_subscription?: string | boolean;
};

/**
 * Register a new account.
 * POST /auth/register
 */
export async function registerAPIAction(
	payload: RegisterAPIPayload,
): Promise<ActionResult<RegisterAPIResponse>> {
	try {
		const response = await axiosInstance.post<RegisterAPIResponse>(
			REGISTER_PATH,
			payload,
		);

		if (response.data) {
			showToast("success", authMessages.register.success);
			return { success: true, data: response.data, error: null };
		}

		showToast("error", authMessages.register.invalidResponse);
		return {
			success: false,
			data: null,
			error: authMessages.register.invalidResponse,
		};
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
 * POST /auth/verify-email
 */
export async function verifyEmailAction(
	payload: VerifyEmailAPIPayload,
): Promise<ActionResult<VerifyEmailAPIResponse>> {
	try {
		const response = await axiosInstance.post<VerifyEmailAPIResponse>(
			VERIFY_EMAIL_PATH,
			payload,
		);

		const serverMessage =
			typeof response.data?.message === "string"
				? response.data.message
				: undefined;

		const apiData: VerifyEmailAPIResponse =
			"data" in response.data
				? (response.data.data as VerifyEmailAPIResponse)
				: (response.data as unknown as VerifyEmailAPIResponse);

		if (!apiData) {
			const errorMsg = authMessages.register.invalidResponse;
			showToast("error", errorMsg);
			return { success: false, data: null, error: errorMsg };
		}

		const accessToken = apiData.accessToken ?? apiData.access_token;
		const refreshToken = apiData.refreshToken ?? apiData.refresh_token;
		const user = apiData.user_profile ?? apiData.user ?? {};
		const company = apiData.last_visited_company;
		const userData = {
			...user,
			email: apiData.email,
			first_name: apiData.first_name,
			last_name: apiData.last_name,
		};

		if (accessToken) authStorage.setAuthData(accessToken);
		if (refreshToken) authStorage.setRefreshToken(refreshToken);
		if (user !== undefined) authStorage.setUserData(userData);
		if (company !== undefined) authStorage.setCompanyData(company);

		setRequiresSubscriptionCookie(
			coerceRequiresSubscription(apiData.requires_subscription),
		);

		showToast("success", serverMessage ?? authMessages.verifyEmail.success);
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

		showToast("error", authMessages.verifyEmail.failed);
		return {
			success: false,
			data: null,
			error: authMessages.verifyEmail.failed,
		};
	}
}
