import { PageHeader } from "@/components/layout/PageHeader";
import OrderDashboard from "@/features/order/components/OrderDashboard";
import { ORDER_DASHBOARD_BREADCRUMBS } from "@/features/order/constants";
import localizationConstants from "@/utils/translation/constants";

export default function OrderDashboardSubPage() {
	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<PageHeader
				title={localizationConstants.orderDashboard}
				breadcrumbs={ORDER_DASHBOARD_BREADCRUMBS}
			/>
			<div className="p-5 flex-1">
				<OrderDashboard />
			</div>
		</div>
	);
}
