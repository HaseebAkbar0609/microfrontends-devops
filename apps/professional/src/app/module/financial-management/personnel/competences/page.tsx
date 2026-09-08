"use client";

import { PersonnelSubRoutePage } from "@/features/personnel/components/common/PersonnelSubRoutePage";
import localizationConstants from "@/utils/translation/constants";

export default function CompetencesPage() {
	return (
		<PersonnelSubRoutePage
			activeTabId="competences"
			titleKey={localizationConstants.competencesTab}
		/>
	);
}
