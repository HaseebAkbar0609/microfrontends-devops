"use client";

import { PersonnelSubRoutePage } from "@/features/personnel/components/common/PersonnelSubRoutePage";
import localizationConstants from "@/utils/translation/constants";

export default function CreateEmployeePage() {
	return (
		<PersonnelSubRoutePage
			activeTabId="create"
			titleKey={localizationConstants.createEmployeeTab}
		/>
	);
}
