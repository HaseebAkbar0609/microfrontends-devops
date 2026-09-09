"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { SubscriptionChangeMode, SubscriptionChangePreview } from "../services/subscriptionChangeService";

export function SubscriptionChangeReview({ preview, mode, accepted, onAccept, onBack, onConfirm, busy, pendingPayment, items }: {
  preview: SubscriptionChangePreview; mode: SubscriptionChangeMode; accepted: boolean;
  onAccept: (value: boolean) => void; onBack: () => void; onConfirm: () => void; busy: boolean;
  pendingPayment: boolean; items: Array<{ name: string; before: number; after: number }>;
}) {
  const money = (amount: number) => new Intl.NumberFormat(undefined, {
    style: "currency", currency: preview.currency,
  }).format(amount / 100);
  const noChange = preview.change_type === "unchanged";
  const intervalKey = preview.interval === "yearly" ? localizationConstants.managePlansPaymentOptionYear
    : preview.interval === "quarterly" ? localizationConstants.managePlansPaymentOptionQuarter : localizationConstants.managePlansPaymentOptionMonth;
  return <section className="space-y-5 rounded-xl border border-border bg-card p-5 sm:p-6" aria-live="polite">
    <h2 className="text-xl font-semibold"><Translate text={localizationConstants.subscriptionReviewChanges} /></h2>
    <dl className="divide-y divide-border">
      {items.map(item => <div key={item.name} className="flex flex-wrap justify-between gap-3 py-3 text-sm">
        <dt className="font-medium uppercase">{item.name}</dt>
        <dd className="tabular-nums"><Translate text={localizationConstants.subscriptionExistingQuantity} />: {item.before}
          {" → "}<Translate text={localizationConstants.subscriptionResultQuantity} />: <strong>{item.after}</strong></dd>
      </div>)}
    </dl>
    {noChange ? <p><Translate text={localizationConstants.subscriptionNoChanges} /></p> : <>
      <div className="grid gap-5 sm:grid-cols-2">
        <div><p className="text-sm text-muted-foreground"><Translate text={localizationConstants.subscriptionDueNow} /></p><p className="mt-1 text-2xl font-semibold tabular-nums">{money(preview.amount_due_now)}</p></div>
        <div><p className="text-sm text-muted-foreground"><Translate text={localizationConstants.subscriptionRecurringTotal} /></p><p className="mt-1 text-2xl font-semibold tabular-nums">{money(preview.recurring_amount)}</p><p className="text-sm text-muted-foreground"><Translate text={intervalKey} /></p></div>
      </div>
      <p className="text-sm leading-6 text-muted-foreground"><Translate text={localizationConstants.subscriptionRecurringHint} /></p>
      {preview.change_type === "downgrade_scheduled" && <p className="rounded-lg bg-primary/10 p-3 text-sm leading-6"><Translate text={localizationConstants.subscriptionScheduledHint} /> {preview.effective_at && new Date(preview.effective_at).toLocaleDateString()}</p>}
      <p className="text-sm"><Translate text={localizationConstants.subscriptionReviewHint} /></p>
      <div className="flex items-start gap-3">
        <Checkbox id="subscription-change-terms" checked={accepted} disabled={busy} onCheckedChange={value => onAccept(value === true)} className="mt-1" />
        <Label htmlFor="subscription-change-terms" className="min-h-11 text-sm leading-6"><Translate text={localizationConstants.manageCartTermsText} /></Label>
      </div>
    </>}
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <Button variant="outline" className="h-auto min-h-11 whitespace-normal" onClick={onBack} disabled={busy || pendingPayment}><Translate text={localizationConstants.subscriptionEditSelection} /></Button>
      {!noChange && <Button variant="primary" className="h-auto min-h-11 whitespace-normal" disabled={!accepted || busy} onClick={onConfirm}>
        <Translate text={mode === "licenses" ? localizationConstants.subscriptionConfirmLicenses : localizationConstants.manageCartApplyChangesButton} />
      </Button>}
    </div>
  </section>;
}
