"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
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
		router.push("/module/production/order/overview");
	};

	const handleModalConfirm = (option: "project" | "order") => {
		if (option === "project") {
			router.push("/module/production/project");
		} else {
			router.push("/module/production/order/overview");
		}
	};

	return (
		<div className="flex h-full flex-col bg-slate-50/50 relative overflow-hidden">
			{/* Sub-header with Back button matching screenshot */}
			<div className="flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-4">
				<button
					type="button"
					onClick={handleBack}
					className="flex items-center justify-center p-1 text-slate-600 hover:text-slate-900 rounded-md cursor-pointer transition-colors"
				>
					<ArrowLeft className="h-5 w-5" />
				</button>
				<h1 className="text-xl font-bold text-slate-900 tracking-tight">
					<Translate text={localizationConstants.seeOrderTitle} />
				</h1>
			</div>

			{/* Main Content Scrollable Container (70% width layout) */}
			<div className="flex-1 overflow-y-auto px-6 py-6">
				<div className="w-full lg:w-[70%] space-y-6">
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
