"use client";

import localizationConstants from "@/utils/translation/constants";
import { certificateFilterOptions } from "@/features/leads/management/constants/quoteCompanyTab";
import { ActionsToolbar, type FilterConfig } from "@/components/table/ActionsToolbar";
import { useMemo } from "react";

export function QuoteCompanyFiltersSection({
  search,
  onSearchChange,
  category,
  onCategoryChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
}) {
  const categoryFilterConfig = useMemo<FilterConfig>(
    () => ({
      label: localizationConstants.filterLabel,
      options: certificateFilterOptions.map((option) => ({
        value: option.value,
        label: option.labelKey,
      })),
      onFilterChange: onCategoryChange,
      value: category || null,
    }),
    [category, onCategoryChange]
  );

  return (
    <ActionsToolbar
      searchValue={search}
      onSearchChange={onSearchChange}
      filters={[categoryFilterConfig]}
      className="px-0 py-0"
    />
  );
}
