"use client";

import { ActionsToolbar } from "@/components/common/ActionsToolbar";
import { CollapsibleSection } from "@/components/common/CollapsibleSection";
import { PageHeader } from "@/components/layout/PageHeader";
import { Translate } from "@/utils/translation/translate";

import { QUESTIONS_BREADCRUMBS } from "@/features/questions/constants/faq";
import localizationConstants from "@/utils/translation/constants";
import { useMemo, useState } from "react";
import { FAQ_CATEGORY_OPTIONS, FAQ_ITEMS } from "../constants/faq";
import { t } from "i18next";


export default function QuestionsFeature() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

    const categoryOptions = useMemo(() => {
    return FAQ_CATEGORY_OPTIONS.map((item) => ({
      label: item.label,
      value: item.value,
    }));
        
  }, []);

    const filteredFaqs = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return FAQ_ITEMS.filter((item) => {
       const question = t(item.question).toLowerCase();
        const answer = t(item.answer).toLowerCase();

      const matchesSearch =
        normalizedSearch.length === 0 ||
        question.includes(normalizedSearch) ||
        answer.includes(normalizedSearch);

      const matchesCategory = category ? item.category === category : true;

      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title={localizationConstants.questions}
        breadcrumbs={QUESTIONS_BREADCRUMBS}
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
            key={`${item.category}-${item.question}`}
            title={<Translate text={item.question} />}
            defaultOpen={false}
            className="border-b border-slate-200 bg-transparent"
            headerClassName="mb-0 h-auto min-h-[64px] whitespace-normal border-b-0 px-0 py-0 text-left hover:bg-transparent"
            titleClassName="!text-base font-medium leading-6 text-slate-950"
            contentClassName="pb-5 pl-3"
          >
            <p className="whitespace-pre-line max-w-6xl text-sm leading-6 text-slate-500">
              <Translate text={item.answer} />
            </p>
          </CollapsibleSection>
        ))}
      </div>
    </div>
  );
}