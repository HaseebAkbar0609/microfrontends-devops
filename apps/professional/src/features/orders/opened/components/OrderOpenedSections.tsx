"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { OrderOpenedData } from "../types/orderOpened.types";
import { OrderProjectDetailsView } from "./OrderProjectDetailsView";
import { OrderOfferView } from "./OrderOfferView";

export interface OrderOpenedSectionsProps {
	data: OrderOpenedData;
	onUpdateData?: (updated: Partial<OrderOpenedData>) => void;
}

export function OrderOpenedSections({ data, onUpdateData }: OrderOpenedSectionsProps) {
	const t = useTranslate();
	const [activeTab, setActiveTab] = useState<string>("project-details");

	return (
		<div className="flex flex-col gap-6">
			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col">
				{/* TabBar with bottom border only spanning tabbar width */}
				<div className="mb-6 inline-flex self-start border-b border-slate-200">
					<TabsList variant="line" className="h-[36px] bg-transparent p-0 gap-6">
						<TabsTrigger value="project-details" className="cursor-pointer text-sm font-medium">
							{t(localizationConstants.projectDetailsTab)}
						</TabsTrigger>
						<TabsTrigger value="offer" className="cursor-pointer text-sm font-medium">
							{t(localizationConstants.offerTab)}
						</TabsTrigger>
					</TabsList>
				</div>

				{/* Tab 1: Projektuppgifter (2x2 Grid matching Node 8533-80209) */}
				<TabsContent value="project-details" className="mt-0 focus-visible:outline-none">
					<OrderProjectDetailsView data={data} onUpdateData={onUpdateData} />
				</TabsContent>

				{/* Tab 2: Offert (Collapsible cards matching Node 8533-80423) */}
				<TabsContent value="offer" className="mt-0 focus-visible:outline-none">
					<OrderOfferView data={data} />
				</TabsContent>
			</Tabs>
		</div>
	);
}

export default OrderOpenedSections;
