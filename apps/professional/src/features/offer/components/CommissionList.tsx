"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModalWrapper } from "@/components/modal";
import { useTranslate } from "@/utils/translation/translate";
import l from "@/utils/translation/constants";
import { useCommissions } from "../hooks/useCommissions";
import type { CommissionSummary } from "../services/commissionService";

const STATUS_KEYS: Record<string, string> = {
  paid: l.commissionPaid,
  unpaid: l.commissionUnpaid,
  failed: l.commissionFailed,
  pending_authentication: l.commissionAuthentication,
  processing: l.commissionProcessing,
  pending: l.commissionProcessing,
};

function amount(item: CommissionSummary) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: item.currency.toUpperCase() }).format(Number(item.amount));
}

export function CommissionList() {
  const t = useTranslate();
  const query = useCommissions();
  const [selected, setSelected] = useState<CommissionSummary | null>(null);
  return <section className="mx-auto w-full max-w-5xl space-y-5 p-4 md:p-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><h2 className="text-xl font-semibold">{t(l.commissionTitle)}</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">{t(l.commissionDescription)}</p></div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" disabled={query.isFetching || Boolean(query.busyId)} onClick={() => void query.refetch()}>{t(l.commissionRefresh)}</Button>
        <Button variant="outline" asChild><Link href="/admin/subscription?tab=payment">{t(l.commissionCards)}</Link></Button>
      </div>
    </div>
    {query.recoveryError && <p role="alert" className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">{t(l.commissionRecoveryError)}</p>}
    {query.isError || !query.companyId ? <p role="alert" className="text-sm text-red-700">{t(l.commissionLoadError)}</p>
      : query.isPending ? <p role="status">{t(l.commissionLoading)}</p>
      : !query.data?.length ? <p className="rounded-lg border p-6 text-slate-600">{t(l.commissionEmpty)}</p>
      : <ul className="space-y-3">{query.data.map(item => <li key={item.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4">
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-lg font-semibold tabular-nums">{amount(item)}</p>
          <p className="text-sm font-medium">{t(STATUS_KEYS[item.payment_status] ?? l.commissionProcessing)}</p>
          <p className="break-all text-xs text-slate-500">{t(l.commissionQuote)}: {item.quote_id}</p>
          {item.failure_code && <p className="text-sm text-slate-600">{t(l.commissionCardHelp)}</p>}
        </div>
        {item.can_recover && item.payment_status !== "paid" && <Button disabled={Boolean(query.busyId)} onClick={() => setSelected(item)}>
          {t(query.busyId === item.id ? l.commissionProcessing : l.commissionRecover)}
        </Button>}
      </li>)}</ul>}
    {selected && <ModalWrapper open onOpenChange={open => { if (!open) setSelected(null); }}
      title={t(l.commissionRecover)} description={t(l.commissionRecoveryDescription)}
      contentClassName="w-[calc(100%-2rem)] max-w-lg"
      footer={<div className="flex flex-wrap justify-end gap-3">
        <Button variant="outline" onClick={() => setSelected(null)}>{t(l.commissionCancel)}</Button>
        <Button onClick={() => { const id = selected.id; setSelected(null); void query.recover(id); }}>{t(l.commissionRecoverConfirm)}</Button>
      </div>}><p className="text-2xl font-semibold">{amount(selected)}</p></ModalWrapper>}
  </section>;
}
