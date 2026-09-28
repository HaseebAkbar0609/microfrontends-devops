"use client";

import React from "react";
import localizationConstants from "@/utils/translation/constants";
import { EconomySubTabs, type EconomySubTabItem } from "../common/EconomySubTabs";
import type { ClaimTabType } from "../../types/claims.types";

interface ClaimsOverviewHeaderProps {
	activeTab: ClaimTabType;
	onTabChange: (tab: ClaimTabType) => void;
}

const CLAIMS_SUB_TABS: EconomySubTabItem<ClaimTabType>[] = [
	{ id: "reklamationerlista", labelKey: localizationConstants.claimsListTab },
	{ id: "mallar", labelKey: localizationConstants.claimsTemplatesTab },
];

export function ClaimsOverviewHeader({
	activeTab,
	onTabChange,
}: ClaimsOverviewHeaderProps) {
	return (
		<EconomySubTabs
			tabs={CLAIMS_SUB_TABS}
			activeTab={activeTab}
			onTabChange={onTabChange}
		/>
	);
}

export default ClaimsOverviewHeader;
