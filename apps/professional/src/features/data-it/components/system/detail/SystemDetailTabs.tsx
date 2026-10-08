"use client";

import React from "react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	SYSTEM_DETAIL_TAB_BASIC,
	SYSTEM_DETAIL_TAB_ASSIGNMENT,
	type SystemDetailTabId,
} from "@/features/data-it/constants/dataItSystem.constants";

interface SystemDetailTabsProps {
	activeTab: SystemDetailTabId;
	onTabChange: (tab: SystemDetailTabId) => void;
}

export const SystemDetailTabs: React.FC<SystemDetailTabsProps> = ({
	activeTab,
	onTabChange,
}) => {
	const t = useTranslate();

	return (
		<div
			className="border-b border-slate-200"
			role="tablist"
			aria-label={t(localizationConstants.dataItSystemAriaTabs)}
		>
			<nav className="-mb-px flex space-x-6">
				{/* Tab 1: Basic Info */}
				<button
					type="button"
					role="tab"
					aria-selected={activeTab === SYSTEM_DETAIL_TAB_BASIC}
					onClick={() => onTabChange(SYSTEM_DETAIL_TAB_BASIC)}
					className={`border-b-2 pb-3 text-sm font-semibold transition-colors ${
						activeTab === SYSTEM_DETAIL_TAB_BASIC
							? "border-slate-900 text-slate-900"
							: "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
					}`}
				>
					{t(localizationConstants.dataItSystemTabBasicInfo)}
				</button>

				{/* Tab 2: Assignment */}
				<button
					type="button"
					role="tab"
					aria-selected={activeTab === SYSTEM_DETAIL_TAB_ASSIGNMENT}
					onClick={() => onTabChange(SYSTEM_DETAIL_TAB_ASSIGNMENT)}
					className={`border-b-2 pb-3 text-sm font-semibold transition-colors ${
						activeTab === SYSTEM_DETAIL_TAB_ASSIGNMENT
							? "border-slate-900 text-slate-900"
							: "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
					}`}
				>
					{t(localizationConstants.dataItSystemTabAssignment)}
				</button>
			</nav>
		</div>
	);
};

export default SystemDetailTabs;
