"use client";

import { useMemo, useState } from "react";

import type { QuoteDetail } from "@/features/leads/types";
import { getCompanyDetails, getCreditInfo } from "@/features/leads/management/constants/quoteCompanyTab";
import { QuoteCompanyHeroSection } from "@/features/leads/management/components/quote-company/QuoteCompanyHeroSection";
import { QuoteCompanyDetailsSection } from "@/features/leads/management/components/quote-company/QuoteCompanyDetailsSection";
import { QuoteCompanyFiltersSection } from "@/features/leads/management/components/quote-company/QuoteCompanyFiltersSection";
import { QuoteCompanyCertificatesSection } from "@/features/leads/management/components/quote-company/QuoteCompanyCertificatesSection";
import { QuoteCompanyPersonnelSection } from "@/features/leads/management/components/quote-company/QuoteCompanyPersonnelSection";

export default function QuoteCompanyTab({ detail }: { detail: QuoteDetail }) {
  const companyDetails = useMemo(() => getCompanyDetails(detail), [detail]);
  const creditInfo = useMemo(() => getCreditInfo(detail), [detail]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  return (
    <div className="flex flex-col gap-6 mb-10">
      <QuoteCompanyHeroSection />
      <QuoteCompanyDetailsSection companyDetails={companyDetails} creditInfo={creditInfo} />
      <QuoteCompanyFiltersSection
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
      />
      <QuoteCompanyCertificatesSection search={search} category={category} />
      <QuoteCompanyPersonnelSection search={search} />
    </div>
  );
}
