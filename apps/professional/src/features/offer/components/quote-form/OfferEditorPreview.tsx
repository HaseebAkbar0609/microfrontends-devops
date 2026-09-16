"use client";
import { ModalWrapper } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { OfferFields, OfferMedia } from "../../services/offerFormService";
type Props = { open: boolean; close: () => void; fields: OfferFields; media: OfferMedia[]; confirm: boolean; send: () => void; busy: boolean; error: string | null };
export function OfferEditorPreview({ open, close, fields, media, confirm, send, busy, error }: Props) {
  const t = useTranslate();
  const rows = [
    ["offerFormWorkLocation", fields.work_location], ["offerFormSpecifications", fields.specifications],
    ["offerFormPersonnel", fields.personnel], ["offerFormHourlyRateLabel", fields.hourly_rate],
    ["offerFormWork", fields.work], ["offerFormMaterial", fields.material],
    ["offerFormStartDate", fields.start], ["offerFormEndDate", fields.end],
    ["offerFormPaymentTerms", fields.payment_terms],
  ];
  return <ModalWrapper open={open} onOpenChange={(next) => { if (!next && !busy) close(); }} title={t(localizationConstants.offerFormViewOffer)}
    footer={<div className="flex flex-wrap justify-end gap-3"><Button variant="outline" disabled={busy} onClick={close}>{t(localizationConstants.offerEditorBack)}</Button>
      {confirm && <Button disabled={busy} onClick={send}>{t(busy ? localizationConstants.offerEditorSaving : localizationConstants.offerFormSendOffer)}</Button>}</div>}>
    <div className="max-h-[60vh] space-y-4 overflow-y-auto break-words pr-2">
      <h3 className="text-lg font-semibold">{fields.project_name}</h3>
      <p className="text-xl font-semibold">{fields.total} SEK</p>
      <p className="text-sm text-slate-600">{t(localizationConstants.offerEditorPriceHelp)}</p>
      {rows.filter(([, value]) => value).map(([key, value]) => <div key={key}><p className="text-sm font-medium">{t(key as keyof typeof localizationConstants)}</p><p className="whitespace-pre-wrap text-sm text-slate-600">{value}</p></div>)}
      {fields.rot && <p>{t(localizationConstants.offerFormRotDeduction)}</p>}
      {media.length > 0 && <ul>{media.map((file) => <li key={file.media_id}>{file.file_name}</li>)}</ul>}
      {error && <p role="alert" className="text-sm text-red-700">{t(error as keyof typeof localizationConstants)}</p>}
    </div>
  </ModalWrapper>;
}
