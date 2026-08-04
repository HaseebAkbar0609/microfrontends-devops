"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useTranslate } from "@/utils/translation/translate";
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

  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      {/* Header */}
      <div className="flex items-center gap-3 py-4 pl-2 pr-6">
        <button
          type="button"
          aria-label={t(localizationConstants.goBackButton)}
          onClick={() => router.back()}
          className="flex h-8 w-8 cursor-pointer items-center justify-center text-slate-700 hover:text-slate-950"
        >
          <ArrowLeft size={20} aria-hidden={true} />
        </button>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
          {t(localizationConstants.b2bPMViewProjectMarket)}
        </h1>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="offers" className="flex flex-1 flex-col overflow-hidden">
        <div className="border-b border-slate-200 px-6">
          <TabsList variant="line" className="h-10 gap-6">
            <TabsTrigger value="offers" className="cursor-pointer px-0 text-sm">
              {t(localizationConstants.b2bPMTabOffers)}
            </TabsTrigger>
            <TabsTrigger value="project-info" className="cursor-pointer px-0 text-sm">
              {t(localizationConstants.b2bPMTabProjectInfo)}
            </TabsTrigger>
            <TabsTrigger value="qa" className="cursor-pointer px-0 text-sm">
              {t(localizationConstants.b2bPMTabQA)}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="offers" className="flex-1 overflow-y-auto">
          <ProjectMarketOfferTab data={data} />
        </TabsContent>

        <TabsContent value="project-info" className="flex-1 overflow-y-auto">
          <ProjectMarketInfoTab data={data} />
        </TabsContent>

        <TabsContent value="qa" className="flex-1 overflow-y-auto">
          <ProjectMarketQATab data={data} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
