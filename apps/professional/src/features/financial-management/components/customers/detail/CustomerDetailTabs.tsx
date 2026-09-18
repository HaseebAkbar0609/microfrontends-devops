"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CustomerDetailTab } from "@/features/financial-management/types/customerDetail.types";

interface CustomerDetailTabsProps {
	activeTab: CustomerDetailTab;
	onTabChange: (tab: CustomerDetailTab) => void;
}

const TABS: { id: CustomerDetailTab; labelKey: keyof typeof localizationConstants }[] = [
	{ id: "basic", labelKey: "customerDetailTabBasicInfo" },
	{ id: "contact", labelKey: "customerDetailTabContact" },
	{ id: "assessment", labelKey: "customerDetailTabAssessment" },
	{ id: "invoice", labelKey: "customerDetailTabInvoice" },
];

export const CustomerDetailTabs: React.FC<CustomerDetailTabsProps> = ({
	activeTab,
	onTabChange,
}) => {
	return (
		<div className="border-b border-slate-200 dark:border-slate-800">
			<nav className="-mb-px flex space-x-8" aria-label="Customer Detail Tabs">
				{TABS.map((tab) => {
					const isActive = activeTab === tab.id;
					return (
						<button
							key={tab.id}
							type="button"
							onClick={() => onTabChange(tab.id)}
							className={`cursor-pointer whitespace-nowrap border-b-2 px-1 py-3 text-xs font-semibold transition-colors ${
								isActive
									? "border-slate-900 font-bold text-slate-900 dark:border-white dark:text-white"
									: "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
							}`}
						>
							<Translate text={localizationConstants[tab.labelKey]} />
						</button>
					);
				})}
			</nav>
		</div>
	);
};
