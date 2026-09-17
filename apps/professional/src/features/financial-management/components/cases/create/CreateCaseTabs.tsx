"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export type CreateCaseTab = "basic_info" | "documents";

interface CreateCaseTabsProps {
	activeTab: CreateCaseTab;
	onTabChange: (tab: CreateCaseTab) => void;
}

export function CreateCaseTabs({
	activeTab,
	onTabChange,
}: CreateCaseTabsProps) {
	return (
		<div className="flex border-b border-slate-200">
			<button
				type="button"
				onClick={() => onTabChange("basic_info")}
				className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
					activeTab === "basic_info"
						? "border-slate-900 text-slate-900"
						: "border-transparent text-slate-500 hover:text-slate-800"
				}`}
			>
				<Translate text={localizationConstants.casesTabBasicInfo} />
			</button>
			<button
				type="button"
				onClick={() => onTabChange("documents")}
				className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
					activeTab === "documents"
						? "border-slate-900 text-slate-900"
						: "border-transparent text-slate-500 hover:text-slate-800"
				}`}
			>
				<Translate text={localizationConstants.casesTabDocuments} />
			</button>
		</div>
	);
}

export default CreateCaseTabs;
