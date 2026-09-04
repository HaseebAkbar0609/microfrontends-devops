import "server-only";

import { z } from "zod";

const profileSchema = z.object({
	data: z.object({
		user: z.object({ email: z.string().email() }),
		company: z.object({ id: z.string().min(1) }),
	}),
});

const checkoutResponseSchema = z.object({
	checkout_session_id: z.string().min(1),
	url: z.string().url(),
});

type CallerHeaders = {
	authorization: string;
	companyId: string;
};

type CheckoutRequest = {
	planCode: string;
	billingInterval: "monthly" | "annual";
	quantity: number;
	requestId: string;
};

function requiredServerSetting(name: string): string {
	const value = process.env[name]?.trim();
	if (!value) throw new Error(`${name} is not configured`);
	return value;
}

function requiredServerUrl(name: string): string {
	return requiredServerSetting(name).replace(/\/$/, "");
}

async function loadVerifiedProfile(headers: CallerHeaders) {
	const backendUrl = requiredServerUrl("TFS_BACKEND_URL");
	const response = await fetch(
		`${backendUrl}/api/v1/professionals/profile/me`,
		{
			headers: {
				Authorization: headers.authorization,
				"X-Company-ID": headers.companyId,
			},
			cache: "no-store",
			signal: AbortSignal.timeout(10_000),
		},
	);

	if (!response.ok) {
		throw new Error(`Profile verification failed (${response.status})`);
	}
	const profile = profileSchema.parse(await response.json()).data;
	if (profile.company.id !== headers.companyId) {
		throw new Error("Company context mismatch");
	}
	return profile;
}

export async function createHostedCheckout(
	headers: CallerHeaders,
	request: CheckoutRequest,
) {
	const profile = await loadVerifiedProfile(headers);
	const serviceUrl = requiredServerUrl("PAYMENT_SERVICE_URL");
	const serviceToken = requiredServerSetting("PAYMENT_SERVICE_TOKEN");
	const response = await fetch(
		`${serviceUrl}/api/v1/payments/checkout-session`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Service-Token": serviceToken,
			},
			body: JSON.stringify({
				core_account_id: profile.company.id,
				account_type: "business",
				email: profile.user.email,
				plan_code: request.planCode,
				billing_interval: request.billingInterval,
				quantity: request.quantity,
				request_id: request.requestId,
			}),
			cache: "no-store",
			signal: AbortSignal.timeout(15_000),
		},
	);

	if (!response.ok) {
		throw new Error(`Payment service rejected checkout (${response.status})`);
	}
	return checkoutResponseSchema.parse(await response.json());
}
