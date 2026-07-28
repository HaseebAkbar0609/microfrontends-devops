"use client";

import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CollapsibleSection } from "@/components/common/CollapsibleSection";
import { PageHeader } from "@/components/layout/PageHeader";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { QUESTIONS_BREADCRUMBS, FAQ_ITEMS } from "../constants/faq";

export default function QuestionsFeature() {
	const t = useTranslate();
	const [search, setSearch] = useState("");

	// Filter local FAQ items based on the search query
	const filteredFaq = FAQ_ITEMS.filter((item) => {
		const normalizedSearch = search.trim().toLowerCase();
		const question = t(item.question).toLowerCase();
		const answer = t(item.answer).toLowerCase();
		const matchesSearch =
			!normalizedSearch ||
			question.includes(normalizedSearch) ||
			answer.includes(normalizedSearch);
		return matchesSearch;
	});

	return (
		<div className="flex flex-1 flex-col bg-white min-h-screen">
			<PageHeader
				title={localizationConstants.questions}
				breadcrumbs={QUESTIONS_BREADCRUMBS}
			/>

			{/* Controls Bar matching Figma layout */}
			<div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
				<div className="flex items-center gap-3 flex-1 max-w-xl">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
						<input
							type="text"
							aria-label={t("questionsSearchPlaceholder")}
							placeholder={t("questionsSearchPlaceholder")}
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-300 transition-colors"
						/>
					</div>
					<div className="relative">
						{/* Static Filter Button */}
						<button
							type="button"
							className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 font-medium flex items-center gap-1.5 hover:bg-slate-50 transition-colors focus:outline-none cursor-default"
						>
							{t("questionsFilterLabel")}
							<ChevronDown className="h-4 w-4 text-slate-500" />
						</button>
					</div>
				</div>
				{/* Static Read More / Läs mer Button matching Figma layout */}
				<Button
					type="button"
					className="h-9 px-4 text-sm bg-[#18181B] hover:bg-[#18181B]/90 text-white rounded-lg font-semibold cursor-default"
				>
					{t("questionsAskButton")}
				</Button>
			</div>

			{/* Collapsible Question / Accordion section */}
			<div className="px-5 flex-1 pt-2">
				{filteredFaq.length === 0 ? (
					<div className="text-center py-16 text-sm text-slate-500">
						{t("questionsNoResults")}
					</div>
				) : (
					filteredFaq.map((item) => (
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
					))
				)}
			</div>
		</div>
	);
}
