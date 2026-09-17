"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ExternalLink, RefreshCw, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { useMyPagesQuery } from "../../shared/api";
import { MyPagesQueryState } from "../../shared/feedback";
import { openDocument } from "../services/employmentService";

export default function ContractViewer() {
  const t = useTranslate();
  const id = useSearchParams().get("id");
  const query = useMyPagesQuery(["employment", "open", id], () => openDocument(id!), !!id);
  if (!id) return <p className="p-6"><Translate text={localizationConstants.myPagesNotFound} /></p>;
  return <div className="flex min-h-full flex-col">
    <div className="flex flex-wrap items-center gap-3 bg-slate-800 p-3 text-white">
      <Button asChild variant="ghost" size="icon" aria-label={t(localizationConstants.myPagesEmpBack)}><Link href="/tools/my-pages/employment"><ArrowLeft /></Link></Button>
      <span className="min-w-0 flex-1 break-words">{query.data?.fileName}</span>
      <Button type="button" variant="ghost" size="icon" disabled={query.isFetching} onClick={() => void query.refetch()} aria-label={t(localizationConstants.myPagesRetry)}><RefreshCw /></Button>
      {query.data && <a href={query.data.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm"><ExternalLink className="size-4" /><Translate text={localizationConstants.myPagesEmpOpenBadge} /></a>}
    </div>
    <MyPagesQueryState query={query} />
    {query.data && <div className="flex min-h-72 flex-col items-center justify-center gap-5 p-6">
      <FileText className="size-16 text-slate-500" aria-hidden="true" />
      <p className="max-w-full break-words text-center font-medium">{query.data.fileName}</p>
      <Button asChild><a href={query.data.url} target="_blank" rel="noopener noreferrer"><ExternalLink className="mr-2 size-4" /><Translate text={localizationConstants.myPagesEmpOpenBadge} /></a></Button>
    </div>}
  </div>;
}
