"use client";
import { useState } from "react";
import { Archive, Check, ClipboardCheck, ExternalLink, History, RefreshCw, Settings2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslate } from "@/utils/translation/translate";
import { ApprovalPolicyForm } from "./ApprovalPolicyForm";
import { ArchivePolicyForm } from "./ArchivePolicyForm";
import { WorkflowHistory } from "./WorkflowHistory";
import { WorkflowCommandForm } from "./WorkflowCommandForm";
import { WorkflowStatus } from "./WorkflowStatus";
import { useDocumentWorkflow } from "./useDocumentWorkflow";
import { commandKeys, EDITABLE_APPROVAL, EDITABLE_ARCHIVE, workflowError } from "./labels";
import type { Command, Flow, Target } from "./types";

export function DocumentWorkflowDialog({ target, close }: { target: Target; close: () => void }) {
  const t = useTranslate();
  const { context, mutation } = useDocumentWorkflow(target);
  const [tab, setTab] = useState<Flow | "history">("approval");
  const [command, setCommand] = useState<Command | null>(null);
  const [settings, setSettings] = useState(false);
  const current = context.data;
  const busy = mutation.isPending;
  const changeTab = (value: string) => { setTab(value as Flow | "history"); setCommand(null); setSettings(false); mutation.reset(); };
  const flow = tab === "history" ? "approval" : tab;
  const workflow = current?.[flow];
  const editable = current?.can_manage && (!workflow || (flow === "approval" ? EDITABLE_APPROVAL : EDITABLE_ARCHIVE).includes(workflow.state));
  return <Dialog open onOpenChange={open => { if (!open && !busy) close(); }}>
    <DialogContent showCloseButton={false} className="max-h-[90dvh] min-w-0 w-[calc(100vw-2rem)] overflow-y-auto bg-white p-4 sm:max-w-2xl sm:p-6">
      <DialogHeader className="min-w-0 space-y-2 text-left">
        <div className="flex min-w-0 items-center justify-between gap-3"><DialogTitle className="text-lg">{t("dwTitle")}</DialogTitle>
          <Button className="h-11 w-11 shrink-0" size="icon" variant="ghost" aria-label={t("closeButton")} disabled={busy} onClick={close}><X /></Button>
        </div>
        <DialogDescription className="break-all pr-2 text-sm">{target.name}</DialogDescription>
        {target.fileUrl && <a href={target.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 w-fit items-center gap-2 text-sm text-primary underline-offset-4 hover:underline"><ExternalLink className="h-4 w-4" aria-hidden />{t("projectListOpen")}</a>}
      </DialogHeader>
      <Tabs value={tab} onValueChange={changeTab}><TabsList variant="line" className="h-11 max-w-full">
        <TabsTrigger className="h-11" value="approval" disabled={busy}><ClipboardCheck className="mr-2 h-4 w-4" aria-hidden />{t("dwApproval")}</TabsTrigger>
        <TabsTrigger className="h-11" value="archive" disabled={busy}><Archive className="mr-2 h-4 w-4" aria-hidden />{t("dwArchive")}</TabsTrigger>
        <TabsTrigger className="h-11" value="history" disabled={busy}><History className="mr-2 h-4 w-4" aria-hidden />{t("dwHistory")}</TabsTrigger>
      </TabsList></Tabs>
      {context.isLoading ? <p role="status" className="py-6 text-sm">{t("genericLoading")}</p> : context.isError || !current ? <div role="alert" className="space-y-3 py-4">
        <p className="text-sm text-red-700">{t("dwLoadError")}</p><Button variant="outline" onClick={() => void context.refetch()}><RefreshCw aria-hidden />{t("retry")}</Button>
      </div> : tab === "history" ? <WorkflowHistory target={target} context={current} /> : <div className="min-w-0 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3"><WorkflowStatus state={workflow?.state} />
            {flow === "approval" && current.approval && <span className="text-sm text-slate-500">{t("dwApprovalCount", { count: current.approved_count, required: current.approval.policy.required_approvals })}</span>}
          </div>
          {editable && <Button className="h-11 w-11" variant="ghost" size="icon" title={t(flow === "approval" ? "dwSettings" : "dwPolicy")} aria-label={t(flow === "approval" ? "dwSettings" : "dwPolicy")} disabled={busy} onClick={() => { setSettings(value => !value); setCommand(null); mutation.reset(); }}><Settings2 /></Button>}
        </div>
        {mutation.isError && <p role="alert" className="text-sm text-red-700">{t(workflowError(mutation.error))}</p>}
        {!workflow && !editable && <p className="text-sm text-slate-500">{t("dwReadOnly")}</p>}
        {editable && (settings || !workflow) && (flow === "approval" ? <ApprovalPolicyForm context={current} busy={busy} run={mutation.mutateAsync} /> : <ArchivePolicyForm context={current} busy={busy} run={mutation.mutateAsync} />)}
        {workflow && !command && <div className="flex flex-wrap gap-2">
          {current.allowed_commands[flow].map(action => <Button key={action} variant={action === "approve" || action === "submit" || action === "approve_restore" || action === "approve_archive" ? "default" : "outline"}
            className="h-auto min-h-11 max-w-full whitespace-normal text-left" disabled={busy} onClick={() => { setCommand(action); setSettings(false); mutation.reset(); }}><Check aria-hidden />{t(commandKeys[action])}</Button>)}
          {!current.allowed_commands[flow].length && <p className="text-sm text-slate-500">{t("dwReadOnly")}</p>}
        </div>}
        {command && <WorkflowCommandForm key={`${flow}-${command}`} flow={flow} command={command} busy={busy} run={mutation.mutateAsync} cancel={() => setCommand(null)} />}
      </div>}
    </DialogContent>
  </Dialog>;
}
