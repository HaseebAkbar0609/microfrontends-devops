"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { orderBreadcrumbs } from "@/features/orders/data/orderNav.config";
import localizationConstants from "@/utils/translation/constants";
import { OrderDirectTable } from "./components/OrderDirectTable";
import { CreateDirectOrderModal } from "./components/CreateDirectOrderModal";
import { useDirectOrders } from "./hooks/useDirectOrders";
import type { DirectOrderRow } from "./types/directOrder.types";

export function OrderDirectPage() {
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const { addDirectOrder } = useDirectOrders();

	const handleSaveOrder = (newOrder: DirectOrderRow) => {
		addDirectOrder(newOrder);
	};

	return (
		<div className="flex flex-1 flex-col bg-slate-50/50">
			{/* Page Title with Breadcrumbs directly below it */}
			<PageHeader
				title={localizationConstants.orderDirect}
				breadcrumbs={orderBreadcrumbs(localizationConstants.orderDirect)}
				className="border-b-0 px-6 pt-5 pb-2"
			/>

			{/* Main Content Area */}
			<div className="flex flex-1 flex-col px-6 pt-2 pb-8 overflow-y-auto">
				<OrderDirectTable onOpenCreateModal={() => setIsCreateModalOpen(true)} />
			</div>

			{/* Modal for creating a new Direct Order */}
			<CreateDirectOrderModal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				onSave={handleSaveOrder}
			/>
		</div>
	);
}

export default OrderDirectPage;
