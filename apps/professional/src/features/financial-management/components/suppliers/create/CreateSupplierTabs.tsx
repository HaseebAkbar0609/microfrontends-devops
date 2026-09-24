"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export type SupplierWizardTab = "basic_info" | "contact" | "assessment";

interface CreateSupplierTabsProps {
	activeTab: SupplierWizardTab;
	onTabChange: (tab: SupplierWizardTab) => void;
}

const TABS: { id: SupplierWizardTab; labelKey: keyof typeof localizationConstants }[] = [
	{ id: "basic_info", labelKey: "supplierTabBasicInfo" },
	{ id: "contact", labelKey: "supplierTabContact" },
	{ id: "assessment", labelKey: "supplierTabAssessment" },
];

export function CreateSupplierTabs({
	activeTab,
	onTabChange,
}: CreateSupplierTabsProps) {
	return (
		<div className="flex items-center gap-6 border-b border-slate-200 overflow-x-auto">
			{TABS.map((tab) => {
				const isActive = activeTab === tab.id;
				return (
					<button
						key={tab.id}
						type="button"
						onClick={() => onTabChange(tab.id)}
						className={`pb-3 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
							isActive
								? "border-slate-900 text-slate-900"
								: "border-transparent text-slate-500 hover:text-slate-800"
						}`}
					>
						<Translate text={localizationConstants[tab.labelKey]} />
					</button>
				);
			})}
		</div>
	);
}
