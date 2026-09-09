import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult } from "@/types/api";
import type { ApiResponse } from "@/types/api";

export type BillingPaymentMethod = {
	id: string;
	brand: string | null;
	last4: string | null;
	exp_month: number | null;
	exp_year: number | null;
	is_default: boolean;
};

type SetupIntent = { client_secret: string };

async function coreBillingRequest<T>(
	method: "get" | "post" | "delete",
	path: string,
): Promise<ActionResult<T>> {
	try {
		const response = await axiosInstance.request<ApiResponse<T>>({ method, url: path });
		return {
			success: true,
			data: response.data.data,
			error: null,
		};
	} catch (error: unknown) {
		const message = (error as { response?: { data?: { message?: string } } })
			.response?.data?.message;
		return {
			success: false,
			data: null,
			error:
				message === "CANNOT_DELETE_DEFAULT_CARD"
					? "LAST_PAYMENT_METHOD"
					: message ?? "PAYMENT_METHOD_REQUEST_FAILED",
		};
	}
}

export async function listBillingPaymentMethodsAction() {
	type CardListEnvelope = ApiResponse<BillingPaymentMethod[]>;
	try {
		const response = await axiosInstance.get<CardListEnvelope>(
			"/professionals/user-cards/list?page=1&page_size=100",
		);
		return { success: true, data: response.data.data, error: null } satisfies ActionResult<BillingPaymentMethod[]>;
	} catch {
		return { success: false, data: null, error: "PAYMENT_METHOD_REQUEST_FAILED" } satisfies ActionResult<BillingPaymentMethod[]>;
	}
}

export function createBillingSetupIntentAction(_email: string) {
	return coreBillingRequest<SetupIntent>("post", "/professionals/user-cards/setup-intent");
}

export function completeBillingSetupIntentAction(setupIntentId: string) {
	return coreBillingRequest<BillingPaymentMethod>(
		"post",
		`/professionals/user-cards/complete-setup-intent/${encodeURIComponent(setupIntentId)}`,
	);
}

export function setDefaultBillingPaymentMethodAction(paymentMethodId: string) {
	return coreBillingRequest<BillingPaymentMethod>(
		"post",
		`/professionals/user-cards/set-default/${encodeURIComponent(paymentMethodId)}`,
	);
}

export function deleteBillingPaymentMethodAction(paymentMethodId: string) {
	return coreBillingRequest<{ deleted: true }>(
		"delete",
		`/professionals/user-cards/delete/${encodeURIComponent(paymentMethodId)}`,
	);
}
