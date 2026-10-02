import { notFound } from "next/navigation";
import { ModulePageHeader } from "@/components/layout/navigation";
import { AccessNewButton } from "@/features/access/components/details/AccessNewButton";
import { ACCESS_DETAILS_MOCK } from "@/features/access/data/accessDetails.mock";
import {
	ACCESS_MODULE_BASE_URL,
	ACCESS_MODULE_TABS,
	ACCESS_MODULE_TITLE,
	accessDetailsTabs,
} from "@/features/access/data/accessNav.config";
import { ACCESS_POINTS_MOCK } from "@/features/access/data/accessPoints.mock";
import { findAccessDetails } from "@/features/access/utils/accessDetails";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

interface AccessDetailsLayoutProps {
	children: React.ReactNode;
	params: Promise<{ id: string }>;
}

/** Shared header of a record's pages: module tabs, back row, then the record's own tabs (guideline pattern 3). */
export default async function AccessDetailsLayout({ children, params }: AccessDetailsLayoutProps) {
	const { id } = await params;
	const details = findAccessDetails(id, ACCESS_POINTS_MOCK, ACCESS_DETAILS_MOCK);
	if (!details) notFound();

	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<ModulePageHeader
				title={ACCESS_MODULE_TITLE}
				tabs={ACCESS_MODULE_TABS}
				record={{
					title: <Translate text={localizationConstants.accessDetailsTitle} />,
					description: details.idNumber,
					backHref: ACCESS_MODULE_BASE_URL,
					actions: <AccessNewButton />,
				}}
				secondaryTabs={accessDetailsTabs(details.id)}
			/>
			{children}
		</div>
	);
}
