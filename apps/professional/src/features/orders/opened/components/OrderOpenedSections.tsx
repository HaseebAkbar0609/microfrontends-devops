"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { OrderOpenedData } from "../types/orderOpened.types";
import { OrderProjectDetailsView } from "./OrderProjectDetailsView";
import { OrderOfferView } from "./OrderOfferView";
import { OrderInspectionView } from "./inspection/OrderInspectionView";
import { OrderOrganisationPage } from "@/features/orders/organisation/OrderOrganisationPage";
import { OrderPaymentPlanListPage } from "@/features/orders/payment-plan/OrderPaymentPlanListPage";
import { OrderGuaranteeCommitmentsPage } from "@/features/orders/guarantee-commitments/OrderGuaranteeCommitmentsPage";
import { OrderProtocolOverviewPage } from "@/features/orders/protocol/OrderProtocolOverviewPage";

export interface OrderOpenedSectionsProps {
	data: OrderOpenedData;
	onUpdateData?: (updated: Partial<OrderOpenedData>) => void;
	activeTab?: string;
	onTabChange?: (tab: string) => void;
}

type OrderTabValue =
	| "project-details"
	| "offer"
	| "inspection"
	| "organisation"
	| "payment-plan"
	| "guarantee"
	| "protocol";

export function OrderOpenedSections({
	data,
	onUpdateData,
	activeTab: controlledActiveTab,
	onTabChange,
}: OrderOpenedSectionsProps) {
	const t = useTranslate();
	const [internalTab, setInternalTab] = useState<OrderTabValue>("project-details");
	const [isGuaranteeDetailOpen, setIsGuaranteeDetailOpen] = useState(false);

	const activeTab = (controlledActiveTab as OrderTabValue) || internalTab;

	const handleTabChange = (val: string) => {
		const tabVal = val as OrderTabValue;
		if (onTabChange) {
			onTabChange(tabVal);
		}
		setInternalTab(tabVal);
	};

	const serialNo = (data.orderDetails?.serialNo || data.id || "").replace(/[<>'"` ]/g, "").trim();

	const tabLabels: Record<OrderTabValue, string> = {
		"project-details": t(localizationConstants.orderInfoSection),
		offer: t(localizationConstants.orderInfoSection),
		inspection: t(localizationConstants.orderInspectionTab),
		organisation: t(localizationConstants.orderOrganisationTab),
		"payment-plan": t(localizationConstants.paymentPlanTitle),
		guarantee: t(localizationConstants.warrantyCommitments),
		protocol: t(localizationConstants.protocolsTab),
	};

	const showSubtitle = !(activeTab === "guarantee" && isGuaranteeDetailOpen);

	return (
		<div className="flex flex-col">
			<Tabs value={activeTab} onValueChange={handleTabChange} className="w-full flex flex-col gap-0">
				{/*
				  Tab bar: border spans full page width via negative margins.
				  Parent context: ml-7 (1.75rem) inside page px-6 (1.5rem) = 3.25rem left, 1.5rem right.
				  -ml-[3.25rem] -mr-6 pushes the div to page edges.
				  pl-[3.25rem] restores tabs to their original horizontal position.
				*/}
				<div className="-ml-[3.25rem] -mr-6 mb-0 overflow-x-auto overflow-y-hidden scrollbar-none border-b border-slate-200 pl-[3.25rem]">
					<TabsList variant="line" className="min-w-max gap-3 sm:gap-6">
						<TabsTrigger value="project-details" className="cursor-pointer">
							{t(localizationConstants.projectDetailsTab)}
						</TabsTrigger>
						<TabsTrigger value="offer" className="cursor-pointer">
							{t(localizationConstants.offerTab)}
						</TabsTrigger>
						<TabsTrigger value="inspection" className="cursor-pointer">
							{t(localizationConstants.orderInspectionTab)}
						</TabsTrigger>
						<TabsTrigger value="organisation" className="cursor-pointer">
							{t(localizationConstants.orderOrganisationTab)}
						</TabsTrigger>
						<TabsTrigger value="payment-plan" className="cursor-pointer">
							{t(localizationConstants.paymentPlanTitle)}
						</TabsTrigger>
						<TabsTrigger value="guarantee" className="cursor-pointer">
							{t(localizationConstants.warrantyCommitments)}
						</TabsTrigger>
						<TabsTrigger value="protocol" className="cursor-pointer">
							{t(localizationConstants.protocolsTab)}
						</TabsTrigger>
					</TabsList>
				</div>

				{/* Active tab subtitle: "Order {serialNo} / Section Name" */}
				{showSubtitle && (
					<p className="pt-4 mb-4 font-sans text-2xl font-semibold leading-8 tracking-normal align-middle">
						{serialNo && (
							<span className="text-slate-400">
								{t(localizationConstants.order)} {serialNo}{" "}
							</span>
						)}
						<span className="text-slate-400 font-normal">/ </span>
						<span className="text-slate-900">{tabLabels[activeTab]}</span>
					</p>
				)}

				{/* Tab 1: Projektuppgifter */}
				<TabsContent value="project-details" className="mt-0 pb-6 focus-visible:outline-none">
					<OrderProjectDetailsView data={data} onUpdateData={onUpdateData} />
				</TabsContent>

				{/* Tab 2: Offert */}
				<TabsContent value="offer" className="mt-0 pb-6 focus-visible:outline-none">
					<OrderOfferView data={data} />
				</TabsContent>

				{/* Tab 3: Besiktning */}
				<TabsContent value="inspection" className="mt-0 pb-6 focus-visible:outline-none">
					<OrderInspectionView orderId={data.id} />
				</TabsContent>

				{/* Tab 4: Organisation — full-width full-bleed with bg-slate-50 */}
				<TabsContent value="organisation" className="mt-0 focus-visible:outline-none">
					<div className="-ml-[3.25rem] -mr-6">
						<OrderOrganisationPage orderId={data.id} hideNavRow />
					</div>
				</TabsContent>

				{/* Tab 5: Betalningsplan */}
				<TabsContent value="payment-plan" className="mt-0 focus-visible:outline-none">
					<OrderPaymentPlanListPage orderId={data.id} hideNavRow />
				</TabsContent>

				{/* Tab 6: Garantiåtaganden */}
				<TabsContent value="guarantee" className="mt-0 focus-visible:outline-none">
					<OrderGuaranteeCommitmentsPage
						orderId={data.id}
						hideNavRow
						onDetailModeChange={setIsGuaranteeDetailOpen}
					/>
				</TabsContent>

				{/* Tab 7: Protokoll */}
				<TabsContent value="protocol" className="mt-0 focus-visible:outline-none">
					<OrderProtocolOverviewPage orderId={data.id} />
				</TabsContent>
			</Tabs>
		</div>
	);
}

export default OrderOpenedSections;

