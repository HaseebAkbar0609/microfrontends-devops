"use client";

import { PersonnelSubRoutePage } from "@/features/personnel/components/common/PersonnelSubRoutePage";
import localizationConstants from "@/utils/translation/constants";

export default function WorktimePage() {
	return (
		<PersonnelSubRoutePage
			activeTabId="worktime"
			titleKey={localizationConstants.worktimeTab}
		/>
	);
}
