"use client";

import { RecordNavRow } from "@/components/layout/navigation";
import {
	ORDER_MODULE_BASE_URL,
} from "@/features/orders/data/orderNav.config";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { OrderOpenedSections } from "./components/OrderOpenedSections";
import { useOrderOpened } from "./hooks/useOrderOpened";

export interface OrderOpenedPageProps {
	orderId?: string;
}

export function OrderOpenedPage({ orderId }: OrderOpenedPageProps) {
	const { orderData } = useOrderOpened(orderId);

	const t = useTranslate();
	const serialNo = orderData.orderDetails.serialNo || orderData.id || "5000-001";
	const recordTitle = `Order ${serialNo} / ${t(localizationConstants.orderInfoSection)}`;

	return (
		<div className="flex h-full flex-col bg-slate-50/50 relative overflow-hidden">
			{/* Main Content Scrollable Container */}
			<div className="flex-1 overflow-y-auto px-6 py-6">
				<div className="w-full space-y-6">
					{/* Record Back Navigation Bar */}
					<RecordNavRow
						title={recordTitle}
						backHref={`${ORDER_MODULE_BASE_URL}/overview`}
						className="pt-0"
					/>

					{/* Sections with Tabs with ml-7 left margin below back button */}
					<div className="ml-7">
						<OrderOpenedSections data={orderData} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default OrderOpenedPage;
