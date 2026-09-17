"use client";

import React from "react";
import { MessageSquare, Info, FileText, History } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export type CaseDetailTab =
	| "konversation"
	| "grundlaggande_info"
	| "dokument"
	| "aktivitetslogg";

interface CaseDetailTabsProps {
	activeTab: CaseDetailTab;
	onTabChange: (tab: CaseDetailTab) => void;
}

export function CaseDetailTabs({
	activeTab,
	onTabChange,
}: CaseDetailTabsProps) {
	const tabs: { id: CaseDetailTab; labelKey: any; icon: any }[] = [
		{
			id: "konversation",
			labelKey: localizationConstants.casesTabConversation,
			icon: MessageSquare,
		},
		{
			id: "grundlaggande_info",
			labelKey: localizationConstants.casesTabBasicInfo,
			icon: Info,
		},
		{
			id: "dokument",
			labelKey: localizationConstants.casesTabDocuments,
			icon: FileText,
		},
		{
			id: "aktivitetslogg",
			labelKey: localizationConstants.casesTabActivityLog,
			icon: History,
		},
	];

	return (
		<div className="flex border-b border-slate-200 gap-2">
			{tabs.map((tab) => {
				const Icon = tab.icon;
				const isActive = activeTab === tab.id;
				return (
					<button
						key={tab.id}
						type="button"
						onClick={() => onTabChange(tab.id)}
						className={`pb-2.5 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
							isActive
								? "border-slate-900 text-slate-900"
								: "border-transparent text-slate-500 hover:text-slate-800"
						}`}
					>
						<Icon className="w-3.5 h-3.5" />
						<Translate text={tab.labelKey} />
					</button>
				);
			})}
		</div>
	);
}

export default CaseDetailTabs;
