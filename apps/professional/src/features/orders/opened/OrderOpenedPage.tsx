"use client";

import { useRouter } from "next/navigation";
import { RecordNavRow } from "@/components/layout/navigation";
import {
	ORDER_MODULE_BASE_URL,
} from "@/features/orders/data/orderNav.config";
import { useTranslate } from "@/utils/translation/translate";
import { OrderOpenedHero } from "./components/OrderOpenedHero";
import { OrderOpenedSections } from "./components/OrderOpenedSections";
import { OrderOpenedActionBar } from "./components/OrderOpenedActionBar";
import { CreateOrderOrProjectModal } from "./components/CreateOrderOrProjectModal";
import { useOrderOpened } from "./hooks/useOrderOpened";

export interface OrderOpenedPageProps {
	orderId?: string;
}

export function OrderOpenedPage({ orderId }: OrderOpenedPageProps) {
	const router = useRouter();
	const {
		orderData,
		isConfirmModalOpen,
		openConfirmModal,
		closeConfirmModal,
	} = useOrderOpened(orderId);

	const handleBack = () => {
		router.push(`${ORDER_MODULE_BASE_URL}/overview`);
	};

	const t = useTranslate();
	const recordTitle = orderData.titleKey
		? t(orderData.titleKey)
		: orderData.title;

	const handleModalConfirm = (option: "project" | "order") => {
		if (option === "project") {
			router.push("/module/production/project");
		} else {
			router.push("/module/production/order/overview");
		}
	};

	return (
		<div className="flex h-full flex-col bg-slate-50/50 relative overflow-hidden">
			{/* Main Content Scrollable Container (70% width layout) */}
			<div className="flex-1 overflow-y-auto px-6 py-6">
				<div className="w-full lg:w-[70%] space-y-6">
					{/* Record Back Navigation Bar */}
					<RecordNavRow
						title={recordTitle}
						backHref={`${ORDER_MODULE_BASE_URL}/overview`}
						className="pt-0"
					/>

					{/* Top Hero Summary Card */}
					<OrderOpenedHero data={orderData} />

					{/* Collapsible Sections (Customer, Contact, Order, Info, Documents) */}
					<OrderOpenedSections data={orderData} />
				</div>
			</div>

			{/* Bottom Sticky Action Bar */}
			<OrderOpenedActionBar onCancel={handleBack} onAccept={openConfirmModal} />

			{/* Interaction Modal: Skapa order eller projekt */}
			<CreateOrderOrProjectModal
				isOpen={isConfirmModalOpen}
				onClose={closeConfirmModal}
				onConfirm={handleModalConfirm}
			/>
		</div>
	);
}

export default OrderOpenedPage;
