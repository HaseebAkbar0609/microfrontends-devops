import { ModulePageHeader } from "@/components/layout/navigation";
import KmaDashboard from "@/features/kma/components/KmaDashboard";
import {
	KMA_MODULE_TABS,
	KMA_MODULE_TITLE,
	kmaBreadcrumbs,
} from "@/features/kma/data/kmaNav.config";
import localizationConstants from "@/utils/translation/constants";

export default function KmaDashboardPage() {
	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<ModulePageHeader
				title={KMA_MODULE_TITLE}
				tabs={KMA_MODULE_TABS}
				breadcrumbs={kmaBreadcrumbs(localizationConstants.kmaDashboardTitle)}
			/>
			<div className="p-5 flex-1">
				<KmaDashboard />
			</div>
		</div>
	);
}
