"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SubscriptionInterval, SubscriptionPlan } from "@/features/manage-plans/types";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { CurrentSubscription, SubscriptionChangeMode } from "../services/subscriptionChangeService";
import { MAX_LICENSE_QUANTITY } from "../services/subscriptionSelection";

export function SubscriptionLicenseFields({ current, plans, mode, interval, quantities, onChange }: {
  current: CurrentSubscription; plans: SubscriptionPlan[]; mode: SubscriptionChangeMode;
  interval: SubscriptionInterval; quantities: Record<string, number>;
  onChange: (id: string, quantity: number) => void;
}) {
  const licenses = plans.filter(plan => plan.is_license);
  const existing = new Map(current.items.map(item => [item.subscription_plan.id, item]));
  return <div className="grid gap-4 md:grid-cols-3">
    {licenses.map(plan => {
      const owned = existing.get(plan.id)?.stripe_subscription_item_quantity ?? 0;
      const quantity = quantities[plan.id] ?? (mode === "licenses" ? 0 : owned);
      const price = plan.prices.find(p => p.interval === interval && p.is_active);
      const fieldId = `license-quantity-${plan.id}`;
      return <section key={plan.id} className="flex min-w-0 flex-col gap-4 rounded-xl border border-border bg-card p-5">
        <h2 className="text-lg font-semibold uppercase">{plan.plan_key.replace(/-/g, " ")}</h2>
        <p className="text-sm text-muted-foreground"><Translate text={localizationConstants.subscriptionExistingQuantity} />: <strong>{owned}</strong></p>
        <div className="mt-auto space-y-2">
          <Label htmlFor={fieldId}><Translate text={mode === "licenses" ? localizationConstants.subscriptionAdditionalQuantity : localizationConstants.subscriptionResultQuantity} /></Label>
          <Input id={fieldId} type="number" inputMode="numeric" min={0} max={MAX_LICENSE_QUANTITY} step={1}
            className="h-11 w-full" value={Number.isNaN(quantity) ? "" : quantity}
            onChange={event => onChange(plan.id, event.target.value === "" ? Number.NaN : Number(event.target.value))}
            aria-invalid={!Number.isSafeInteger(quantity) || quantity < 0 || quantity > MAX_LICENSE_QUANTITY} />
          {mode === "licenses" && <p className="text-sm"><Translate text={localizationConstants.subscriptionResultQuantity} />: <strong>{Number.isFinite(quantity) ? owned + quantity : "—"}</strong></p>}
        </div>
        <p className="text-xs leading-5 text-muted-foreground"><Translate text={localizationConstants.subscriptionUnitPrice} />: {price
          ? new Intl.NumberFormat(undefined, { style: "currency", currency: "SEK" }).format((price.discounted_price ?? price.price) / 100) : "—"}</p>
      </section>;
    })}
  </div>;
}
