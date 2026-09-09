"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PaymentOptionSelector } from "@/features/manage-plans";
import type { PaymentOption, SubscriptionInterval, SubscriptionPlan } from "@/features/manage-plans/types";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { loadSubscriptionEditor, type CurrentSubscription, type SubscriptionChangeMode } from "../services/subscriptionChangeService";
import { SUBSCRIPTION_EDITOR_PATHS, SUBSCRIPTION_EDITOR_QUERY_KEY } from "../services/subscriptionSelection";
import { useSubscriptionChange } from "../hooks/useSubscriptionChange";
import { SubscriptionLicenseFields } from "./SubscriptionLicenseFields";
import { SubscriptionChangeReview } from "./SubscriptionChangeReview";

const PAYMENT_INTERVALS: Record<PaymentOption, SubscriptionInterval> = {
  month: "monthly", quarter: "quarterly", year: "yearly",
};

function EditorForm({ current, plans, mode }: {
  current: CurrentSubscription; plans: SubscriptionPlan[]; mode: SubscriptionChangeMode;
}) {
  const form = useSubscriptionChange(current, plans, mode);
  const paymentOption = (Object.keys(PAYMENT_INTERVALS) as PaymentOption[]).find(key => PAYMENT_INTERVALS[key] === form.interval)!;
  const bases = plans.filter(plan => !plan.is_license && plan.plan_key !== "free");
  const reviewItems = [...new Set([...current.items.map(item => item.subscription_plan.id),
    ...(form.review?.request.items.map(item => item.subscription_plan_id) ?? [])])].map(id => {
    const old = current.items.find(item => item.subscription_plan.id === id);
    return { name: old?.subscription_plan.plan_key ?? plans.find(plan => plan.id === id)?.plan_key ?? id,
      before: old?.stripe_subscription_item_quantity ?? 0,
      after: form.review?.request.items.find(item => item.subscription_plan_id === id)?.quantity ?? 0 };
  }).filter(item => mode === "subscription" || item.before !== item.after);
  return <div className="space-y-6">
    {form.error && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{form.error}</p>}
    {form.review ? <SubscriptionChangeReview preview={form.review.preview} mode={mode}
      items={reviewItems} pendingPayment={!!form.pendingChange}
      accepted={form.accepted} onAccept={form.setAccepted} busy={form.busy}
      onBack={() => form.setReview(null)} onConfirm={() => void form.confirm()} /> : <>
      <fieldset disabled={form.busy} className="min-w-0 space-y-6">
        {mode === "licenses" ? <section className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground"><Translate text={localizationConstants.subscriptionCurrentPlan} /></p>
          <p className="mt-2 font-semibold uppercase">{form.base.subscription_plan.plan_key}</p>
          <p className="mt-1 text-sm"><Translate text={form.interval === "yearly"
            ? localizationConstants.managePlansPaymentOptionYear : form.interval === "quarterly"
            ? localizationConstants.managePlansPaymentOptionQuarter : localizationConstants.managePlansPaymentOptionMonth} /></p>
        </section> : <section className="grid items-start gap-6 rounded-xl border border-border bg-card p-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <div className="space-y-2">
            <Label htmlFor="subscription-base-plan"><Translate text={localizationConstants.subscriptionItemPlan} /></Label>
            <Select value={form.baseId} onValueChange={form.setBaseId} disabled={form.busy}>
              <SelectTrigger id="subscription-base-plan" className="h-11 w-full"><SelectValue /></SelectTrigger>
              <SelectContent>{bases.map(plan => <SelectItem key={plan.id} value={plan.id}>{plan.plan_key.toUpperCase()}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <PaymentOptionSelector value={paymentOption} onValueChange={value => form.setInterval(PAYMENT_INTERVALS[value])} />
        </section>}
        <SubscriptionLicenseFields current={current} plans={plans} mode={mode} interval={form.interval}
          quantities={form.quantities} onChange={(id, quantity) => form.setQuantities(prev => ({ ...prev, [id]: quantity }))} />
        {mode === "subscription" && <p className="text-sm text-muted-foreground"><Translate text={localizationConstants.subscriptionQuantityHelp} /></p>}
      </fieldset>
      <div className="flex justify-end">
        <Button variant="primary" className="h-auto min-h-11 w-full whitespace-normal sm:w-auto" disabled={form.busy} onClick={() => void form.preview()}>
          {form.busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Translate text={localizationConstants.subscriptionReviewChanges} />
        </Button>
      </div>
    </>}
  </div>;
}

export function SubscriptionChangeEditor({ mode }: { mode: SubscriptionChangeMode }) {
  const query = useQuery({ queryKey: SUBSCRIPTION_EDITOR_QUERY_KEY, queryFn: loadSubscriptionEditor,
    refetchOnWindowFocus: false, staleTime: 0 });
  const current = query.data?.current;
  const allowed = current?.stripe_subscription_id && ["active", "trialing"].includes(current.stripe_subscription_status)
    && current.items.some(item => !item.subscription_plan.is_license);
  return <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 md:py-8">
    <header className="space-y-3">
      <Link className="inline-flex min-h-11 items-center text-sm text-muted-foreground underline underline-offset-4" href={SUBSCRIPTION_EDITOR_PATHS.overview}>
        <Translate text={localizationConstants.subscriptionReturn} />
      </Link>
      <h1 className="text-2xl font-semibold"><Translate text={mode === "licenses" ? localizationConstants.subscriptionAddLicenses : localizationConstants.subscriptionEditTitle} /></h1>
      <p className="max-w-3xl text-sm leading-6 text-muted-foreground"><Translate text={mode === "licenses" ? localizationConstants.subscriptionAddHint : localizationConstants.subscriptionEditHint} /></p>
    </header>
    {query.isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : query.isError
      ? <div role="alert" className="space-y-3"><p><Translate text={localizationConstants.subscriptionLoadFailed} /></p><Button variant="outline" onClick={() => void query.refetch()}><Translate text={localizationConstants.retry} /></Button></div>
      : !allowed || !current ? <p role="alert"><Translate text={localizationConstants.subscriptionChangeUnavailable} /></p>
      : <EditorForm key={`${mode}:${current.stripe_subscription_id}`} current={current} plans={query.data!.plans} mode={mode} />}
  </main>;
}
