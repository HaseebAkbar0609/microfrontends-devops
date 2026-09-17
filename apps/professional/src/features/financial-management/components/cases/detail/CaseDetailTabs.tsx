"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";

export type CaseDetailTab =
	| "grundlaggande_info"
	| "dokument"
	| "konversation"
	| "aktivitetslogg";

interface CaseDetailTabsProps {
	activeTab: CaseDetailTab;
	onTabChange: (tab: CaseDetailTab) => void;
}

export function CaseDetailTabs({
	activeTab,
	onTabChange,
}: CaseDetailTabsProps) {
	const tabs: {
		id: CaseDetailTab;
		labelKey: TranslationKeys;
	}[] = [
		{
			id: "grundlaggande_info",
			labelKey: localizationConstants.casesTabBasicInfo,
		},
		{
			id: "dokument",
			labelKey: localizationConstants.casesTabDocuments,
		},
		{
			id: "konversation",
			labelKey: localizationConstants.casesTabConversation,
		},
		{
			id: "aktivitetslogg",
			labelKey: localizationConstants.casesTabActivityLog,
		},
	];

	return (
		<div className="flex border-b border-slate-200">
			{tabs.map((tab) => {
				const isActive = activeTab === tab.id;
				return (
					<button
						key={tab.id}
						type="button"
						onClick={() => onTabChange(tab.id)}
						className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
							isActive
								? "border-slate-900 text-slate-900"
								: "border-transparent text-slate-500 hover:text-slate-800"
						}`}
					>
						<Translate text={tab.labelKey} />
					</button>
				);
			})}
		</div>
	);
}

export default CaseDetailTabs;
