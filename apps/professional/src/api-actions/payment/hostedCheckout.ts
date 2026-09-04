import { authStorage } from "@/lib/authStorage";
import type { ActionResult } from "@/types/api";

type HostedCheckoutResponse = {
	checkout_session_id: string;
	url: string;
};

type HostedCheckoutRequest = {
	planCode: string;
	billingInterval: "monthly" | "annual";
	quantity: number;
};

function readCompanyId(): string {
	const company = authStorage.getCompanyData();
	if (!company || typeof company !== "object" || !("id" in company)) return "";
	return typeof company.id === "string" ? company.id.trim() : "";
}

export async function createHostedCheckoutAction(
	payload: HostedCheckoutRequest,
): Promise<ActionResult<HostedCheckoutResponse>> {
	const accessToken = authStorage.getAccessToken()?.trim() ?? "";
	const companyId = readCompanyId();
	if (!accessToken || !companyId) {
		return { success: false, data: null, error: "Unauthorized" };
	}

	try {
		const response = await fetch("/api/billing/checkout-session", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
				"X-Company-ID": companyId,
			},
			body: JSON.stringify({ ...payload, requestId: crypto.randomUUID() }),
		});
		if (!response.ok) {
			return { success: false, data: null, error: "Unable to start checkout" };
		}
		const data = (await response.json()) as HostedCheckoutResponse;
		const checkoutUrl = new URL(data.url);
		if (checkoutUrl.protocol !== "https:" || checkoutUrl.hostname !== "checkout.stripe.com") {
			return { success: false, data: null, error: "Invalid checkout URL" };
		}
		return { success: true, data, error: null };
	} catch {
		return { success: false, data: null, error: "Unable to start checkout" };
	}
}
