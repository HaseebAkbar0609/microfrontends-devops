import { API_PATH, getErrorMessageByCode } from "@/constants/api";
import { authMessages } from "@/constants/messages";
import { authStorage } from "@/lib/authStorage";
import {
	coerceRequiresSubscription,
	setRequiresSubscriptionCookie,
} from "@/lib/requiresSubscriptionCookie";
import axiosInstance from "@/lib/axiosInstance";
import { showToast } from "@/lib/toast";
import type { ActionResult, ApiError, ApiResponse } from "@/types/api";

const LOGIN_PATH = API_PATH.AUTH.LOGIN;
const HANDOFF_REDEEM_PATH = API_PATH.AUTH.HANDOFF_REDEEM;

export type LoginAPIPayload = {
	email: string;
	password: string;
};

type UserInfo = {
	id: string;
	phone_number: string;
	postal_code: string;
	country: string;
	city: string;
};

/** Login API body — supports access_token / token; and refresh_token. */
export type LoginPayloadData = {
	id?: string;
	email?: string;
	first_name?: string;
	last_name?: string;
	is_active?: boolean;
	accessToken?: string;
	refreshToken?: string;
	access_token?: string;
	token?: string;
	refresh_token?: string;
	user?: UserInfo | unknown;
	user_profile?: unknown;
	last_visited_company?: unknown;
	status?: string;
	requires_subscription?: string | boolean;
};

/**
 * Persist a successful login payload (tokens, user, company, subscription
 * flag) to local storage. Shared by the normal email/password login below
 * and by the landing-page handoff redeem flow, so the two paths can't
 * drift on what "being logged in" means.
 */
function applyLoginPayload(
	apiData: LoginPayloadData,
): { accessToken: string } | null {
	const accessToken =
		apiData.accessToken ?? apiData.access_token ?? apiData.token;
	const refreshToken = apiData.refreshToken ?? apiData.refresh_token;
	const user = apiData.user_profile ?? apiData;
	const userData = {
		...user,
		email: apiData.email,
		first_name: apiData.first_name,
		last_name: apiData.last_name,
	};
	const company = apiData.last_visited_company;

	if (!accessToken) {
		return null;
	}

	authStorage.setAuthData(accessToken);
	if (refreshToken) {
		authStorage.setRefreshToken(refreshToken);
	}
	if (userData !== undefined) {
		authStorage.setUserData(userData);
	}
	if (company !== undefined) {
		authStorage.setCompanyData(company);
	}

	setRequiresSubscriptionCookie(
		coerceRequiresSubscription(apiData.requires_subscription),
	);

	return { accessToken };
}

/**
 * Authenticate user with email and password.
 * POST /auth/login
 */
export async function loginAPIAction(
	payload: LoginAPIPayload,
): Promise<ActionResult<LoginPayloadData>> {
	try {
		const response = await axiosInstance.post<
			ApiResponse<LoginPayloadData> | { data: LoginPayloadData }
		>(LOGIN_PATH, payload);

		const apiData =
			"data" in response.data
				? response.data.data
				: (response.data as unknown as LoginPayloadData);

		if (!apiData) {
			const errorMsg = authMessages.login.invalidResponse;
			showToast("error", errorMsg);
			return { success: false, data: null, error: errorMsg };
		}

		if (!applyLoginPayload(apiData)) {
			const errorMsg = authMessages.login.tokenNotReceived;
			showToast("error", errorMsg);
			return { success: false, data: null, error: errorMsg };
		}

		showToast("success", authMessages.login.success);
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

		showToast("error", authMessages.login.failed);
		return { success: false, data: null, error: authMessages.login.failed };
	}
}

/**
 * Redeem a single-use handoff code (minted by the landing page's login)
 * for the session it stands for. Used by the /auth/callback page — no
 * credentials involved here, the login already happened elsewhere.
 * POST /auth/handoff/redeem
 */
export async function exchangeHandoffCodeAction(
	code: string,
): Promise<ActionResult<LoginPayloadData>> {
	try {
		const response = await axiosInstance.post<
			ApiResponse<LoginPayloadData> | { data: LoginPayloadData }
		>(HANDOFF_REDEEM_PATH, { code });

		const apiData =
			"data" in response.data
				? response.data.data
				: (response.data as unknown as LoginPayloadData);

		if (!apiData || !applyLoginPayload(apiData)) {
			return {
				success: false,
				data: null,
				error: authMessages.login.invalidResponse,
			};
		}

		return { success: true, data: apiData, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorResponse = apiError.response?.data as
			| { code?: string; message?: string }
			| undefined;
		return {
			success: false,
			data: null,
			error: errorResponse?.message || authMessages.login.failed,
		};
	}
}
