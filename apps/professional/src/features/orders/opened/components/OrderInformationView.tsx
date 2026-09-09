"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { OrderOpenedData } from "../types/orderOpened.types";
import { OrderProjectDetailsView } from "./OrderProjectDetailsView";
import { OrderOfferView } from "./OrderOfferView";

export interface OrderInformationViewProps {
	data: OrderOpenedData;
	onUpdateData?: (updated: Partial<OrderOpenedData>) => void;
}

export function OrderInformationView({ data, onUpdateData }: OrderInformationViewProps) {
	const [activeSubTab, setActiveSubTab] = useState<"project-details" | "offer">("project-details");

	return (
		<div className="w-full flex flex-col">
			<Tabs
				value={activeSubTab}
				onValueChange={(val) => setActiveSubTab(val as "project-details" | "offer")}
				className="w-full flex flex-col"
			>
				<TabsList variant="line" className="mb-4">
					<TabsTrigger value="project-details" className="cursor-pointer">
						<Translate text={localizationConstants.projectDetailsTab} />
					</TabsTrigger>
					<TabsTrigger value="offer" className="cursor-pointer">
						<Translate text={localizationConstants.offerTab} />
					</TabsTrigger>
				</TabsList>

				<TabsContent value="project-details" className="mt-0 pb-6 focus-visible:outline-none">
					<OrderProjectDetailsView data={data} onUpdateData={onUpdateData} />
				</TabsContent>

				<TabsContent value="offer" className="mt-0 pb-6 focus-visible:outline-none">
					<OrderOfferView data={data} />
				</TabsContent>
			</Tabs>
		</div>
	);
}

export default OrderInformationView;
