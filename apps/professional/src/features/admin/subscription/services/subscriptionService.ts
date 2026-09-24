import { API_PATH } from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/api";

export interface SubscriptionOverviewItem {
	id: string;
	key: string;
	name: string;
	is_license: boolean;
	quantity: number;
	interval: string | null;
	unit_amount: number;
	total_amount: number;
	currency: string;
}

export interface SubscriptionOverview {
  sales_onboarding_pending?: boolean;
  managed_license?: boolean;
  license_required?: boolean;
	company_id: string;
	subscription_id: string | null;
	start_at: string | null;
	has_subscription: boolean;
	plan: {
		id: string;
		key: string;
		name: string;
		interval: string | null;
		price: number | null;
		discounted_price: number | null;
		currency: string;
		is_license: boolean;
	} | null;
	status: {
		stripe_status: string | null;
		is_cancelled: boolean;
		is_expired: boolean;
		cancellable: boolean;
		cancel_at: string | null;
		end_at: string | null;
		commitment_end_at: string | null;
		failed_payment_attempts: number;
		scheduled_change: {
			effective_at?: number;
			items?: Array<{
				plan_key: string;
				quantity: number;
			}>;
		} | null;
		access_state: "ACTIVE" | "ACTIVE_IN_GRACE" | "RESTRICTED" | "INACTIVE" | "DEMO";
	} | null;
	billing: {
		interval: string | null;
		amount: number | null;
		currency: string;
		next_billing_at: string | null;
	} | null;
	items: SubscriptionOverviewItem[];
}

export async function getSubscriptionOverview(): Promise<SubscriptionOverview> {
	const response = await axiosInstance.get<ApiResponse<SubscriptionOverview>>(
		API_PATH.SUBSCRIPTIONS.OVERVIEW,
	);
	if (!response.data?.data) {
		throw new Error("SUBSCRIPTION_OVERVIEW_REQUEST_FAILED");
	}
	return response.data.data;
}

export interface OpenInvoice {
	id: string;
	number: string | null;
	amount_due: number;
	currency: string;
	attempt_count: number;
	hosted_invoice_url: string | null;
}

export async function getOpenInvoices(): Promise<OpenInvoice[]> {
	const response = await axiosInstance.get<ApiResponse<OpenInvoice[]>>(
		"/professionals/subscriptions/open-invoices",
	);
	return response.data?.data ?? [];
}
