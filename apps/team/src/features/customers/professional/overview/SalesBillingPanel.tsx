"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Loader2, Mail, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useTranslate } from "@/utils/translation/translate";
import c from "@/utils/translation/constants";
import { getBilling, getCatalog, sendInvoice, sendActivation, money, today, MAX_LICENSE_QUANTITY, type InvoiceRequest } from "./billingService";
import { BillingOverridePanel } from "./BillingOverridePanel";

export function SalesBillingPanel({ companyId }: { companyId: string }) {
  const t = useTranslate();
  const billing = useQuery({ queryKey: ["sales-billing", companyId], queryFn: () => getBilling(companyId) });
  const catalog = useQuery({ queryKey: ["sales-billing-catalog"], queryFn: getCatalog });
  const [priceId, setPriceId] = useState("");
  const [startDate, setStartDate] = useState(today);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [confirm, setConfirm] = useState<InvoiceRequest | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const bases = (catalog.data ?? []).filter(p => !p.is_license && p.plan_key !== "free");
  const base = bases.find(p => p.prices.some(v => v.id === priceId));
  const price = base?.prices.find(p => p.id === priceId);
  const addons = (catalog.data ?? []).filter(p => p.is_license).flatMap(p =>
    p.prices.filter(v => v.interval === price?.interval && v.is_active && v.price > 0).map(v => ({ plan: p, price: v })));
  const latest = billing.data?.orders[0];
  const total = (price?.price ?? 0) + addons.reduce((sum, a) => sum + a.price.price * (quantities[a.price.id] ?? 0), 0);
  async function act(action: () => Promise<unknown>, success: string) {
    setBusy(true); setMessage(""); setFailed(false);
    try { await action(); setMessage(success); setConfirm(null); }
    catch { setFailed(true); setMessage(t(c.billingError)); }
    finally { await billing.refetch(); setBusy(false); }
  }
  if (billing.isPending || catalog.isPending) return <Loader2 className="animate-spin" aria-label={t(c.billingRefresh)} />;
  if (billing.isError || catalog.isError) return <div role="alert" className="space-y-3 text-red-700">
    {t(c.billingLoadFailed)} <Button onClick={() => { void billing.refetch(); void catalog.refetch(); }}>{t(c.billingRefresh)}</Button>
  </div>;
  const data = billing.data;
  if (!data) return null;
  return <div className="max-w-4xl space-y-6">
    <div className="flex flex-wrap items-center gap-3">
      <p className="min-w-0 flex-1 break-all">{data.payer_email}</p>
      {data.needs_activation && <Button disabled={busy} variant="outline" onClick={() => void act(() => sendActivation(companyId), t(c.billingActivationSent))}><Mail size={16} />{t(c.billingActivate)}</Button>}
      <Button variant="outline" disabled={busy} onClick={() => void billing.refetch()}><RefreshCw size={16} />{t(c.billingRefresh)}</Button>
    </div>
    {message && <p role={failed ? "alert" : "status"} className={failed ? "text-red-700" : "text-emerald-700"}>{message}</p>}
    {latest ? <section className="space-y-2 border-y py-4">
      <p>{t(c.billingPending)}</p><p className="break-all">{latest.status} · {money(latest.amount, latest.currency)}</p>
      {latest.status === "pending" && <Button disabled={busy} onClick={() => setConfirm(latest.request)}>{t(c.billingCreate)}</Button>}
    </section> : <form className="space-y-4" onSubmit={event => {
      event.preventDefault();
      if (!base || !price) return;
      setConfirm({ start_date: startDate, items: [
        { subscription_plan_id: base.id, subscription_plan_price_id: price.id, quantity: 1 },
        ...addons.filter(a => quantities[a.price.id] > 0).map(a => ({ subscription_plan_id: a.plan.id, subscription_plan_price_id: a.price.id, quantity: quantities[a.price.id]! })),
      ] });
    }}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1">{t(c.billingPlan)}
          <select required value={priceId} onChange={e => { setPriceId(e.target.value); setQuantities({}); }} className="h-11 min-w-0 rounded border px-3">
            <option value="">{t(c.billingSelect)}</option>
            {bases.flatMap(p => p.prices.filter(v => v.is_active && v.price > 0).map(v => <option key={v.id} value={v.id}>{p.plan_key} · {v.interval} · {money(v.price)}</option>))}
          </select>
        </label>
        <label className="grid gap-1">{t(c.billingStartDate)}<input className="h-11 rounded border px-3" type="date" min={today()} value={startDate} onChange={e => setStartDate(e.target.value)} required /></label>
      </div>
      {!bases.length && <p>{t(c.billingNoCatalog)}</p>}
      {addons.map(a => <label key={a.price.id} className="flex flex-wrap items-center justify-between gap-2 border-b py-2">
        <span>{a.plan.plan_key} · {money(a.price.price)}</span>
        <input aria-label={a.plan.plan_key + " " + t(c.billingQuantity)} className="h-10 w-24 rounded border px-2" type="number" min={0} max={MAX_LICENSE_QUANTITY} step={1} value={quantities[a.price.id] ?? 0} onChange={e => setQuantities({ ...quantities, [a.price.id]: Number(e.target.value) })} />
      </label>)}
      <p className="font-semibold">{money(total)}</p>
      <Button type="submit" disabled={busy || !price}>{t(c.billingCreate)}</Button>
    </form>}
    <section className="space-y-3 border-t pt-5">
      <h2 className="font-semibold">{t(c.billingOpenInvoices)}</h2>
      {!data.invoices.length && <p>{t(c.billingEmpty)}</p>}
      {data.invoices.map(invoice => <div key={invoice.id} className="flex flex-wrap items-center justify-between gap-3 border-b py-3">
        <span className="break-all">{invoice.number || invoice.id} · {money(invoice.amount_due, invoice.currency)}</span>
        {invoice.hosted_invoice_url && <Button asChild variant="outline"><a href={invoice.hosted_invoice_url} target="_blank" rel="noopener noreferrer">{t(c.billingOpenInvoices)}<ExternalLink size={16} /></a></Button>}
      </div>)}
    </section>
    <BillingOverridePanel companyId={companyId} />
    <Dialog open={!!confirm} onOpenChange={open => { if (!open && !busy) setConfirm(null); }}>
      <DialogContent><DialogTitle>{t(c.billingConfirm)}</DialogTitle><DialogDescription>{t(c.billingTerms)}</DialogDescription>
        <p>{data.company_name} · {confirm?.start_date} · {money(latest?.amount ?? total, latest?.currency)}</p>
        {failed && message && <p role="alert" className="text-red-700">{message}</p>}
        <Button disabled={busy} onClick={() => confirm && void act(() => sendInvoice(companyId, confirm), t(c.billingSent))}>{busy && <Loader2 className="animate-spin" size={16} />}{t(c.billingCreate)}</Button>
        <Button variant="outline" disabled={busy} onClick={() => setConfirm(null)}>{t(c.billingCancel)}</Button>
      </DialogContent>
    </Dialog>
  </div>;
}
