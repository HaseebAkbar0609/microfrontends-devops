"use client";

import { PersonnelSubRoutePage } from "@/features/personnel/components/common/PersonnelSubRoutePage";
import localizationConstants from "@/utils/translation/constants";

export default function PersonalProcessPage() {
	return (
		<PersonnelSubRoutePage
			activeTabId="process"
			titleKey={localizationConstants.personalProcessesTab}
		/>
	);
}
