"use client";
import { useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslate } from "@/utils/translation/translate";
import { commandKeys, needsReason, REASON_LIMIT } from "./labels";
import type { Command, Flow, Write } from "./types";

export function WorkflowCommandForm({ flow, command, busy, cancel, run }: {
  flow: Flow; command: Command; busy: boolean; cancel: () => void; run: (write: Write) => Promise<unknown>;
}) {
  const t = useTranslate();
  const [reason, setReason] = useState("");
  const [invalid, setInvalid] = useState(false);
  return <form className="space-y-4 border-t border-slate-200 pt-4" onSubmit={async event => {
    event.preventDefault();
    if (needsReason(flow, command) && !reason.trim()) { setInvalid(true); return; }
    if (reason.length > REASON_LIMIT) { setInvalid(true); return; }
    try { await run({ flow, command, reason: reason.trim() }); cancel(); } catch { /* Keep the reason available for correction. */ }
  }}>
    <h3 className="text-sm font-semibold">{t(commandKeys[command])}</h3>
    <div className="space-y-2">
      <Label htmlFor="workflow-reason">{t("dwReason")}{needsReason(flow, command) && " *"}</Label>
      <Textarea id="workflow-reason" value={reason} onChange={event => { setReason(event.target.value); setInvalid(false); }}
        maxLength={REASON_LIMIT} disabled={busy} aria-invalid={invalid} className="min-h-24 resize-y" />
      {invalid && <p role="alert" className="text-sm text-red-700">{t(reason.length > REASON_LIMIT ? "dwReasonTooLong" : "dwReasonRequired")}</p>}
    </div>
    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
      <Button type="button" variant="outline" disabled={busy} onClick={cancel}><X aria-hidden />{t("closeButton")}</Button>
      <Button type="submit" disabled={busy}>{busy ? <Loader2 className="animate-spin" aria-hidden /> : <Check aria-hidden />}{t("dwConfirm")}</Button>
    </div>
  </form>;
}
