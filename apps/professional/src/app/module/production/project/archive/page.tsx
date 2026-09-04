import { ComingSoonPage } from "@/components/common/ComingSoonPage";
import { ModulePageHeader } from "@/components/layout/navigation";
import {
	PROJECT_MODULE_TABS,
	PROJECT_MODULE_TITLE,
	projectBreadcrumbs,
} from "@/features/project/data/projectNav.config";
import localizationConstants from "@/utils/translation/constants";

export default function Page() {
	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<ModulePageHeader
				title={PROJECT_MODULE_TITLE}
				tabs={PROJECT_MODULE_TABS}
				breadcrumbs={projectBreadcrumbs(localizationConstants.projectArchive)}
			/>
			<ComingSoonPage titleKey={localizationConstants.projectArchive} hideTitle />
		</div>
	);
}
