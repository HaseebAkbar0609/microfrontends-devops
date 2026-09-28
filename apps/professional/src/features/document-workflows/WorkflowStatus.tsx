import { Badge } from "@/components/ui/badge";
import { useTranslate } from "@/utils/translation/translate";
import { stateKeys } from "./labels";

export function WorkflowStatus({ state }: { state?: string | null }) {
  const t = useTranslate();
  const tone = state === "approved" || state === "restored" ? "border-emerald-200 bg-emerald-50 text-emerald-800" :
    state === "rejected" || state === "changes_requested" || state === "archive_rejected" ? "border-red-200 bg-red-50 text-red-800" :
    state === "in_review" || state === "submitted_for_approval" || state === "archive_requested" || state === "restore_requested" ? "border-amber-200 bg-amber-50 text-amber-800" : "border-slate-200 bg-slate-50 text-slate-600";
  return <Badge variant="outline" className={`max-w-full whitespace-normal rounded-md px-2 py-1 text-xs font-medium ${tone}`}>
    {t(state ? stateKeys[state] || "dwNoWorkflow" : "dwNoWorkflow")}
  </Badge>;
}
