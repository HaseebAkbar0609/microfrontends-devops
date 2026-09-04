import { PageHeader } from "@/components/layout/PageHeader";
import { orderBreadcrumbs } from "@/features/orders/data/orderNav.config";
import localizationConstants from "@/utils/translation/constants";
import OrderDashboard from "@/features/order/components/OrderDashboard";

export default function OrderDashboardSubPage() {
	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			{/* Page Title with Breadcrumbs directly below it */}
			<PageHeader
				title={localizationConstants.orderDashboard}
				breadcrumbs={orderBreadcrumbs(localizationConstants.orderDashboard)}
				className="border-b-0 px-6 pt-5 pb-2"
			/>
			<div className="p-5 flex-1">
				<OrderDashboard />
			</div>
		</div>
	);
}
