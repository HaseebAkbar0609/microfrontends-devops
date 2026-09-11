"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { OfferFormCompanySection } from "../OfferFormCompanySection";
import { OfferSendCustomerDetails } from "../OfferSendCustomerDetails";
import { OfferEditorFields } from "./OfferEditorFields";
import { OfferEditorDocuments } from "./OfferEditorDocuments";
import { OfferEditorPreview } from "./OfferEditorPreview";
import { initialOfferFields, validateOffer, buildOfferPayload, saveOffer, type OfferContext, type OfferVariant, type OfferErrors } from "../../services/offerFormService";

type Props = { context: OfferContext; variant: OfferVariant };
export function OfferEditorPage({ context, variant }: Props) {
  const t = useTranslate();
  const router = useRouter();
  const [fields, setFields] = useState(() => initialOfferFields(context, variant));
  const [quote, setQuote] = useState(context.quote);
  const [media, setMedia] = useState(context.quote?.media || []);
  const [errors, setErrors] = useState<OfferErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<"view" | "send" | null>(null);
  const submitting = useRef(false);
  const readOnly = !!quote && quote.professional_status !== "requested";
  function validate() {
    const next = validateOffer(fields); setErrors(next); setError(null);
    return Object.keys(next).length === 0;
  }
  async function submit(send: boolean) {
    if (submitting.current || uploading || readOnly || !validate()) return;
    submitting.current = true; setBusy(true); setSaved(false);
    try {
      const result = await saveOffer(buildOfferPayload(context.project.id, fields, media, send, quote));
      setQuote(result); setMedia(result.media || []);
      if (send) {
        if (result.professional_status !== "offered") throw new Error("OFFER_SAVE_UNCONFIRMED");
        router.push("/module/business/offer/quoted");
      } else setSaved(true);
    } catch (failure) {
      const code = (failure as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(code === "CANNOT_UPDATE_SENT_QUOTE" || code === "QUOTE_ALREADY_EXISTS_FOR_THIS_PROJECT" ? "offerEditorReload" : "offerEditorSaveError");
    } finally { submitting.current = false; setBusy(false); }
  }
  return <form className="min-w-0 space-y-5 p-4 md:p-6" onSubmit={(event) => { event.preventDefault(); if (validate() && !readOnly && !uploading && !busy) setPreview("send"); }}>
    <header className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-2xl font-semibold">{t(localizationConstants.offerEditorTitle)}</h1>
      <Button type="button" variant="outline" disabled={busy || uploading} onClick={() => router.push(readOnly ? "/module/business/offer/quoted" : "/module/business/offer/request")}>{t(localizationConstants.offerEditorBack)}</Button>
    </header>
    {readOnly && <p role="status" className="rounded-lg bg-slate-100 p-4">{t(localizationConstants.offerEditorSent)}</p>}
    {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{t(error as keyof typeof localizationConstants)}</p>}
    {saved && <p role="status" className="rounded-lg bg-emerald-50 p-4 text-emerald-800">{t(localizationConstants.offerEditorDraftSaved)}</p>}
    <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
      <div className="min-w-0 space-y-4">
        <div className="grid min-w-0 gap-4 md:grid-cols-2">
          <Card className="min-w-0 space-y-3 p-5 shadow-none"><h2 className="font-semibold">{t(localizationConstants.offerSendCustomerDetails)}</h2><OfferSendCustomerDetails customer={{ name: [context.customer.first_name, context.customer.last_name].filter(Boolean).join(" "), email: context.customer.email || "", phone: context.customer.phone || "", address: context.customer.address || "" }} /></Card>
          <Card className="min-w-0 space-y-3 p-5 shadow-none"><h2 className="font-semibold">{t(localizationConstants.offerFormCompanyNumber)}</h2><OfferFormCompanySection company={{ name: context.company.name, email: context.company.email || "", orgNumber: context.company.organization_number || "", phone: context.company.phone || "", address: context.company.address || "" }} /></Card>
        </div>
        <fieldset disabled={busy || uploading || readOnly} className="min-w-0 space-y-4">
          <OfferEditorFields value={fields} errors={errors} itemized={quote?.type === "itemized_breakdown"} update={(next) => { setFields((current) => ({ ...current, ...next })); setSaved(false); }} />
        </fieldset>
        <OfferEditorDocuments media={media} change={(next) => { setMedia(next); setSaved(false); }} busy={uploading} setBusy={setUploading} disabled={busy || readOnly} />
      </div>
      <aside className="min-w-0 self-start xl:sticky xl:top-6"><Card className="space-y-3 p-5 shadow-none">
        <Button className="w-full" type="button" variant="outline" disabled={busy || uploading} onClick={() => { if (validate()) setPreview("view"); }}>{t(localizationConstants.offerFormViewOffer)}</Button>
        {!readOnly && <><Button className="w-full" type="button" variant="outline" disabled={busy || uploading} onClick={() => void submit(false)}>{t(busy ? localizationConstants.offerEditorSaving : localizationConstants.offerEditorSaveDraft)}</Button>
          <Button className="w-full" type="submit" disabled={busy || uploading}>{t(busy ? localizationConstants.offerEditorSaving : localizationConstants.offerFormSendOffer)}</Button></>}
        <p className="text-sm text-slate-600">{t(localizationConstants.offerEditorSendHelp)}</p>
      </Card></aside>
    </div>
    <OfferEditorPreview open={preview !== null} close={() => setPreview(null)} fields={fields} media={media} confirm={preview === "send"} send={() => void submit(true)} busy={busy} error={error} />
  </form>;
}
