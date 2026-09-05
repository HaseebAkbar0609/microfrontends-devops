import { authStorage } from "@/lib/authStorage";
import type { ActionResult } from "@/types/api";

export type BillingPaymentMethod = {
	id: string;
	brand: string | null;
	last4: string | null;
	exp_month: number | null;
	exp_year: number | null;
	is_default: boolean;
};

type SetupIntent = { client_secret: string };

function callerHeaders(): Record<string, string> | null {
	const accessToken = authStorage.getAccessToken()?.trim() ?? "";
	const company = authStorage.getCompanyData();
	const companyId =
		company && typeof company === "object" && "id" in company && typeof company.id === "string"
			? company.id.trim()
			: "";
	if (!accessToken || !companyId) return null;
	return {
		Authorization: `Bearer ${accessToken}`,
		"X-Company-ID": companyId,
	};
}

async function billingRequest<T>(
	path: string,
	init: RequestInit = {},
): Promise<ActionResult<T>> {
	const headers = callerHeaders();
	if (!headers) return { success: false, data: null, error: "Unauthorized" };

	try {
		const requestHeaders = new Headers(init.headers);
		for (const [name, value] of Object.entries(headers)) {
			requestHeaders.set(name, value);
		}
		const response = await fetch(path, {
			...init,
			headers: requestHeaders,
			cache: "no-store",
		});
		if (!response.ok) {
			return {
				success: false,
				data: null,
				error: response.status === 409 ? "LAST_PAYMENT_METHOD" : "PAYMENT_METHOD_REQUEST_FAILED",
				errorCode: String(response.status),
			};
		}
		return {
			success: true,
			data: (await response.json()) as T,
			error: null,
		};
	} catch {
		return {
			success: false,
			data: null,
			error: "PAYMENT_METHOD_REQUEST_FAILED",
		};
	}
}

export function listBillingPaymentMethodsAction() {
	return billingRequest<BillingPaymentMethod[]>("/api/billing/payment-methods");
}

export function createBillingSetupIntentAction(email: string) {
	return billingRequest<SetupIntent>("/api/billing/payment-methods/setup-intent", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email }),
	});
}

export function completeBillingSetupIntentAction(setupIntentId: string) {
	return billingRequest<BillingPaymentMethod>(
		`/api/billing/payment-methods/setup-intent/${encodeURIComponent(setupIntentId)}`,
		{ method: "POST" },
	);
}

export function setDefaultBillingPaymentMethodAction(paymentMethodId: string) {
	return billingRequest<BillingPaymentMethod>(
		`/api/billing/payment-methods/${encodeURIComponent(paymentMethodId)}/default`,
		{ method: "POST" },
	);
}

export function deleteBillingPaymentMethodAction(paymentMethodId: string) {
	return billingRequest<{ deleted: true }>(
		`/api/billing/payment-methods/${encodeURIComponent(paymentMethodId)}`,
		{ method: "DELETE" },
	);
}
