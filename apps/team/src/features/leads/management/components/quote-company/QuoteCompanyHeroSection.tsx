"use client";

import Image from "next/image";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { companyHeroImage } from "@/features/leads/management/constants/quoteCompanyTab";

export function QuoteCompanyHeroSection() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="grid gap-6 lg:grid-cols-[460px_1fr]">
        <div className="overflow-hidden rounded-md border border-slate-100">
          <Image
            src={companyHeroImage}
            width={500}
            height={500}
            alt="Company"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center gap-3">
          <h3 className="text-base font-semibold text-slate-900">
            <Translate text={localizationConstants.companyOverviewTitle} />
          </h3>
          <p className="text-sm leading-6 text-slate-800">
            <Translate text={localizationConstants.companyOverviewDescription} />
          </p>
        </div>
      </div>
    </div>
  );
}
