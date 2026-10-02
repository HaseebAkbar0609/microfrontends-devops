"use client";

import { usePathname } from "next/navigation";
import { ModulePageHeader } from "@/components/layout/navigation";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	ACCESS_MODULE_BASE_URL,
	ACCESS_MODULE_TABS,
	ACCESS_MODULE_TITLE,
	accessDetailsTabs,
	accessDetailsUrl,
} from "../../data/accessNav.config";
import { AccessNewButton } from "./AccessNewButton";

/**
 * Header shared by a record's pages: module tabs, back row, then the record's own tabs.
 * On an item page (under the Access tab) the arrow goes back to the Access tab and
 * the "New access management" button is left out, as in the Figma frame.
 */
export function AccessRecordHeader({ id, idNumber }: { id: string; idNumber: string }) {
	const pathname = usePathname();
	const accessTabUrl = `${accessDetailsUrl(id)}/access`;
	const isItemPage = pathname.startsWith(`${accessTabUrl}/`);

	return (
		<ModulePageHeader
			title={ACCESS_MODULE_TITLE}
			tabs={ACCESS_MODULE_TABS}
			record={{
				title: <Translate text={localizationConstants.accessDetailsTitle} />,
				description: idNumber,
				backHref: isItemPage ? accessTabUrl : ACCESS_MODULE_BASE_URL,
				actions: isItemPage ? undefined : <AccessNewButton />,
			}}
			secondaryTabs={accessDetailsTabs(id)}
		/>
	);
}
