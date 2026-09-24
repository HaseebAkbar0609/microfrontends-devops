"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { ProjectMarketDetail } from "../types/projectMarket";
import { getProjectMarketDetailAction } from "@/api-actions/b2b/projectMarket";
import { ProjectMarketOfferTab } from "./ProjectMarketOfferTab";
import { ProjectMarketInfoTab } from "./ProjectMarketInfoTab";
import { ProjectMarketQATab } from "./ProjectMarketQATab";

interface Props {
  projectId: string;
}

export function B2BProjectMarketDetailView({ projectId }: Props) {
  const t = useTranslate();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"offers" | "project-info" | "qa">("offers");
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
      <div className="flex min-h-screen flex-1 items-center justify-center bg-white">
        <Loader2 className="h-5 w-5 animate-spin text-slate-400" aria-hidden={true} />
      </div>
    );
  }

  if (loadError || !data) {
    return (
      <div className="flex min-h-screen flex-1 flex-col items-center justify-center gap-3 bg-white px-4 text-center">
        <p className="text-sm text-slate-500">{loadError}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fetchDetail()}
          className="cursor-pointer"
        >
          {t(localizationConstants.retry)}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-slate-50 min-h-full">
      {/* Subheader with Back Button */}
      <div className="flex shrink-0 items-center gap-2 px-4 pt-6 pb-6">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={t(localizationConstants.goBackButton)}
          onClick={() => router.push("/module/business/b2b/overview")}
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-slate-900 hover:bg-slate-200/60 transition-colors p-0"
        >
          <ArrowLeft size={18} aria-hidden={true} />
        </Button>
        <h2 className="text-lg font-bold tracking-tight text-slate-900">
          <Translate text={localizationConstants.b2bPMViewProjectMarket} />
        </h2>
      </div>

      {/* Sub Tabs — shrink-0 ensures it is always visible and never collapses */}
      <div className="w-full shrink-0 overflow-x-auto scrollbar-none pl-4 sm:pl-6 md:pl-11 pr-4 sm:pr-5 md:pr-6">
        <div className="inline-flex min-w-max items-center gap-4 sm:gap-5 border-b border-slate-200">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setActiveTab("offers")}
            className={cn(
              "h-auto cursor-pointer whitespace-nowrap px-3 sm:px-4 pb-2 pt-0.5 text-sm transition-colors relative text-center rounded-none shadow-none hover:bg-transparent",
              activeTab === "offers"
                ? "font-semibold text-slate-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-slate-900"
                : "font-medium text-slate-500 hover:text-slate-800"
            )}
          >
            <Translate text={localizationConstants.b2bPMTabOffers} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setActiveTab("project-info")}
            className={cn(
              "h-auto cursor-pointer whitespace-nowrap px-3 sm:px-4 pb-2 pt-0.5 text-sm transition-colors relative text-center rounded-none shadow-none hover:bg-transparent",
              activeTab === "project-info"
                ? "font-semibold text-slate-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-slate-900"
                : "font-medium text-slate-500 hover:text-slate-800"
            )}
          >
            <Translate text={localizationConstants.b2bPMTabProjectInfo} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setActiveTab("qa")}
            className={cn(
              "h-auto cursor-pointer whitespace-nowrap px-3 sm:px-4 pb-2 pt-0.5 text-sm transition-colors relative text-center rounded-none shadow-none hover:bg-transparent",
              activeTab === "qa"
                ? "font-semibold text-slate-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-slate-900"
                : "font-medium text-slate-500 hover:text-slate-800"
            )}
          >
            <Translate text={localizationConstants.b2bPMTabQA} />
          </Button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 bg-slate-50">
        {activeTab === "offers" && <ProjectMarketOfferTab data={data} />}
        {activeTab === "project-info" && <ProjectMarketInfoTab data={data} />}
        {activeTab === "qa" && <ProjectMarketQATab data={data} onRefresh={fetchDetail} />}
      </div>
    </div>
  );
}
