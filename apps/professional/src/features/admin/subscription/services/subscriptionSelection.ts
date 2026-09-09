import type { SubscriptionInterval, SubscriptionPlan } from "@/features/manage-plans/types";
import type { CurrentSubscription, SubscriptionChangeMode, SubscriptionChangeRequest } from "./subscriptionChangeService";

export const MAX_LICENSE_QUANTITY = 10000;
export const SUBSCRIPTION_EDITOR_QUERY_KEY = ["subscription-editor"] as const;
export const SUBSCRIPTION_EDITOR_PATHS = {
  licenses: "/admin/subscription/change?mode=licenses",
  subscription: "/admin/subscription/change?mode=subscription",
  overview: "/admin/subscription",
} as const;

export function buildSubscriptionSelection(
  current: CurrentSubscription, plans: SubscriptionPlan[], mode: SubscriptionChangeMode,
  baseId: string, interval: SubscriptionInterval, quantities: Record<string, number>,
): SubscriptionChangeRequest {
  const base = current.items.find(item => !item.subscription_plan.is_license);
  if (!base) throw new Error("SUBSCRIPTION_SELECTION_INVALID");
  const existing = new Map(current.items.map(item => [item.subscription_plan.id, item]));
  const target = new Map<string, number>();
  // Never lose an existing item just because the catalog or visible cards changed.
  for (const item of current.items) {
    if (item.subscription_plan.is_license) {
      const input = quantities[item.subscription_plan.id];
      target.set(item.subscription_plan.id, mode === "licenses"
        ? item.stripe_subscription_item_quantity + (input ?? 0)
        : (input ?? item.stripe_subscription_item_quantity));
    }
  }
  for (const [id, quantity] of Object.entries(quantities)) {
    if (!Number.isSafeInteger(quantity) || quantity < 0 || quantity > MAX_LICENSE_QUANTITY) {
      throw new Error("SUBSCRIPTION_SELECTION_INVALID");
    }
    if (!existing.has(id)) target.set(id, quantity);
  }
  target.set(mode === "licenses" ? base.subscription_plan.id : baseId, 1);
  const selectedInterval = mode === "licenses" ? base.subscription_plan_price.interval : interval;
  const items = [...target.entries()].filter(([, quantity]) => quantity > 0).map(([id, quantity]) => {
    const old = existing.get(id);
    const price = old?.subscription_plan_price.interval === selectedInterval
      ? old.subscription_plan_price
      : plans.find(plan => plan.id === id)?.prices.find(p => p.interval === selectedInterval && p.is_active);
    if (!price || quantity > MAX_LICENSE_QUANTITY) throw new Error("SUBSCRIPTION_SELECTION_INVALID");
    return { subscription_plan_id: id, subscription_plan_price_id: price.id, quantity };
  });
  return { mode, subscription_id: current.stripe_subscription_id, items };
}
