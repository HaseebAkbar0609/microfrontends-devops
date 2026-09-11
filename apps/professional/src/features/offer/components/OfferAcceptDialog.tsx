"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ModalWrapper } from "@/components/modal";
import { useTranslate } from "@/utils/translation/translate";
import l from "@/utils/translation/constants";
import { acceptOffer, previewOfferAcceptance, COMMISSIONS_QUERY_KEY, type AcceptancePreview, type AcceptanceResult } from "../services/commissionService";

interface Props {
  item: { projectId: string; quoteId: string; job: string };
  onClose: () => void;
  onAccepted: (result: AcceptanceResult) => void;
}

export function OfferAcceptDialog({ item, onClose, onAccepted }: Props) {
  const t = useTranslate();
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState<AcceptancePreview | null>(null);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const submitting = useRef(false);

  useEffect(() => {
    let cancelled = false;
    setPreview(null); setError(false);
    previewOfferAcceptance(item.projectId, item.quoteId)
      .then(result => { if (!cancelled) setPreview(result); })
      .catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, [item.projectId, item.quoteId, attempt]);

  async function confirm() {
    if (!preview || submitting.current) return;
    submitting.current = true; setBusy(true); setError(false);
    try {
      const result = await acceptOffer(item.projectId, item.quoteId);
      await queryClient.invalidateQueries({ queryKey: [COMMISSIONS_QUERY_KEY] });
      onAccepted(result);
    } catch { setError(true); }
    finally { submitting.current = false; setBusy(false); }
  }

  return <ModalWrapper open onOpenChange={open => { if (!open && !busy) onClose(); }}
    title={t(l.commissionAcceptTitle)} description={item.job}
    contentClassName="w-[calc(100%-2rem)] max-w-lg" showCloseButton={!busy}
    footer={<div className="flex flex-wrap justify-end gap-3">
      <Button variant="outline" disabled={busy} onClick={onClose}>{t(l.commissionCancel)}</Button>
      <Button disabled={!preview || busy} onClick={() => void confirm()}>
        {t(busy ? l.commissionProcessing : l.commissionAcceptConfirm)}
      </Button>
    </div>}>
    {error && <div role="alert" className="mb-4 text-sm text-red-700">
      <p>{t(l.commissionAcceptError)}</p>
      {!preview && <Button variant="outline" className="mt-2" onClick={() => setAttempt(value => value + 1)}>{t(l.commissionRefresh)}</Button>}
    </div>}
    {!preview && !error && <p role="status">{t(l.commissionLoading)}</p>}
    {preview && <div className="space-y-3 text-sm">
      <p>{t(preview.already_recorded ? l.commissionExistingFee : l.commissionAcceptDescription)}</p>
      <p className="text-2xl font-semibold tabular-nums">{new Intl.NumberFormat(undefined, { style: "currency", currency: preview.currency.toUpperCase() }).format(Number(preview.amount))}</p>
      {!preview.already_recorded && <p className="text-slate-600">{t(l.commissionCalculation, { percentage: preview.percentage, fixed: preview.fixed_fee_sek })}</p>}
      <p className="text-slate-600">{t(l.commissionAcceptanceSeparate)}</p>
    </div>}
  </ModalWrapper>;
}
