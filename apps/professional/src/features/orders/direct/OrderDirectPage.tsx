"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
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
		<div className="flex h-full flex-col bg-slate-50/50">
			{/* Page Header with Breadcrumbs matching screenshot */}
			<PageHeader
				title={localizationConstants.orderDirect}
				breadcrumbs={[
					{ label: localizationConstants.home, href: "/dashboard" },
					{ label: localizationConstants.moduleItem, href: "/module/business" },
					{ label: localizationConstants.production, href: "/module/production" },
					{ label: localizationConstants.orderModule, href: "/module/production/order/overview" },
					{ label: localizationConstants.orderDirect },
				]}
			/>

			{/* Main Content Area */}
			<div className="flex flex-1 flex-col px-6 pt-4 pb-8 overflow-y-auto">
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
