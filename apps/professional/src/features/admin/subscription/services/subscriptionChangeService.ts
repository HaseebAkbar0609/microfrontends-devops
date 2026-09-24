import { API_PATH } from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type { SubscriptionPlan, SubscriptionPlanPrice, AddToCartPayload } from "@/features/manage-plans/types";
import type { ChangeSubscriptionResponse } from "@/api-actions/cart/subscriptions";

export type SubscriptionChangeMode = "licenses" | "subscription";
export interface CurrentSubscription {
  stripe_subscription_id: string;
  stripe_subscription_status: string;
  items: Array<{
    subscription_plan: SubscriptionPlan & { is_license: boolean };
    subscription_plan_price: SubscriptionPlanPrice;
    stripe_subscription_item_quantity: number;
  }>;
}
export interface SubscriptionChangeRequest {
  mode: SubscriptionChangeMode;
  subscription_id: string;
  items: AddToCartPayload[];
  expected_revision?: string;
  proration_date?: number;
}
export interface SubscriptionChangePreview {
  change_type: ChangeSubscriptionResponse["change_type"];
  amount_due_now: number;
  recurring_amount: number;
  currency: string;
  interval: string;
  effective_at?: number;
  existing_schedule_preserved?: boolean;
  expected_revision: string;
  proration_date: number;
}
export async function loadSubscriptionEditor() {
  const [current, plans] = await Promise.all([
    axiosInstance.get<ApiResponse<CurrentSubscription | null>>(API_PATH.SUBSCRIPTIONS.CURRENT),
    axiosInstance.get<ApiResponse<SubscriptionPlan[]>>(API_PATH.SUBSCRIPTIONS.LIST),
  ]);
  return { current: current.data.data, plans: plans.data.data };
}
export async function previewSubscriptionChange(request: SubscriptionChangeRequest) {
  const response = await axiosInstance.post<ApiResponse<SubscriptionChangePreview>>(
    API_PATH.SUBSCRIPTIONS.CHANGE_PREVIEW, request,
  );
  return response.data.data;
}
export async function applySubscriptionChange(request: SubscriptionChangeRequest) {
  const response = await axiosInstance.post<ApiResponse<ChangeSubscriptionResponse>>(
    API_PATH.SUBSCRIPTIONS.CHANGE, request,
  );
  return response.data.data;
}
