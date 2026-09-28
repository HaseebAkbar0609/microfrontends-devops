"use client";
import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslate } from "@/utils/translation/translate";
import type { ApprovalPolicy, WorkflowContext, Write } from "./types";

export function ApprovalPolicyForm({ context, busy, run }: { context: WorkflowContext; busy: boolean; run: (write: Write) => Promise<unknown> }) {
  const t = useTranslate();
  const [draft, setDraft] = useState<ApprovalPolicy>(() => context.approval?.policy || {
    approver_ids: [], required_approvals: 1, allow_self_approval: false, publish_on_approval: false,
  });
  const [required, setRequired] = useState(String(draft.required_approvals));
  const [invalid, setInvalid] = useState(false);
  const eligible = new Set(context.eligible_approvers.map(person => person.id));
  return <form className="space-y-4" onSubmit={async event => {
    event.preventDefault();
    const count = Number(required);
    const ids = draft.approver_ids.filter(id => eligible.has(id));
    if (!Number.isInteger(count) || count < 1 || count > 20 || ids.length < count) { setInvalid(true); return; }
    try { await run({ flow: "approval", policy: { ...draft, approver_ids: ids, required_approvals: count } }); setInvalid(false); } catch { /* The shared workflow error retains this draft. */ }
  }}>
    <fieldset disabled={busy} className="space-y-4">
      <legend className="mb-3 text-sm font-semibold">{t("dwSettings")}</legend>
      <div className="space-y-2">
        <Label>{t("dwReviewers")}</Label>
        <div className="max-h-44 space-y-1 overflow-y-auto rounded-md border border-slate-200 p-2">
          {context.eligible_approvers.length ? context.eligible_approvers.map(person => <label key={person.id} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-slate-50">
            <Checkbox aria-label={person.name} checked={draft.approver_ids.includes(person.id)} onCheckedChange={checked => {
              setDraft(value => ({ ...value, approver_ids: checked ? [...value.approver_ids.filter(id => id !== person.id), person.id] : value.approver_ids.filter(id => id !== person.id) })); setInvalid(false);
            }} />
            <span className="min-w-0 break-words text-sm">{person.name}</span>
          </label>) : <p className="p-2 text-sm text-slate-500">{t("dwNoReviewers")}</p>}
        </div>
      </div>
      <div className="max-w-xs space-y-2"><Label htmlFor="workflow-quorum">{t("dwRequiredApprovals")}</Label>
        <Input id="workflow-quorum" type="number" inputMode="numeric" min={1} max={20} value={required} onChange={event => { setRequired(event.target.value); setInvalid(false); }} aria-invalid={invalid} />
      </div>
      <label className="flex min-h-11 items-center gap-3"><Checkbox aria-label={t("dwAllowSelf")} checked={draft.allow_self_approval} onCheckedChange={checked => setDraft(value => ({ ...value, allow_self_approval: checked === true }))} />
        <span className="text-sm">{t("dwAllowSelf")}</span></label>
      {invalid && <p role="alert" className="text-sm text-red-700">{t("dwReviewersRequired")}</p>}
      <Button className="min-h-11" type="submit"><Save aria-hidden />{t("proAdminSave")}</Button>
    </fieldset>
  </form>;
}
