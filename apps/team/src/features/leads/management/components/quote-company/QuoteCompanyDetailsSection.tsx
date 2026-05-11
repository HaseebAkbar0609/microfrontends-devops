"use client";

import Image from "next/image";
import { FileText } from "lucide-react";

import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { CompanyInfoItem, CreditInfoItem } from "@/features/leads/management/constants/quoteCompanyTab";

export function QuoteCompanyDetailsSection({
  companyDetails,
  creditInfo,
}: {
  companyDetails: CompanyInfoItem[];
  creditInfo: CreditInfoItem[];
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-4">
          <span className="flex items-center justify-center">
            <FileText className="h-5 w-5" />
          </span>
          <div className="text-sm font-semibold text-slate-900">
            <Translate text={localizationConstants.companyDetailsTitle} />
          </div>
        </div>
        <div className="grid gap-4 px-6 py-5 sm:grid-cols-2">
          {companyDetails.map((item, index) => (
            <div key={`${item.labelKey}-${index}`} className="space-y-1">
              <div className="text-xs font-semibold uppercase text-slate-900">
                <Translate text={item.labelKey} />
              </div>
              <div className="text-sm text-slate-700">{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-4">
          <span className="flex items-center justify-center">
            <FileText className="h-5 w-5" />
          </span>
          <div className="text-sm font-semibold text-slate-900">
            <Translate text={localizationConstants.creditInformationTitle} />
          </div>
        </div>
        <div className="px-6 py-5">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3">
            <div className="text-xl font-semibold text-rose-500">
              <Image
                alt="Creditsafe"
                src="/images/creditsafe.png"
                height={100}
                width={100}
              />
            </div>
            <div className="text-xs font-semibold text-slate-500">
              <Translate text={localizationConstants.creditAssessmentVerifiedBy} />
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {creditInfo.map((item, index) => (
              <div key={`${item.labelKey}-${index}`} className="space-y-1">
                <div className="text-xs font-semibold uppercase text-slate-900">
                  <Translate text={item.labelKey} />
                </div>
                <div className="text-sm text-slate-700">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
