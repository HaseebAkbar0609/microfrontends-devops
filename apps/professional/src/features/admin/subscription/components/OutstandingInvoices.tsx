"use client";

import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslate } from "@/utils/translation/translate";
import c from "@/utils/translation/constants";
import { getOpenInvoices } from "../services/subscriptionService";

export function OutstandingInvoices({ onRefresh }: { onRefresh: () => void }) {
  const t = useTranslate();
  const query = useQuery({ queryKey: ["subscription-open-invoices"], queryFn: getOpenInvoices, refetchOnWindowFocus: "always" });
  return <section className="space-y-3 border-y border-slate-200 py-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="font-semibold">{t(c.subscriptionPayOutstanding)}</h2>
      <Button variant="outline" disabled={query.isFetching} onClick={() => { void query.refetch(); onRefresh(); }}><RefreshCw size={16} />{t(c.commissionRefresh)}</Button>
    </div>
    {query.isPending ? <Loader2 size={20} className="animate-spin" /> : query.isError
      ? <p role="alert" className="text-red-700">{t(c.subscriptionLoadFailed)}</p>
      : !query.data?.length ? <p className="text-sm text-slate-600">{t(c.billingNoDebt)}</p>
      : <><p className="text-sm text-slate-600">{t(c.billingAllDebt)}</p><ul>
        {query.data.map(invoice => <li key={invoice.id} className="flex flex-wrap items-center justify-between gap-3 border-b py-3">
          <span className="min-w-0 break-all">{invoice.number || invoice.id} · {new Intl.NumberFormat(undefined, { style: "currency", currency: invoice.currency }).format(invoice.amount_due / 100)}</span>
          {invoice.hosted_invoice_url ? <Button asChild variant="outline"><a href={invoice.hosted_invoice_url} target="_blank" rel="noopener noreferrer">{t(c.subscriptionPayOutstanding)}<ExternalLink size={16} /></a></Button>
            : <span className="text-sm text-slate-600">{t(c.billingInvoiceUnavailable)}</span>}
        </li>)}
      </ul></>}
  </section>;
}
