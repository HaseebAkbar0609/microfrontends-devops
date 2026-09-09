"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { loadStripe } from "@stripe/stripe-js";
import type { ChangeSubscriptionResponse } from "@/api-actions/cart/subscriptions";
import type { ApiError } from "@/types/api";
import type { SubscriptionInterval, SubscriptionPlan } from "@/features/manage-plans/types";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { showToast } from "@/lib/toast";
import {
  applySubscriptionChange, previewSubscriptionChange, type CurrentSubscription,
  type SubscriptionChangeMode, type SubscriptionChangePreview, type SubscriptionChangeRequest,
} from "../services/subscriptionChangeService";
import { buildSubscriptionSelection, SUBSCRIPTION_EDITOR_PATHS, SUBSCRIPTION_EDITOR_QUERY_KEY } from "../services/subscriptionSelection";
import { SUBSCRIPTION_OVERVIEW_QUERY_KEY } from "./useSubscriptionOverview";

export function useSubscriptionChange(current: CurrentSubscription, plans: SubscriptionPlan[], mode: SubscriptionChangeMode) {
  const base = current.items.find(item => !item.subscription_plan.is_license)!;
  const [baseId, setBaseId] = useState(base.subscription_plan.id);
  const [interval, setInterval] = useState<SubscriptionInterval>(base.subscription_plan_price.interval);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [review, setReview] = useState<{ preview: SubscriptionChangePreview; request: SubscriptionChangeRequest } | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [pendingChange, setPendingChange] = useState<ChangeSubscriptionResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submitting = useRef(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslate();

  function errorText(err: unknown, applying: boolean) {
    const code = (err as ApiError).response?.data?.code ?? (err as Error).message;
    if (code === "SUBSCRIPTION_CHANGED_REFRESH") return t(localizationConstants.subscriptionRefreshRequired);
    if (code === "SUBSCRIPTION_PAYMENT_PENDING") return t(localizationConstants.subscriptionPaymentPending);
    if (code === "SUBSCRIPTION_SELECTION_INVALID") return t(localizationConstants.subscriptionSelectionInvalid);
    if (code === "ACTIVE_SUBSCRIPTION_REQUIRED") return t(localizationConstants.subscriptionChangeUnavailable);
    return t(applying ? localizationConstants.subscriptionUpdateFailed : localizationConstants.subscriptionPreviewFailed);
  }
  async function preview() {
    if (submitting.current) return;
    submitting.current = true; setBusy(true); setError(null); setAccepted(false);
    try {
      const request = buildSubscriptionSelection(current, plans, mode, baseId, interval, quantities);
      const calculated = await previewSubscriptionChange(request);
      setReview({ preview: calculated, request: { ...request,
        expected_revision: calculated.expected_revision, proration_date: calculated.proration_date } });
    } catch (err) { setError(errorText(err, false)); }
    finally { submitting.current = false; setBusy(false); }
  }
  async function confirm() {
    if (!review || !accepted || submitting.current || review.preview.change_type === "unchanged") return;
    submitting.current = true; setBusy(true); setError(null);
    try {
      // Load the confirmation client before starting a change that could need 3DS.
      const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      const stripe = key ? await loadStripe(key) : null;
      if (!stripe) throw new Error("STRIPE_UNAVAILABLE");
      const result = pendingChange ?? await applySubscriptionChange(review.request);
      if (result.client_secret) {
        setPendingChange(result);
        const confirmation = await stripe.confirmCardPayment(result.client_secret);
        if (confirmation.error || confirmation.paymentIntent?.status !== "succeeded") {
          throw new Error("SUBSCRIPTION_PAYMENT_PENDING");
        }
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_OVERVIEW_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_EDITOR_QUERY_KEY }),
      ]);
      showToast("success", t(result.change_type === "downgrade_scheduled"
        ? localizationConstants.manageCartChangeScheduled : localizationConstants.manageCartChangeSucceeded));
      router.replace(SUBSCRIPTION_EDITOR_PATHS.overview);
      router.refresh();
    } catch (err) {
      setError(errorText(err, true)); setAccepted(false);
    } finally { submitting.current = false; setBusy(false); }
  }
  return { base, baseId, setBaseId, interval, setInterval, quantities, setQuantities,
    review, setReview, accepted, setAccepted, pendingChange, busy, error, preview, confirm };
}
