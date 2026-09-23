"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export type ArticleWizardTab = "basic_info" | "structured_info";

interface CreateArticleTabsProps {
	activeTab: ArticleWizardTab;
	onTabChange: (tab: ArticleWizardTab) => void;
}

const TABS: { id: ArticleWizardTab; labelKey: keyof typeof localizationConstants; step: number }[] = [
	{ id: "basic_info", labelKey: "createArticleBasicInfoTab", step: 1 },
	{ id: "structured_info", labelKey: "createArticleStructuredInfoTab", step: 2 },
];

export function CreateArticleTabs({
	activeTab,
	onTabChange,
}: CreateArticleTabsProps) {
	return (
		<div className="border-b border-slate-200">
			<nav className="-mb-px flex space-x-8" aria-label="Article Tabs">
				{TABS.map((tab) => {
					const isActive = activeTab === tab.id;
					return (
						<button
							key={tab.id}
							type="button"
							onClick={() => onTabChange(tab.id)}
							className={`whitespace-nowrap border-b-2 py-3 px-1 text-xs font-semibold transition-colors cursor-pointer ${
								isActive
									? "border-slate-900 text-slate-900 font-bold"
									: "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
							}`}
						>
							<Translate text={localizationConstants[tab.labelKey]} />
						</button>
					);
				})}
			</nav>
		</div>
	);
}
