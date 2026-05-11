"use client";

import { QuoteReferencesReviewSection } from "@/features/leads/management/components/quote-references/QuoteReferencesReviewSection";
import { QuoteReferencesTableSection } from "@/features/leads/management/components/quote-references/QuoteReferencesTableSection";
import { QuoteReferencesImagesSection } from "@/features/leads/management/components/quote-references/QuoteReferencesImagesSection";

export default function QuoteReferencesTab() {
  return (
    <div className="flex flex-col gap-6">
      <QuoteReferencesReviewSection />
      <QuoteReferencesTableSection />
      <QuoteReferencesImagesSection />
    </div>
  );
}
