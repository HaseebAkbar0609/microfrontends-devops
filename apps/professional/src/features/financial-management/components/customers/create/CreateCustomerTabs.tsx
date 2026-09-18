"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export type CustomerWizardTab = "basic_info" | "contact" | "assessment" | "invoice";

interface CreateCustomerTabsProps {
	activeTab: CustomerWizardTab;
	onTabChange: (tab: CustomerWizardTab) => void;
}

const TABS: { id: CustomerWizardTab; labelKey: keyof typeof localizationConstants; step: number }[] = [
	{ id: "basic_info", labelKey: "customerTabBasicInfo", step: 1 },
	{ id: "contact", labelKey: "customerTabContact", step: 2 },
	{ id: "assessment", labelKey: "customerTabAssessment", step: 3 },
	{ id: "invoice", labelKey: "customerTabInvoice", step: 4 },
];

export function CreateCustomerTabs({
	activeTab,
	onTabChange,
}: CreateCustomerTabsProps) {
	return (
		<div className="border-b border-slate-200">
			<nav className="-mb-px flex space-x-8" aria-label="Customer Tabs">
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
