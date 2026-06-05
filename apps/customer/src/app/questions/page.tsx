"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { ActionsToolbar } from "@/components/common/ActionsToolbar";
import { CollapsibleSection } from "@/components/common/CollapsibleSection";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  FAQ_CATEGORY_OPTIONS,
  FAQ_ITEMS,
  type FaqLanguage,
} from "@/features/questions";
import { BreadcrumbItem } from "@/types/user";
import localizationConstants from "@/utils/translation/constants";

const BREADCRUMBS: BreadcrumbItem[] = [
  { label: localizationConstants.home, href: "/home" },
  { label: localizationConstants.tools },
  { label: localizationConstants.questions },
];

export default function QuestionsPage() {
  const { i18n } = useTranslation();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const language: FaqLanguage = i18n.language === "sv" ? "sv" : "en";

  const categoryOptions = useMemo(() => {
    return FAQ_CATEGORY_OPTIONS.map((item) => ({
      label: item.label[language],
      value: item.value,
    }));
  }, [language]);

  const filteredFaqs = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return FAQ_ITEMS.filter((item) => {
      const question = item.question[language].toLowerCase();
      const answer = item.answer[language].toLowerCase();

      const matchesSearch =
        normalizedSearch.length === 0 ||
        question.includes(normalizedSearch) ||
        answer.includes(normalizedSearch);

      const matchesCategory = category ? item.category === category : true;

      return matchesSearch && matchesCategory;
    });
  }, [search, category, language]);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title={localizationConstants.questions}
        breadcrumbs={BREADCRUMBS}
      />

      <ActionsToolbar
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          {
            label: localizationConstants.filterLabel,
            value: category,
            options: categoryOptions,
            onFilterChange: setCategory,
          },
        ]}
        onCreateClick={() => {}}
        createButtonLabel="Läs mer"
      />

      <div className="px-5">
        {filteredFaqs.map((item) => (
          <CollapsibleSection
            key={`${item.category}-${item.question.sv}`}
            title={item.question[language]}
            defaultOpen={false}
            className="border-b border-slate-200 bg-transparent"
            headerClassName="mb-0 h-auto min-h-[64px] whitespace-normal border-b-0 px-0 py-0 text-left hover:bg-transparent"
            titleClassName="!text-base font-medium leading-6 text-slate-950"
            contentClassName="pb-5 pl-3"
          >
            <p className="whitespace-pre-line max-w-6xl text-sm leading-6 text-slate-500">
              {item.answer[language]}
            </p>
          </CollapsibleSection>
        ))}
      </div>
    </div>
  );
}
