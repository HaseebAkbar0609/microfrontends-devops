import "server-only";

import { MANAGE_PLANS_PLAN_IDS } from "@/features/manage-plans/constants";
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

const accountStatusResponseSchema = z.object({
	core_account_id: z.string().min(1),
	payment_status: z.enum(["pending", "active", "restricted", "canceled"]),
	subscription_status: z.string().nullable(),
	stripe_subscription_id: z.string().nullable(),
	plan_code: z.string().nullable(),
	billing_interval: z.enum(["monthly", "annual"]).nullable(),
	quantity: z.number().int().positive().nullable(),
	current_period_start: z.string().datetime({ offset: true }).nullable(),
	current_period_end: z.string().datetime({ offset: true }).nullable(),
	commitment_end: z.string().datetime({ offset: true }).nullable(),
	cancel_at_period_end: z.boolean(),
	canceled_at: z.string().datetime({ offset: true }).nullable(),
});

const setupIntentResponseSchema = z.object({
	client_secret: z.string().min(1),
});

export const paymentMethodSchema = z.object({
	id: z.string().regex(/^pm_[A-Za-z0-9_]+$/),
	brand: z.string().nullable(),
	last4: z.string().regex(/^\d{4}$/).nullable(),
	exp_month: z.number().int().min(1).max(12).nullable(),
	exp_year: z.number().int().min(2000).max(9999).nullable(),
	is_default: z.boolean(),
});

const paymentMethodsSchema = z.array(paymentMethodSchema);

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

async function assertNoSalesOnboarding(headers: CallerHeaders) {
	const response = await fetch(`${requiredServerUrl("TFS_BACKEND_URL")}/api/v1/subscriptions`, {
		headers: { Authorization: headers.authorization, "X-Company-ID": headers.companyId },
		cache: "no-store", signal: AbortSignal.timeout(10_000),
	});
	if (!response.ok || (await response.json()).data?.sales_onboarding_pending) {
		throw new Error("Existing sales invoice must be completed before checkout");
	}
}

async function verifyCallerContext(headers: CallerHeaders) {
	await loadSubscriptionContext(headers);
}

async function paymentServiceRequest(
	path: string,
	init: RequestInit = {},
): Promise<Response> {
	const serviceUrl = requiredServerUrl("PAYMENT_SERVICE_URL");
	const serviceToken = requiredServerSetting("PAYMENT_SERVICE_TOKEN");
	const headers = new Headers(init.headers);
	headers.set("X-Service-Token", serviceToken);
	return fetch(`${serviceUrl}${path}`, {
		...init,
		headers,
		cache: "no-store",
		signal: AbortSignal.timeout(15_000),
	});
}

export async function createPaymentMethodSetup(
	headers: CallerHeaders,
	email: string,
) {
	await verifyCallerContext(headers);
	const response = await paymentServiceRequest("/api/v1/payments/setup-intent", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			core_account_id: headers.companyId,
			account_type: "business",
			email,
		}),
	});
	if (!response.ok) {
		throw new Error(`Payment service rejected card setup (${response.status})`);
	}
	return setupIntentResponseSchema.parse(await response.json());
}

export async function completePaymentMethodSetup(
	headers: CallerHeaders,
	setupIntentId: string,
) {
	await verifyCallerContext(headers);
	const response = await paymentServiceRequest(
		`/api/v1/payments/setup-intents/${encodeURIComponent(setupIntentId)}/complete`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ core_account_id: headers.companyId }),
		},
	);
	if (!response.ok) {
		throw new Error(
			`Payment service rejected card completion (${response.status})`,
		);
	}
	return paymentMethodSchema.parse(await response.json());
}

export async function listPaymentMethods(headers: CallerHeaders) {
	await verifyCallerContext(headers);
	const response = await paymentServiceRequest(
		`/api/v1/payments/accounts/${encodeURIComponent(headers.companyId)}/payment-methods`,
	);
	if (!response.ok) {
		throw new Error(`Payment service rejected card list (${response.status})`);
	}
	return paymentMethodsSchema.parse(await response.json());
}

export async function setDefaultPaymentMethod(
	headers: CallerHeaders,
	paymentMethodId: string,
) {
	await verifyCallerContext(headers);
	const response = await paymentServiceRequest(
		`/api/v1/payments/accounts/${encodeURIComponent(headers.companyId)}/payment-methods/${encodeURIComponent(paymentMethodId)}/default`,
		{ method: "POST" },
	);
	if (!response.ok) {
		throw new Error(
			`Payment service rejected default card update (${response.status})`,
		);
	}
	return paymentMethodSchema.parse(await response.json());
}

export async function deletePaymentMethod(
	headers: CallerHeaders,
	paymentMethodId: string,
) {
	await verifyCallerContext(headers);
	const response = await paymentServiceRequest(
		`/api/v1/payments/accounts/${encodeURIComponent(headers.companyId)}/payment-methods/${encodeURIComponent(paymentMethodId)}`,
		{ method: "DELETE" },
	);
	if (!response.ok) {
		const error = new Error(`Payment service rejected card deletion (${response.status})`);
		Object.assign(error, { status: response.status });
		throw error;
	}
}

export async function createHostedCheckout(
	headers: CallerHeaders,
	request: CheckoutRequest,
) {
	await assertNoSalesOnboarding(headers);
	const context = await loadSubscriptionContext(headers);
	const expectedInterval =
		request.billingInterval === "annual" ? "yearly" : "monthly";
	const startItem = context.items.find(
		(item) => item.subscription_plan.plan_key === MANAGE_PLANS_PLAN_IDS.START,
	);
	const standardItem = context.items.find(
		(item) => item.subscription_plan.plan_key === MANAGE_PLANS_PLAN_IDS.STANDARD,
	);
	if (
		request.planCode !== MANAGE_PLANS_PLAN_IDS.STANDARD ||
		context.items.length !== 2 ||
		!startItem ||
		!standardItem ||
		startItem.subscription_plan_price.interval !== expectedInterval ||
		startItem.quantity !== 1 ||
		standardItem.subscription_plan_price.interval !== expectedInterval ||
		standardItem.quantity !== request.quantity
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

export async function getBillingAccountStatus(headers: CallerHeaders) {
	await verifyCallerContext(headers);
	const response = await paymentServiceRequest(
		`/api/v1/payments/accounts/${encodeURIComponent(headers.companyId)}/status`,
	);
	if (response.status === 404) return null;
	if (!response.ok) {
		throw new Error(`Payment service rejected account status (${response.status})`);
	}
	const status = accountStatusResponseSchema.parse(await response.json());
	if (status.core_account_id !== headers.companyId) {
		throw new Error("Billing account company context mismatch");
	}
	return status;
}
