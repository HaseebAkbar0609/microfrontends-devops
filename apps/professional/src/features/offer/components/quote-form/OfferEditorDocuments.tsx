"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { uploadOfferFile, resolveOfferMediaUrl, type OfferMedia } from "../../services/offerFormService";
type Props = { media: OfferMedia[]; change: (media: OfferMedia[]) => void; busy: boolean; setBusy: (busy: boolean) => void; disabled: boolean };
export function OfferEditorDocuments({ media, change, busy, setBusy, disabled }: Props) {
  const t = useTranslate();
  const [error, setError] = useState(false);
  async function upload(file?: File) {
    if (!file || busy || disabled) return;
    setError(false); setBusy(true);
    try { change([...media, await uploadOfferFile(file)]); } catch { setError(true); } finally { setBusy(false); }
  }
  return <Card className="min-w-0 space-y-3 p-5 shadow-none">
    <label htmlFor="offer-upload" className="block font-semibold">{t(localizationConstants.offerFormUploadFiles)}</label>
    <input id="offer-upload" type="file" accept=".png,.jpg,.jpeg,.pdf" disabled={busy || disabled} className="block w-full min-w-0 max-w-full text-sm file:mr-3 file:rounded-md file:border file:border-slate-200 file:bg-slate-50 file:px-3 file:py-2" onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ""; void upload(file); }} />
    <p className="text-sm text-slate-600">{t(localizationConstants.offerEditorUploadHelp)}</p>
    {busy && <p role="status">{t(localizationConstants.offerEditorUploading)}</p>}
    {error && <p role="alert" className="text-sm text-red-700">{t(localizationConstants.offerEditorUploadError)}</p>}
    <ul className="space-y-2">{media.map((file) => <li key={file.media_id} className="flex min-w-0 items-center justify-between gap-2 text-sm">
      {resolveOfferMediaUrl(file.file_url, process.env.NEXT_PUBLIC_API_URL) ? <a href={resolveOfferMediaUrl(file.file_url, process.env.NEXT_PUBLIC_API_URL)} target="_blank" rel="noopener noreferrer" className="min-w-0 break-all underline">{file.file_name}</a> : <span className="min-w-0 break-all">{file.file_name}</span>}
      {!disabled && <Button type="button" variant="outline" disabled={busy} onClick={() => change(media.filter((item) => item.media_id !== file.media_id))}>{t(localizationConstants.offerEditorRemoveAttachment)}</Button>}
    </li>)}</ul>
  </Card>;
}
