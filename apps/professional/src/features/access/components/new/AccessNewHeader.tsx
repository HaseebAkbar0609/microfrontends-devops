"use client";

import { ModulePageHeader } from "@/components/layout/navigation";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { useAccessRows } from "../../context/AccessRowsContext";
import {
	ACCESS_MODULE_BASE_URL,
	ACCESS_MODULE_TABS,
	ACCESS_MODULE_TITLE,
	ACCESS_NEW_TABS,
} from "../../data/accessNav.config";

/** Header of the wizard: the title, the number the new access will get, and its two steps as tabs. */
export function AccessNewHeader() {
	const { nextIds } = useAccessRows();

	return (
		<ModulePageHeader
			title={ACCESS_MODULE_TITLE}
			tabs={ACCESS_MODULE_TABS}
			record={{
				title: <Translate text={localizationConstants.accessNewButton} />,
				description: nextIds.idNumber,
				backHref: ACCESS_MODULE_BASE_URL,
			}}
			secondaryTabs={ACCESS_NEW_TABS}
		/>
	);
}
