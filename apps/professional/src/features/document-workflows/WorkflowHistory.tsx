"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { useAuthStatus } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslate } from "@/utils/translation/translate";
import { getHistory } from "./api";
import { commandKeys, stateKeys, WORKFLOW_PAGE_SIZE } from "./labels";
import type { Command, Flow, Target, WorkflowContext } from "./types";
import { WorkflowStatus } from "./WorkflowStatus";

export function WorkflowHistory({ target, context }: { target: Target; context: WorkflowContext }) {
  const t = useTranslate();
  const { company } = useAuthStatus();
  const [flow, setFlow] = useState<Flow>("approval");
  const [page, setPage] = useState(1);
  const query = useQuery({ queryKey: ["document-workflow-history", company?.id, context.actor_id, target.projectId, target.id, flow, page],
    queryFn: () => getHistory(target, flow, page), enabled: !!context[flow], retry: false });
  return <div className="space-y-4">
    <Tabs value={flow} onValueChange={value => { setFlow(value as Flow); setPage(1); }}>
      <TabsList className="h-11"><TabsTrigger className="h-11" value="approval">{t("dwApproval")}</TabsTrigger><TabsTrigger className="h-11" value="archive">{t("dwArchive")}</TabsTrigger></TabsList>
    </Tabs>
    {query.isFetching ? <p role="status" className="text-sm">{t("genericLoading")}</p> : query.isError ? <div role="alert" className="space-y-2">
      <p className="text-sm text-red-700">{t("dwLoadError")}</p><Button variant="outline" onClick={() => void query.refetch()}><RefreshCw aria-hidden />{t("retry")}</Button>
    </div> : !query.data?.items.length ? <p className="py-4 text-sm text-slate-500">{t("dwNoHistory")}</p> : <ol className="divide-y divide-slate-200">
      {query.data.items.map(event => <li key={event.id} className="space-y-2 py-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <span className="text-sm font-semibold">{t(event.command === "create" ? "dwCreate" : event.command === "configure" ? "dwConfigure" : commandKeys[event.command as Command] || "dwHistory")}</span>
          <time className="text-xs text-slate-500" dateTime={new Date(event.occurred_at).toISOString()}>{new Date(event.occurred_at).toLocaleString()}</time>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm"><span className="text-slate-500">{event.previous_state ? t(stateKeys[event.previous_state] || "dwNoWorkflow") : t("dwNoWorkflow")}</span><ChevronRight className="h-4 w-4" aria-hidden /><WorkflowStatus state={event.new_state} /></div>
        <p className="break-words text-xs text-slate-500">{t("dwActor")}: {context.eligible_approvers.find(person => person.id === event.actor_id)?.name || `${t("dwUnknownActor")} ${event.actor_id.slice(0,8)}`}</p>
        {event.reason && <p className="whitespace-pre-wrap break-words text-sm">{event.reason}</p>}
      </li>)}
    </ol>}
    {(query.data?.total || 0) > WORKFLOW_PAGE_SIZE && <div className="flex items-center justify-between border-t pt-3">
      <Button className="h-11 w-11" variant="outline" size="icon" aria-label={t("proAdminPrevious")} disabled={page === 1 || query.isFetching} onClick={() => setPage(value => value-1)}><ChevronLeft /></Button>
      <span className="text-sm">{page} / {Math.ceil((query.data?.total || 0) / WORKFLOW_PAGE_SIZE)}</span>
      <Button className="h-11 w-11" variant="outline" size="icon" aria-label={t("proAdminNext")} disabled={page * WORKFLOW_PAGE_SIZE >= (query.data?.total || 0) || query.isFetching} onClick={() => setPage(value => value+1)}><ChevronRight /></Button>
    </div>}
  </div>;
}
