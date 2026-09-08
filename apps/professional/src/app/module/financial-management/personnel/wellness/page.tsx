"use client";

import { PersonnelSubRoutePage } from "@/features/personnel/components/common/PersonnelSubRoutePage";
import localizationConstants from "@/utils/translation/constants";

export default function WellnessPage() {
	return (
		<PersonnelSubRoutePage
			activeTabId="wellness"
			titleKey={localizationConstants.wellnessTab}
		/>
	);
}
