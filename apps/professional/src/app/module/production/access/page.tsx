import { ComingSoonPage } from "@/components/common/ComingSoonPage";
import { ModulePageHeader } from "@/components/layout/navigation";
import {
	ACCESS_MODULE_TABS,
	ACCESS_MODULE_TITLE,
	accessBreadcrumbs,
} from "@/features/access/data/accessNav.config";
import localizationConstants from "@/utils/translation/constants";

export default function Page() {
	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<ModulePageHeader
				title={ACCESS_MODULE_TITLE}
				tabs={ACCESS_MODULE_TABS}
				breadcrumbs={accessBreadcrumbs(localizationConstants.accessManagement)}
			/>
			<ComingSoonPage hideTitle />
		</div>
	);
}
