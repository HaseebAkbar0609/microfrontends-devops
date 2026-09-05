import "server-only";

import { z } from "zod";

const checkoutResponseSchema = z.object({
	checkout_session_id: z.string().min(1),
	url: z.string().url(),
});

const checkoutStatusResponseSchema = z.object({
	checkout_session_id: z.string().min(1),
	checkout_status: z.enum(["open", "completed", "expired"]),
	core_account_id: z.string().min(1),
	payment_status: z.enum(["pending", "active", "restricted", "canceled"]),
	subscription_status: z.string().nullable(),
});

const cartContextSchema = z.object({
	data: z.object({
		items: z.array(
			z.object({
				quantity: z.number().int().positive(),
				subscription_plan: z.object({ plan_key: z.string() }),
				subscription_plan_price: z.object({
					interval: z.enum(["monthly", "quarterly", "yearly"]),
				}),
			}),
		),
	}),
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
	email: string;
};

function requiredServerSetting(name: string): string {
	const value = process.env[name]?.trim();
	if (!value) throw new Error(`${name} is not configured`);
	return value;
}

function requiredServerUrl(name: string): string {
	return requiredServerSetting(name).replace(/\/$/, "");
}

async function loadSubscriptionContext(headers: CallerHeaders) {
	const backendUrl = requiredServerUrl("TFS_BACKEND_URL");
	const response = await fetch(
		`${backendUrl}/api/v1/professionals/cart/get`,
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
		throw new Error(
			`Subscription context verification failed (${response.status})`,
		);
	}
	return cartContextSchema.parse(await response.json()).data;
}

export async function createHostedCheckout(
	headers: CallerHeaders,
	request: CheckoutRequest,
) {
	const context = await loadSubscriptionContext(headers);
	const expectedInterval =
		request.billingInterval === "annual" ? "yearly" : "monthly";
	if (
		context.items.length !== 1 ||
		context.items[0].subscription_plan.plan_key !== request.planCode ||
		context.items[0].subscription_plan_price.interval !== expectedInterval ||
		context.items[0].quantity !== request.quantity
	) {
		throw new Error("Checkout request does not match the current cart");
	}
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
				core_account_id: headers.companyId,
				account_type: "business",
				email: request.email,
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

export async function getHostedCheckoutStatus(
	headers: CallerHeaders,
	checkoutSessionId: string,
) {
	await loadSubscriptionContext(headers);
	const serviceUrl = requiredServerUrl("PAYMENT_SERVICE_URL");
	const serviceToken = requiredServerSetting("PAYMENT_SERVICE_TOKEN");
	const response = await fetch(
		`${serviceUrl}/api/v1/payments/checkout-sessions/${encodeURIComponent(checkoutSessionId)}/status`,
		{
			headers: { "X-Service-Token": serviceToken },
			cache: "no-store",
			signal: AbortSignal.timeout(10_000),
		},
	);
	if (!response.ok) {
		throw new Error(
			`Payment service rejected status lookup (${response.status})`,
		);
	}
	const status = checkoutStatusResponseSchema.parse(await response.json());
	if (status.core_account_id !== headers.companyId) {
		throw new Error("Checkout Session company context mismatch");
	}
	return status;
}
