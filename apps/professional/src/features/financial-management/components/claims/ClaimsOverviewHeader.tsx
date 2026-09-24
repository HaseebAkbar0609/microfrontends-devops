"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { ClaimTabType } from "../../types/claims.types";

interface ClaimsOverviewHeaderProps {
	activeTab: ClaimTabType;
	onTabChange: (tab: ClaimTabType) => void;
}

export function ClaimsOverviewHeader({
	activeTab,
	onTabChange,
}: ClaimsOverviewHeaderProps) {
	const tabs: { id: ClaimTabType; labelKey: string }[] = [
		{ id: "reklamationerlista", labelKey: localizationConstants.claimsListTab },
		{ id: "mallar", labelKey: localizationConstants.claimsTemplatesTab },
	];

	return (
		<div className="flex items-center gap-8 border-b border-slate-200 mb-6">
			{tabs.map((tab) => {
				const isActive = activeTab === tab.id;
				return (
					<button
						key={tab.id}
						type="button"
						onClick={() => onTabChange(tab.id)}
						className={`pb-3 text-sm font-semibold transition-all relative cursor-pointer ${
							isActive
								? "text-slate-900 border-b-2 border-slate-900"
								: "text-slate-500 hover:text-slate-900"
						}`}
					>
						<Translate text={tab.labelKey} />
					</button>
				);
			})}
		</div>
	);
}

export default ClaimsOverviewHeader;
