"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { OrderOpenedData } from "../types/orderOpened.types";
import { OrderProjectDetailsView } from "./OrderProjectDetailsView";
import { OrderOfferView } from "./OrderOfferView";
import { OrderPaymentPlanListPage } from "@/features/orders/payment-plan/OrderPaymentPlanListPage";
import { OrderOrganisationPage } from "@/features/orders/organisation/OrderOrganisationPage";

export interface OrderOpenedSectionsProps {
	data: OrderOpenedData;
	onUpdateData?: (updated: Partial<OrderOpenedData>) => void;
}

type OrderTabValue =
	| "project-details"
	| "offer"
	| "organisation"
	| "payment-plan";

export function OrderOpenedSections({ data, onUpdateData }: OrderOpenedSectionsProps) {
	const t = useTranslate();
	const [activeTab, setActiveTab] = useState<OrderTabValue>("project-details");

	const serialNo = (data.orderDetails?.serialNo || data.id || "").replace(/[<>'"` ]/g, "").trim();

	const tabLabels: Record<OrderTabValue, string> = {
		"project-details": t(localizationConstants.orderInfoSection),
		offer: t(localizationConstants.orderInfoSection),
		organisation: t(localizationConstants.orderOrganisationTab),
		"payment-plan": t(localizationConstants.paymentPlanTitle),
	};

	return (
		<div className="flex flex-col">
			<Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as OrderTabValue)} className="w-full flex flex-col">
				{/*
				  Tab bar: border spans full page width via negative margins.
				  Parent context: ml-7 (1.75rem) inside page px-6 (1.5rem) = 3.25rem left, 1.5rem right.
				  -ml-[3.25rem] -mr-6 pushes the div to page edges.
				  pl-[3.25rem] restores tabs to their original horizontal position.
				*/}
				<div className="-ml-[3.25rem] -mr-6 mb-2 overflow-x-auto overflow-y-hidden scrollbar-none border-b border-slate-200 pl-[3.25rem]">
					<TabsList variant="line" className="min-w-max">
						<TabsTrigger value="project-details" className="cursor-pointer">
							{t(localizationConstants.projectDetailsTab)}
						</TabsTrigger>
						<TabsTrigger value="offer" className="cursor-pointer">
							{t(localizationConstants.offerTab)}
						</TabsTrigger>
						<TabsTrigger value="organisation" className="cursor-pointer">
							{t(localizationConstants.orderOrganisationTab)}
						</TabsTrigger>
						<TabsTrigger value="payment-plan" className="cursor-pointer">
							{t(localizationConstants.paymentPlanTitle)}
						</TabsTrigger>
					</TabsList>
				</div>

				{/* Active tab subtitle: "Order {serialNo} / Section Name" */}
				<p className="pt-4 mb-4 font-sans text-2xl font-semibold leading-8 tracking-normal align-middle">
					{serialNo && (
						<span className="text-slate-400">
							{t(localizationConstants.order)} {serialNo}{" "}
						</span>
					)}
					<span className="text-slate-400 font-normal">/ </span>
					<span className="text-slate-900">{tabLabels[activeTab]}</span>
				</p>

				{/* Tab 1: Projektuppgifter */}
				<TabsContent value="project-details" className="mt-0 pb-6 focus-visible:outline-none">
					<OrderProjectDetailsView data={data} onUpdateData={onUpdateData} />
				</TabsContent>

				{/* Tab 2: Offert */}
				<TabsContent value="offer" className="mt-0 pb-6 focus-visible:outline-none">
					<OrderOfferView data={data} />
				</TabsContent>

				{/* Tab 3: Organisation — full-width full-bleed with bg-slate-50 */}
				<TabsContent value="organisation" className="mt-0 focus-visible:outline-none">
					<div className="-ml-[3.25rem] -mr-6">
						<OrderOrganisationPage orderId={data.id} hideNavRow />
					</div>
				</TabsContent>

				{/* Tab 4: Betalningsplan */}
				<TabsContent value="payment-plan" className="mt-0 focus-visible:outline-none">
					<OrderPaymentPlanListPage orderId={data.id} hideNavRow />
				</TabsContent>
			</Tabs>
		</div>
	);
}

export default OrderOpenedSections;
