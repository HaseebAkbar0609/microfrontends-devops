"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { CompanyDetail } from "../types/company";
import { useB2BCompany } from "../hooks/useB2BCompany";
import { CompanyInfoTab } from "./CompanyInfoTab";
import { CompanyCreditTab } from "./CompanyCreditTab";
import { CompanyPresentationTab } from "./CompanyPresentationTab";
import { CompanyReferensTab } from "./CompanyReferensTab";
import { CompanyOmdomeTab } from "./CompanyOmdomeTab";

interface Props {
  data?: CompanyDetail;
  companyId?: string;
}

export function B2BCompanyView({ data: initialData, companyId = "1" }: Props) {
  const t = useTranslate();
  const router = useRouter();

  const { data } = useB2BCompany(companyId, initialData);

  return (
    <div className="flex flex-col bg-slate-50 w-full px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={t(localizationConstants.goBackButton)}
          onClick={() => router.back()}
          className="flex h-8 w-8 cursor-pointer items-center justify-center text-slate-800 hover:text-slate-950 transition-colors"
        >
          <ArrowLeft size={20} aria-hidden={true} />
        </button>
        <h1 className="font-sans text-2xl font-semibold leading-[100%] tracking-[-0.6px] text-slate-900">
          {t(localizationConstants.b2bCompanyViewTitle)}
        </h1>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="info" className="w-full mt-3 pl-[36px]">
        <div className="bg-slate-50 overflow-x-auto scrollbar-none">
          <div className="inline-flex min-w-max border-b border-slate-200">
            <TabsList variant="line">
              <TabsTrigger value="info" className="after:!h-[2.5px]">
                {t(localizationConstants.b2bCompanyTabInfo)}
              </TabsTrigger>
              <TabsTrigger value="credit" className="after:!h-[2.5px]">
                {t(localizationConstants.b2bCompanyTabCredit)}
              </TabsTrigger>
              <TabsTrigger value="presentation" className="after:!h-[2.5px]">
                {t(localizationConstants.b2bCompanyTabPresentation)}
              </TabsTrigger>
              <TabsTrigger value="referens" className="after:!h-[2.5px]">
                {t(localizationConstants.b2bCompanyTabReferens)}
              </TabsTrigger>
              <TabsTrigger value="omdome" className="after:!h-[2.5px]">
                {t(localizationConstants.b2bCompanyTabOmdome)}
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <div>
          <TabsContent value="info" className="pt-5 focus-visible:outline-none">
            <CompanyInfoTab data={data} isEditMode={false} />
          </TabsContent>
          <TabsContent value="credit" className="pt-5 focus-visible:outline-none">
            <CompanyCreditTab data={data} isEditMode={false} />
          </TabsContent>
          <TabsContent value="presentation" className="pt-5 focus-visible:outline-none">
            <CompanyPresentationTab data={data} isEditMode={false} />
          </TabsContent>
          <TabsContent value="referens" className="pt-5 focus-visible:outline-none">
            <CompanyReferensTab data={data} />
          </TabsContent>
          <TabsContent value="omdome" className="pt-5 focus-visible:outline-none">
            <CompanyOmdomeTab data={data} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
