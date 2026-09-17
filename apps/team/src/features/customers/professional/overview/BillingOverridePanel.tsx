"use client";

import { useState } from "react";
import { isAxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useTranslate } from "@/utils/translation/translate";
import c from "@/utils/translation/constants";
import { getOverrides, grantOverride, revokeOverride } from "./billingService";

export function BillingOverridePanel({ companyId }: { companyId: string }) {
  const t = useTranslate();
  const query = useQuery({ queryKey: ["billing-overrides", companyId], queryFn: () => getOverrides(companyId), retry: false });
  const [reason, setReason] = useState("");
  const [expiry, setExpiry] = useState("");
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  if (isAxiosError(query.error) && query.error.response?.status === 403) return null;
  const expiresAt = new Date(expiry).getTime();
  async function save() {
    if (!confirmation) return;
    setBusy(true); setError("");
    try {
      if (confirmation === "grant") await grantOverride(companyId, reason.trim(), expiresAt);
      else await revokeOverride(confirmation);
      setConfirmation(null); await query.refetch();
    } catch { setError(t(c.billingError)); }
    finally { setBusy(false); }
  }
  return <section className="space-y-3 border-t pt-5">
    <h2 className="font-semibold">{t(c.billingOverrides)}</h2>
    {(error || query.isError) && <p role="alert" className="text-red-700">{error || t(c.billingLoadFailed)}</p>}
    <form className="flex flex-wrap items-end gap-3" onSubmit={e => { e.preventDefault(); setConfirmation("grant"); }}>
      <label className="grid flex-1 gap-1">{t(c.billingReason)}<input required minLength={5} maxLength={1000} value={reason} onChange={e => setReason(e.target.value)} className="h-11 min-w-0 rounded border px-3" /></label>
      <label className="grid gap-1">{t(c.billingExpiry)}<input required type="datetime-local" value={expiry} onChange={e => setExpiry(e.target.value)} className="h-11 rounded border px-3" /></label>
      <Button disabled={busy || query.isError || query.isPending || reason.trim().length < 5 || !(expiresAt > Date.now())}>{t(c.billingGrant)}</Button>
    </form>
    {(query.data ?? []).map(row => <div className="flex flex-wrap items-center justify-between gap-3 border-b py-3" key={row.id}>
      <span className="min-w-0 flex-1 break-words">{row.reason} · {new Date(row.expires_at).toLocaleString()}</span>
      {!row.revoked_at && row.expires_at > Date.now() && <Button disabled={busy} variant="outline" onClick={() => setConfirmation(row.id)}>{t(c.billingRevoke)}</Button>}
    </div>)}
    <Dialog open={!!confirmation} onOpenChange={open => { if (!open && !busy) setConfirmation(null); }}>
      <DialogContent><DialogTitle>{t(c.billingOverrides)}</DialogTitle><DialogDescription>{confirmation === "grant" ? reason : t(c.billingRevoke)}</DialogDescription>
        <Button disabled={busy} onClick={() => void save()}>{t(confirmation === "grant" ? c.billingGrant : c.billingRevoke)}</Button>
        <Button disabled={busy} variant="outline" onClick={() => setConfirmation(null)}>{t(c.billingCancel)}</Button>
      </DialogContent>
    </Dialog>
  </section>;
}
