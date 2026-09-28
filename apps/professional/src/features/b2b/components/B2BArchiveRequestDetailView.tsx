"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Archive as ArchiveIcon, ChevronUp, Loader2, Map, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { getProjectMarketDetailAction } from "@/api-actions/b2b/projectMarket";
import type { ProjectMarketDetail } from "../types/projectMarket";
import { ProjectMarketInfoTab } from "./ProjectMarketInfoTab";
import { ArchivedQACard } from "./B2BArchiveOfferDetailView";

interface Props {
  /** Fetched in the browser, where the access token lives — never on the server. */
  projectId: string;
}

/**
 * "View inquiry" in the Archive — the client's original request: who the
 * customer is, what the project is, where and when, and the files they attached.
 *
 * Both Archive buttons used to open the same offer screen, so the request itself
 * was never shown anywhere in the Archive. This reuses the Overview's request
 * data (`GET /professionals/b2b/project-market/{id}`, which also serves archived
 * engagements) and its "Project information" layout — read-only, since the
 * engagement is archived.
 */
export function B2BArchiveRequestDetailView({ projectId }: Props) {
  const t = useTranslate();
  const router = useRouter();
  const [qaOpen, setQaOpen] = useState(true);
  const [data, setData] = useState<ProjectMarketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    const result = await getProjectMarketDetailAction(projectId);
    if (result.success && result.data) {
      setData(result.data);
    } else {
      setLoadError(result.error || t(localizationConstants.genericError));
    }
    setLoading(false);
  }, [projectId, t]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (isMounted) await fetchDetail();
    })();
    return () => {
      isMounted = false;
    };
  }, [fetchDetail]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center bg-slate-50">
        <Loader2 className="h-5 w-5 animate-spin text-slate-400" aria-hidden={true} />
      </div>
    );
  }

  if (loadError || !data) {
    return (
      <div className="flex min-h-screen flex-1 flex-col items-center justify-center gap-3 bg-slate-50 px-4 text-center">
        <p className="text-sm text-slate-500">{loadError}</p>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => fetchDetail()} className="cursor-pointer">
            {t(localizationConstants.retry)}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => router.push("/module/business/b2b/archive")}
            className="cursor-pointer"
          >
            {t(localizationConstants.goBackButton)}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      {/* Header — back arrow + title */}
      <div className="flex items-center gap-3 px-4 py-4">
        <button
          type="button"
          aria-label={t(localizationConstants.goBackButton)}
          onClick={() => router.back()}
          className="flex h-8 w-8 cursor-pointer items-center justify-center text-slate-700 hover:text-slate-950"
        >
          <ArrowLeft size={20} aria-hidden={true} />
        </button>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
          {t(localizationConstants.b2bArchiveViewRequest)}
        </h1>
      </div>

      {/* Project heading */}
      <div className="flex flex-wrap items-center gap-2 px-4 sm:px-6 md:px-11">
        <span className="text-base font-semibold text-slate-900">{data.title}</span>
        <span className="rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-xs font-medium text-zinc-700">
          {data.refNr}
        </span>
        {data.city && (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
            <Map size={10} aria-hidden={true} />
            {data.city}
          </span>
        )}
        {data.municipality && (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
            <MapPin size={10} aria-hidden={true} />
            {data.municipality}
          </span>
        )}
      </div>

      <div className="mx-4 mt-3 flex items-start gap-2 rounded-lg border border-slate-200 bg-white p-3 sm:mx-6 md:mx-11">
        <ArchiveIcon size={16} className="mt-0.5 shrink-0 text-slate-500" aria-hidden={true} />
        <p className="text-xs text-slate-600">{t(localizationConstants.b2bArchivedDetailNote)}</p>
      </div>

      {/* Customer info, project description, documents — the Overview's layout */}
      <ProjectMarketInfoTab data={data} />

      {/* Q&A — read-only history */}
      <div className="flex flex-col gap-3 px-4 pb-10 sm:px-6 md:px-11">
        <button
          type="button"
          onClick={() => setQaOpen((prev) => !prev)}
          className="flex cursor-pointer items-center justify-between"
        >
          <span className="text-sm font-semibold text-zinc-900">{t(localizationConstants.b2bPMTabQA)}</span>
          <div className="flex items-center gap-2">
            {data.qa.length > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-xs font-semibold text-white">
                {data.qa.length}
              </span>
            )}
            <ChevronUp
              size={16}
              className={`text-slate-400 transition-transform duration-200 ${qaOpen ? "" : "rotate-180"}`}
              aria-hidden={true}
            />
          </div>
        </button>
        {qaOpen &&
          (data.qa.length > 0 ? (
            data.qa.map((msg) => <ArchivedQACard key={msg.id} message={msg} />)
          ) : (
            <p className="text-xs text-slate-500">—</p>
          ))}
      </div>
    </div>
  );
}
