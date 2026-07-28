import { API_PATH, getErrorMessageByCode } from "@/constants/api";
import { authStorage } from "@/lib/authStorage";
import { clearRequiresSubscriptionCookie } from "@/lib/requiresSubscriptionCookie";
import axiosInstance from "@/lib/axiosInstance";
import { showToast } from "@/lib/toast";
import type { ActionResult, ApiError, ApiResponse } from "@/types/api";
import type {
	AddToCartPayload,
	SubscriptionInterval,
	SubscriptionPlan,
} from "@/features/manage-plans/types";
import { cartMessages } from "@/constants/messages";

interface CartPlan {
	id: string;
	plan_key: string;
	order_key: number;
	is_license?: boolean;
}

interface CartItem {
	id: string;
	subscription_plan_id: string;
	subscription_plan_price_id: string;
	quantity: number;
	subscription_plan: CartPlan;
	subscription_plan_price: {
		id: string;
		plan_id: string;
		interval: SubscriptionInterval;
		price: number;
		discounted_price: number;
		is_active: boolean;
	};
	item_total_amount?: number;
}

interface CartResponse {
	items: CartItem[];
	total_items: number;
	total_cart_amount?: number;
}

export interface SetupIntentResponse {
	client_secret: string;
}

export interface AttachPaymentMethodPayload {
	payment_method_id: string;
	is_default: boolean;
}

export interface AttachedCard {
	id: string;
	brand: string;
	last4: string;
	exp_month: number;
	exp_year: number;
	is_default: boolean;
}

export type UserCard = AttachedCard;

export interface UserCardsListResponse {
	success: boolean;
	message: string;
	total_pages: number;
	total_items: number;
	current_page: number;
	page_size: number;
	data: UserCard[];
}

export type CheckoutPayload =
	| {
			user_card_id?: string;
			email: string;
			first_name: string;
			last_name: string;
			phone: string;
			address: {
				line1: string;
				line2?: string;
				city: string;
				postal_code: string;
				country: string;
			};
	  }
	| Record<string, never>;

export async function getSubscriptionPlansAction(): Promise<
	ActionResult<SubscriptionPlan[]>
> {
	try {
		const response = await axiosInstance.get<
			ApiResponse<SubscriptionPlan[]>
		>(API_PATH.SUBSCRIPTIONS.LIST);

		return { success: true, data: response.data?.data ?? [], error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorResponse = apiError.response?.data as
			| { code?: string; message?: string }
			| undefined;
		const errorCode = errorResponse?.code;
		const errorMessage = errorResponse?.message;

		if (errorCode) {
			const msg = getErrorMessageByCode(String(errorCode));
			return { success: false, data: null, error: msg, errorCode };
		}

		return {
			success: false,
			data: null,
			error: errorMessage ?? "Failed to load subscription plans.",
		};
	}
}

export async function getCartAction(): Promise<ActionResult<CartResponse>> {
	try {
		const response = await axiosInstance.get<ApiResponse<CartResponse>>(
			API_PATH.CART.GET,
		);

		return {
			success: true,
			data: response.data?.data ?? { items: [], total_items: 0 },
			error: null,
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
			return { success: false, data: null, error: msg, errorCode };
		}

		return {
			success: false,
			data: null,
			error: errorMessage ?? "Failed to fetch cart.",
		};
	}
}

export async function updateCartItemQuantityAction(
	cartItemId: string,
	quantity: number,
): Promise<ActionResult<unknown>> {
	try {
		const response = await axiosInstance.patch<ApiResponse<unknown>>(
			API_PATH.CART.UPDATE(cartItemId),
			{ quantity: String(quantity) },
		);

		return { success: true, data: response.data?.data ?? {}, error: null };
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

		const message = errorMessage ?? "Failed to update cart quantity.";
		showToast("error", message);
		return { success: false, data: null, error: message };
	}
}

export async function deleteCartItemAction(
	cartItemId: string,
): Promise<ActionResult<unknown>> {
	try {
		const response = await axiosInstance.delete<ApiResponse<unknown>>(
			API_PATH.CART.UPDATE(cartItemId),
		);

		return { success: true, data: response.data?.data ?? {}, error: null };
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

		const message = errorMessage ?? "Failed to remove item from cart.";
		showToast("error", message);
		return { success: false, data: null, error: message };
	}
}

export async function clearCartAction(): Promise<ActionResult<unknown>> {
	try {
		const response = await axiosInstance.delete<ApiResponse<unknown>>(
			API_PATH.CART.CLEAR,
		);

		return { success: true, data: response.data?.data ?? {}, error: null };
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

		const message = errorMessage ?? "Failed to clear cart.";
		showToast("error", message);
		return { success: false, data: null, error: message };
	}
}

export interface CheckoutResponse {
	status: string;
	client_secret?: string;
	/** Backend may return rotated session tokens after checkout. */
	access_token?: string;
	accessToken?: string;
	token?: string;
	refresh_token?: string;
	refreshToken?: string;
}

/** Persist access/refresh tokens from checkout envelope or nested `data` (API-dependent). */
function persistTokensFromResponsePayload(payload: unknown): void {
	if (!payload || typeof payload !== "object") return;
	const o = payload as Record<string, unknown>;
	const accessRaw = o.access_token ?? o.accessToken ?? o.token;
	const refreshRaw = o.refresh_token ?? o.refreshToken;
	const access = typeof accessRaw === "string" ? accessRaw.trim() : "";
	const refresh = typeof refreshRaw === "string" ? refreshRaw.trim() : "";
	if (access) authStorage.setAuthData(access);
	if (refresh) authStorage.setRefreshToken(refresh);
}

export type CheckoutSubscriptionOptions = {
	/** When true, skip the success toast so the caller can show a final message after follow-up steps. */
	suppressSuccessToast?: boolean;
};

export async function checkoutSubscriptionAction(
	payload: CheckoutPayload = {},
	options?: CheckoutSubscriptionOptions,
): Promise<ActionResult<CheckoutResponse>> {
	try {
		const response = await axiosInstance.post<
			ApiResponse<CheckoutResponse>
		>(API_PATH.SUBSCRIPTIONS.CHECKOUT, payload);

		const body = response.data as ApiResponse<CheckoutResponse> &
			Record<string, unknown>;
		const checkoutData =
			(body?.data ?? { status: "incomplete" }) as CheckoutResponse;
		persistTokensFromResponsePayload(body);
		persistTokensFromResponsePayload(checkoutData);

		const serverMessage =
			typeof body?.message === "string" ? body.message : undefined;

		if (!options?.suppressSuccessToast) {
			showToast(
				"success",
				serverMessage ?? cartMessages.checkoutPayment.checkoutCompleted,
			);
		}

		return {
			success: true,
			data: checkoutData,
			error: null,
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

		const message = errorMessage ?? "Checkout failed.";
		showToast("error", message);
		return { success: false, data: null, error: message };
	}
}

export async function addSubscriptionToCartAction(
	payload: AddToCartPayload,
): Promise<ActionResult<unknown>> {
	try {
		const response = await axiosInstance.post<ApiResponse<unknown>>(
			API_PATH.CART.ADD,
			payload,
		);

		showToast("success", "Membership has been added to your cart.");
		return { success: true, data: response.data?.data ?? {}, error: null };
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

		const message = errorMessage ?? "Failed to add membership to cart.";
		showToast("error", message);
		return { success: false, data: null, error: message };
	}
}

export interface CompleteSubscriptionResponse {
	access_token?: string;
	accessToken?: string;
	token?: string;
	refresh_token?: string;
	refreshToken?: string;
	user_profile?: unknown;
	user?: unknown;
	last_visited_company?: unknown;
	requires_subscription?: string | boolean;
}

/**
 * Complete-subscription request body. The API field is `payment_token`; the value
 * is the professional access JWT from verify-email (stored in authStorage).
 */
export type CompleteSubscriptionPayload = {
	payment_token: string;
};

function extractCompleteSubscriptionPayload(
	body: unknown,
): CompleteSubscriptionResponse | null {
	if (!body || typeof body !== "object") return null;
	const root = body as Record<string, unknown>;
	const layer1 = root.data;
	if (layer1 && typeof layer1 === "object") {
		const o = layer1 as Record<string, unknown>;
		const inner = o.data;
		if (inner && typeof inner === "object" && hasAccessToken(inner)) {
			return inner as CompleteSubscriptionResponse;
		}
		if (hasAccessToken(o)) return o as CompleteSubscriptionResponse;
	}
	if (hasAccessToken(root)) return root as CompleteSubscriptionResponse;
	return null;
}

function hasAccessToken(o: object): boolean {
	const r = o as Record<string, unknown>;
	return (
		typeof r.access_token === "string" ||
		typeof r.accessToken === "string" ||
		typeof r.token === "string"
	);
}

export async function completeSubscriptionAction(
	payload: CompleteSubscriptionPayload,
): Promise<ActionResult<CompleteSubscriptionResponse>> {
	try {
		const response = await axiosInstance.post<
			ApiResponse<CompleteSubscriptionResponse> | CompleteSubscriptionResponse
		>(API_PATH.AUTH.COMPLETE_SUBSCRIPTION, payload);

		const apiData = extractCompleteSubscriptionPayload(response.data);
		if (!apiData) {
			return {
				success: false,
				data: null,
				error: "Invalid response from server",
			};
		}

		const accessToken =
			apiData.access_token ?? apiData.accessToken ?? apiData.token ?? "";
		const refreshToken =
			apiData.refresh_token ?? apiData.refreshToken ?? "";
		const userPayload = apiData.user_profile ?? apiData.user;
		const companyPayload = apiData.last_visited_company;

		if (!accessToken.trim()) {
			return {
				success: false,
				data: null,
				error: "Invalid response from server",
			};
		}

		authStorage.setAuthData(accessToken);
		if (refreshToken.trim()) {
			authStorage.setRefreshToken(refreshToken);
		}
		if (userPayload !== undefined) {
			authStorage.setUserData(userPayload);
		}
		if (companyPayload !== undefined) {
			authStorage.setCompanyData(companyPayload);
		}

		// Finished subscription flow — clear gate so middleware allows /home.
		clearRequiresSubscriptionCookie();

		return {
			success: true,
			data: apiData,
			error: null,
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

		const message = errorMessage ?? "Failed to complete subscription.";
		showToast("error", message);
		return { success: false, data: null, error: message };
	}
}
