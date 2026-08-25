import { ModulePageHeader } from "@/components/layout/navigation";
import PurchaseDashboard from "@/features/purchase/components/PurchaseDashboard";
import {
	PURCHASE_MODULE_TABS,
	PURCHASE_MODULE_TITLE,
	purchaseBreadcrumbs,
} from "@/features/purchase/data/purchaseNav.config";
import localizationConstants from "@/utils/translation/constants";

export default function PurchaseDashboardPage() {
	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<ModulePageHeader
				title={PURCHASE_MODULE_TITLE}
				tabs={PURCHASE_MODULE_TABS}
				breadcrumbs={purchaseBreadcrumbs(
					localizationConstants.purchaseTabDashboard,
				)}
			/>
			<div className="p-5 flex-1">
				<PurchaseDashboard />
			</div>
		</div>
	);
}
