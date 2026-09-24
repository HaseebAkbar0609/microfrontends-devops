"use client";

import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { loadStripe } from "@stripe/stripe-js";
import { authStorage } from "@/lib/authStorage";
import { useQueryParams } from "@/hooks/useQueryParams";
import { COMMISSIONS_QUERY_KEY, listCommissions, recoverCommission } from "../services/commissionService";

export function useCommissions() {
  const { query: params } = useQueryParams();
  const requested = params.get("commission");
  const commissionId = requested && /^[0-9a-f-]{36}$/i.test(requested) ? requested : undefined;
  const company = authStorage.getCompanyData() as { id?: string } | null;
  const companyId = company?.id ?? "";
  const [busyId, setBusyId] = useState<string | null>(null);
  const [recoveryError, setRecoveryError] = useState(false);
  const recovering = useRef(false);
  const query = useQuery({
    queryKey: [COMMISSIONS_QUERY_KEY, companyId, commissionId],
    queryFn: () => listCommissions(companyId, commissionId),
    enabled: Boolean(companyId),
    retry: false,
    refetchOnWindowFocus: true,
  });

  async function recover(id: string) {
    if (recovering.current) return;
    recovering.current = true; setBusyId(id); setRecoveryError(false);
    try {
      const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      const stripe = key ? await loadStripe(key) : null;
      if (!stripe) throw new Error("STRIPE_UNAVAILABLE");
      const result = await recoverCommission(id);
      if (result.client_secret) {
        const confirmation = await stripe.confirmCardPayment(result.client_secret);
        if (confirmation.error || confirmation.paymentIntent?.status !== "succeeded") {
          throw new Error("COMMISSION_PAYMENT_PENDING");
        }
        // Reconcile the SAME intent; a browser success is not the payment ledger.
        await recoverCommission(id);
      }
    } catch { setRecoveryError(true); }
    finally {
      await query.refetch();
      recovering.current = false; setBusyId(null);
    }
  }

  return { ...query, companyId, busyId, recoveryError, recover };
}
