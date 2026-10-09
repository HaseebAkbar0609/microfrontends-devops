"use client";

import React from "react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	SYSTEM_DETAIL_TAB_BASIC,
	SYSTEM_DETAIL_TAB_ASSIGNMENT,
	type SystemDetailTabId,
} from "@/features/data-it/constants/dataItSystem.constants";

interface SystemCreateTabsProps {
	activeTab: SystemDetailTabId;
	onTabChange: (tab: SystemDetailTabId) => void;
	hasErrorsTabBasic?: boolean;
}

export const SystemCreateTabs: React.FC<SystemCreateTabsProps> = ({
	activeTab,
	onTabChange,
	hasErrorsTabBasic = false,
}) => {
	const t = useTranslate();

	return (
		<div className="border-b border-slate-200">
			<nav
				role="tablist"
				className="-mb-px flex space-x-8"
				aria-label={t(localizationConstants.dataItSystemAriaTabs)}
			>
				{/* Tab 1: Grundläggande info */}
				<button
					role="tab"
					id="tab-basic-info"
					aria-controls="panel-basic-info"
					aria-selected={activeTab === SYSTEM_DETAIL_TAB_BASIC}
					type="button"
					onClick={() => onTabChange(SYSTEM_DETAIL_TAB_BASIC)}
					className={`relative border-b-2 py-3 text-sm font-semibold transition-colors ${
						activeTab === SYSTEM_DETAIL_TAB_BASIC
							? "border-slate-900 text-slate-900"
							: "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
					}`}
				>
					<span>{t(localizationConstants.dataItSystemTabBasicInfo)}</span>
					{hasErrorsTabBasic && (
						<span className="ml-1.5 inline-block h-2 w-2 rounded-full bg-rose-500" />
					)}
				</button>

				{/* Tab 2: Tilldelning */}
				<button
					role="tab"
					id="tab-assignment"
					aria-controls="panel-assignment"
					aria-selected={activeTab === SYSTEM_DETAIL_TAB_ASSIGNMENT}
					type="button"
					onClick={() => onTabChange(SYSTEM_DETAIL_TAB_ASSIGNMENT)}
					className={`border-b-2 py-3 text-sm font-semibold transition-colors ${
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

export default SystemCreateTabs;
