"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export type ExpenseDetailActiveTab = "oversikt" | "tidrapport" | "underlag";

interface ExpenseDetailTabsProps {
	activeTab: ExpenseDetailActiveTab;
	onTabChange: (tab: ExpenseDetailActiveTab) => void;
}

export function ExpenseDetailTabs({
	activeTab,
	onTabChange,
}: ExpenseDetailTabsProps) {
	const tabs: { id: ExpenseDetailActiveTab; labelKey: string }[] = [
		{ id: "oversikt", labelKey: localizationConstants.expenseDetailTabOverview },
		{ id: "tidrapport", labelKey: localizationConstants.expenseDetailTabTimeReport },
		{ id: "underlag", labelKey: localizationConstants.expenseDetailTabUnderlag },
	];

	return (
		<div className="border-b border-slate-200 mb-6">
			<nav className="flex space-x-8" aria-label="Tabs">
				{tabs.map((tab) => {
					const isActive = activeTab === tab.id;
					return (
						<button
							key={tab.id}
							type="button"
							onClick={() => onTabChange(tab.id)}
							className={`py-3 px-1 border-b-2 text-xs font-semibold transition-colors cursor-pointer ${
								isActive
									? "border-blue-600 text-slate-900"
									: "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
							}`}
						>
							<Translate text={tab.labelKey} />
						</button>
					);
				})}
			</nav>
		</div>
	);
}

export default ExpenseDetailTabs;
