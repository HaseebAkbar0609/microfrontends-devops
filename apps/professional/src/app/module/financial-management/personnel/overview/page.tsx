"use client";

import { PersonnelSubRoutePage } from "@/features/personnel/components/common/PersonnelSubRoutePage";
import localizationConstants from "@/utils/translation/constants";

export default function PersonnelOverviewPage() {
	return (
		<PersonnelSubRoutePage
			activeTabId="overview"
			titleKey={localizationConstants.personalOverviewTab}
		/>
	);
}
