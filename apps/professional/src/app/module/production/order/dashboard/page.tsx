import { ModulePageHeader } from "@/components/layout/navigation";
import OrderDashboard from "@/features/order/components/OrderDashboard";
import {
	ORDER_MODULE_TABS,
	ORDER_MODULE_TITLE,
	orderBreadcrumbs,
} from "@/features/orders/data/orderNav.config";
import localizationConstants from "@/utils/translation/constants";

export default function OrderDashboardSubPage() {
	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<ModulePageHeader
				title={ORDER_MODULE_TITLE}
				tabs={ORDER_MODULE_TABS}
				breadcrumbs={orderBreadcrumbs(localizationConstants.orderDashboard)}
			/>
			<div className="p-5 flex-1">
				<OrderDashboard />
			</div>
		</div>
	);
}
