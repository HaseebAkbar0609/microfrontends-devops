"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { OrderOpenedData } from "../types/orderOpened.types";
import { OrderProjectDetailsView } from "./OrderProjectDetailsView";
import { OrderOfferView } from "./OrderOfferView";
import { OrderInspectionView } from "./inspection/OrderInspectionView";

export interface OrderOpenedSectionsProps {
	data: OrderOpenedData;
	onUpdateData?: (updated: Partial<OrderOpenedData>) => void;
	activeTab?: string;
	onTabChange?: (tab: string) => void;
}

export function OrderOpenedSections({
	data,
	onUpdateData,
	activeTab: controlledActiveTab,
	onTabChange,
}: OrderOpenedSectionsProps) {
	const t = useTranslate();
	const [internalTab, setInternalTab] = useState<string>("project-details");

	const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalTab;

	const handleTabChange = (val: string) => {
		if (onTabChange) {
			onTabChange(val);
		} else {
			setInternalTab(val);
		}
	};

	return (
		<div className="flex flex-col gap-6">
			<Tabs
				value={activeTab}
				onValueChange={handleTabChange}
				className="w-full flex flex-col"
			>
				{/* TabBar with border line only spanning the tabbar width */}
				<div className="mb-6 overflow-x-auto scrollbar-none">
					<TabsList
						variant="line"
						className="h-[36px] bg-transparent p-0 gap-1 sm:gap-2 min-w-max inline-flex self-start border-b border-slate-200"
					>
						<TabsTrigger
							value="project-details"
							className="relative inline-flex items-center justify-center h-[36px] px-3 sm:px-4.5 pb-2 pt-1 font-sans text-sm font-semibold leading-none tracking-normal text-center whitespace-nowrap transition-colors cursor-pointer border-0 text-slate-500 hover:text-slate-900 data-[state=active]:text-slate-950 data-[state=active]:shadow-none after:hidden"
						>
							{t(localizationConstants.projectDetailsTab)}
							{activeTab === "project-details" && (
								<span className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-950 z-10" />
							)}
						</TabsTrigger>
						<TabsTrigger
							value="offer"
							className="relative inline-flex items-center justify-center h-[36px] px-3 sm:px-4.5 pb-2 pt-1 font-sans text-sm font-semibold leading-none tracking-normal text-center whitespace-nowrap transition-colors cursor-pointer border-0 text-slate-500 hover:text-slate-900 data-[state=active]:text-slate-950 data-[state=active]:shadow-none after:hidden"
						>
							{t(localizationConstants.offerTab)}
							{activeTab === "offer" && (
								<span className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-950 z-10" />
							)}
						</TabsTrigger>
						<TabsTrigger
							value="inspection"
							className="relative inline-flex items-center justify-center h-[36px] px-3 sm:px-4.5 pb-2 pt-1 font-sans text-sm font-semibold leading-none tracking-normal text-center whitespace-nowrap transition-colors cursor-pointer border-0 text-slate-500 hover:text-slate-900 data-[state=active]:text-slate-950 data-[state=active]:shadow-none after:hidden"
						>
							{t(localizationConstants.orderInspectionTab)}
							{activeTab === "inspection" && (
								<span className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-950 z-10" />
							)}
						</TabsTrigger>
					</TabsList>
				</div>

				{/* Tab 1: Projektuppgifter (2x2 Grid matching Node 8533-80209) */}
				<TabsContent
					value="project-details"
					className="mt-0 focus-visible:outline-none"
				>
					<OrderProjectDetailsView data={data} onUpdateData={onUpdateData} />
				</TabsContent>

				{/* Tab 2: Offert (Collapsible cards matching Node 8533-80423) */}
				<TabsContent value="offer" className="mt-0 focus-visible:outline-none">
					<OrderOfferView data={data} />
				</TabsContent>

				{/* Tab 3: Besiktning (Matching TFS-467) */}
				<TabsContent value="inspection" className="mt-0 focus-visible:outline-none">
					<OrderInspectionView orderId={data.id} />
				</TabsContent>
			</Tabs>
		</div>
	);
}

export default OrderOpenedSections;
