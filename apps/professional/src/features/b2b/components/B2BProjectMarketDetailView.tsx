"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { ProjectMarketDetail } from "../types/projectMarket";
import { ProjectMarketOfferTab } from "./ProjectMarketOfferTab";
import { ProjectMarketInfoTab } from "./ProjectMarketInfoTab";
import { ProjectMarketQATab } from "./ProjectMarketQATab";

interface Props {
  data: ProjectMarketDetail;
}

export function B2BProjectMarketDetailView({ data }: Props) {
  const t = useTranslate();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"offers" | "project-info" | "qa">("offers");

  return (
    <div className="flex flex-1 flex-col bg-slate-50 min-h-full">
      {/* Top Header */}
      <div className="shrink-0 border-b border-slate-200 px-5 pt-4 bg-white">
        <h1 className="font-sans font-semibold text-2xl leading-8 tracking-normal align-middle text-slate-900">
          <Translate text={localizationConstants.b2b} />
        </h1>

        {/* Navigation Tabs — exact match with B2BDashboard */}
        <div className="mt-3 flex items-center gap-4 sm:gap-6 border-b border-slate-200 text-sm font-medium -mx-5 px-5 overflow-x-auto scrollbar-none">
          <Link
            href="/module/business/b2b"
            className="whitespace-nowrap shrink-0 px-4 sm:px-6 pb-3.5 text-slate-500 hover:text-slate-900 transition-colors text-center"
          >
            <Translate text={localizationConstants.b2bDashboard} />
          </Link>
          <Link
            href="/module/business/b2b/project-market"
            className={cn(
              "whitespace-nowrap shrink-0 relative px-4 sm:px-6 pb-3.5 text-slate-900 font-semibold transition-colors text-center",
              "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-slate-900"
            )}
          >
            <Translate text={localizationConstants.b2bOverview} />
          </Link>
          <Link
            href="/module/business/b2b/archive"
            className="whitespace-nowrap shrink-0 px-4 sm:px-6 pb-3.5 text-slate-500 hover:text-slate-900 transition-colors text-center"
          >
            <Translate text={localizationConstants.archive} />
          </Link>
        </div>
      </div>

      {/* Subheader with Back Button */}
      <div className="flex shrink-0 items-center gap-2 px-4 pt-6 pb-6">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={t(localizationConstants.goBackButton)}
          onClick={() => router.back()}
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
        {activeTab === "qa" && <ProjectMarketQATab data={data} />}
      </div>
    </div>
  );
}
