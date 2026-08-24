import { ComingSoonPage } from "@/components/common/ComingSoonPage";
import { ModulePageHeader } from "@/components/layout/navigation";
import { productionBreadcrumbs } from "@/features/production/constants";
import localizationConstants from "@/utils/translation/constants";

export default function Page() {
	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<ModulePageHeader
				title={localizationConstants.design}
				breadcrumbs={productionBreadcrumbs(localizationConstants.design)}
			/>
			<ComingSoonPage hideTitle />
		</div>
	);
}
