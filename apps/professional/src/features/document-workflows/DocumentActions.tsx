import { ClipboardCheck, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslate } from "@/utils/translation/translate";
import type { UploadedProjectDocument } from "@/features/project/services/projectDocumentService";

export function DocumentActions({ document, open }: { document: UploadedProjectDocument; open: () => void }) {
  const t = useTranslate();
  return <div className="flex shrink-0 items-center justify-end gap-1">
    {document.fileUrl && <Tooltip><TooltipTrigger asChild><a href={document.fileUrl} target="_blank" rel="noopener noreferrer"
      aria-label={`${t("projectListOpen")} ${document.fileName}`} className="inline-flex h-11 w-11 items-center justify-center rounded-md hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-slate-900">
      <ExternalLink className="h-4 w-4" aria-hidden />
    </a></TooltipTrigger><TooltipContent>{t("projectListOpen")}</TooltipContent></Tooltip>}
    <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-11 w-11" aria-label={`${t("dwTitle")} ${document.fileName}`} onClick={open}><ClipboardCheck className="h-4 w-4" aria-hidden /></Button></TooltipTrigger>
      <TooltipContent>{t("dwTitle")}</TooltipContent></Tooltip>
  </div>;
}
