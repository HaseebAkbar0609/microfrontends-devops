"use client";
import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslate } from "@/utils/translation/translate";
import type { ArchivePolicy, WorkflowContext, Write } from "./types";

export function localDateTime(value: number | null) {
  if (value === null) return "";
  const date = new Date(value);
  return new Date(value - date.getTimezoneOffset() * 60000).toISOString().slice(0,16);
}
export function ArchivePolicyForm({ context, busy, run }: { context: WorkflowContext; busy: boolean; run: (write: Write) => Promise<unknown> }) {
  const t = useTranslate();
  const policy = context.archive?.policy;
  const [immediate, setImmediate] = useState(policy?.allow_immediate || false);
  const [after, setAfter] = useState(localDateTime(policy?.restore_after ?? null));
  const [before, setBefore] = useState(localDateTime(policy?.restore_before ?? null));
  const [invalid, setInvalid] = useState(false);
  return <form className="space-y-4" onSubmit={async event => {
    event.preventDefault();
    const draft: ArchivePolicy = { allow_immediate: immediate, restore_after: after ? new Date(after).getTime() : null, restore_before: before ? new Date(before).getTime() : null };
    if ((draft.restore_after !== null && (!Number.isFinite(draft.restore_after) || draft.restore_after < 0)) ||
      (draft.restore_before !== null && (!Number.isFinite(draft.restore_before) || draft.restore_before < 0)) ||
      (draft.restore_after !== null && draft.restore_before !== null && draft.restore_after > draft.restore_before)) { setInvalid(true); return; }
    try { await run({ flow: "archive", policy: draft }); setInvalid(false); } catch { /* Keep the policy available for correction. */ }
  }}>
    <fieldset disabled={busy} className="space-y-4">
      <legend className="mb-3 text-sm font-semibold">{t("dwPolicy")}</legend>
      <label className="flex min-h-11 items-center gap-3"><Checkbox aria-label={t("dwImmediate")} checked={immediate} onCheckedChange={checked => setImmediate(checked === true)} /><span className="text-sm">{t("dwImmediate")}</span></label>
      <div className="grid min-w-0 gap-4 sm:grid-cols-2">
        {[["workflow-after", "dwAfter", after, setAfter], ["workflow-before", "dwBefore", before, setBefore]].map(([id, key, value, set]) => <div key={String(id)} className="min-w-0 space-y-2">
          <Label htmlFor={String(id)}>{t(String(key))}</Label>
          <Input id={String(id)} type="datetime-local" value={String(value)} onChange={event => { (set as (value: string) => void)(event.target.value); setInvalid(false); }} aria-invalid={invalid} className="w-full min-w-0" />
        </div>)}
      </div>
      {invalid && <p role="alert" className="text-sm text-red-700">{t("dwWindowInvalid")}</p>}
      <Button className="min-h-11" type="submit"><Save aria-hidden />{t("proAdminSave")}</Button>
    </fieldset>
  </form>;
}
