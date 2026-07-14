"use client";

import { CollapsibleSection } from "@/components/common/CollapsibleSection";
import { PageHeader } from "@/components/layout/PageHeader";
import { Translate } from "@/utils/translation/translate";

import { QUESTIONS_BREADCRUMBS } from "@/features/questions/constants/faq";
import localizationConstants from "@/utils/translation/constants";
import { FAQ_ITEMS } from "../constants/faq";

export default function QuestionsFeature() {
	return (
		<div className="flex flex-1 flex-col">
			<PageHeader
				title={localizationConstants.questions}
				breadcrumbs={QUESTIONS_BREADCRUMBS}
			/>

			<div className="px-5 pt-2">
				{FAQ_ITEMS.map((item) => (
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
