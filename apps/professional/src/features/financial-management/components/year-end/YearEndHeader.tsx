import React from "react";
import localizationConstants from "@/utils/translation/constants";
import { EconomySubTabs } from "../common/EconomySubTabs";
import type { YearEndTabType } from "../../types/yearEnd.types";

interface YearEndHeaderProps {
	activeTab: YearEndTabType;
	onTabChange: (tab: YearEndTabType) => void;
}

export function YearEndHeader({ activeTab, onTabChange }: YearEndHeaderProps) {
	const tabs = [
		{ id: "bokslut", labelKey: localizationConstants.tabBokslut },
		{ id: "checklist", labelKey: localizationConstants.tabChecklist },
	];

	return (
		<EconomySubTabs
			tabs={tabs}
			activeTab={activeTab}
			onTabChange={(id) => onTabChange(id as YearEndTabType)}
		/>
	);
}

export default YearEndHeader;

