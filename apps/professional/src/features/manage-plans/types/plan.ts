export type PaymentOption = "month" | "quarter" | "year";

export type SubscriptionInterval = "monthly" | "quarterly" | "yearly";

export interface SubscriptionPlanPrice {
  id: string;
  plan_id: string;
  interval: SubscriptionInterval;
  price: number;
  discounted_price: number;
  is_active: boolean;
}

export interface SubscriptionPlan {
  id: string;
  plan_key: string;
  order_key: number;
  prices: SubscriptionPlanPrice[];
}

export interface AddToCartPayload {
  subscription_plan_id: string;
  subscription_plan_price_id: string;
  quantity: number;
}
