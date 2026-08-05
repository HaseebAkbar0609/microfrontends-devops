"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { CompanyDetail } from "../types/company";
import { CompanyInfoTab } from "./CompanyInfoTab";
import { CompanyCreditTab } from "./CompanyCreditTab";
import { CompanyPresentationTab } from "./CompanyPresentationTab";
import { CompanyReferensTab } from "./CompanyReferensTab";
import { CompanyOmdomeTab } from "./CompanyOmdomeTab";

interface Props {
  data: CompanyDetail;
}

export function B2BCompanyView({ data }: Props) {
  const t = useTranslate();
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4">
        <button
          type="button"
          aria-label={t(localizationConstants.goBackButton)}
          onClick={() => router.back()}
          className="flex h-8 w-8 cursor-pointer items-center justify-center text-slate-700 hover:text-slate-950"
        >
          <ArrowLeft size={20} aria-hidden={true} />
        </button>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
          {t(localizationConstants.b2bCompanyViewTitle)}
        </h1>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="info" className="flex flex-1 flex-col overflow-hidden">
        <div className="border-b border-slate-200 px-6">
          <TabsList variant="line" className="h-10 gap-6">
            <TabsTrigger value="info" className="cursor-pointer px-0 text-sm">
              {t(localizationConstants.b2bCompanyTabInfo)}
            </TabsTrigger>
            <TabsTrigger value="credit" className="cursor-pointer px-0 text-sm">
              {t(localizationConstants.b2bCompanyTabCredit)}
            </TabsTrigger>
            <TabsTrigger value="presentation" className="cursor-pointer px-0 text-sm">
              {t(localizationConstants.b2bCompanyTabPresentation)}
            </TabsTrigger>
            <TabsTrigger value="referens" className="cursor-pointer px-0 text-sm">
              {t(localizationConstants.b2bCompanyTabReferens)}
            </TabsTrigger>
            <TabsTrigger value="omdome" className="cursor-pointer px-0 text-sm">
              {t(localizationConstants.b2bCompanyTabOmdome)}
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="info" className="px-6 py-5">
            <CompanyInfoTab data={data} />
          </TabsContent>
          <TabsContent value="credit" className="px-6 py-5">
            <CompanyCreditTab data={data} />
          </TabsContent>
          <TabsContent value="presentation" className="px-6 py-5">
            <CompanyPresentationTab data={data} />
          </TabsContent>
          <TabsContent value="referens" className="px-6 py-5">
            <CompanyReferensTab data={data} />
          </TabsContent>
          <TabsContent value="omdome" className="px-6 py-5">
            <CompanyOmdomeTab data={data} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
