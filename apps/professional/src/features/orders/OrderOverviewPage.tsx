"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { orderBreadcrumbs } from "@/features/orders/data/orderNav.config";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { OrderListTab } from "./components/OrderListTab";
import { OrderGanttTab } from "./components/OrderGanttTab";

export function OrderOverviewPage() {
	const [activeTab, setActiveTab] = useState<string>("list");

	return (
		<div className="flex flex-1 flex-col bg-white">
			{/* Page Title with Breadcrumbs directly below it */}
			<PageHeader
				title={localizationConstants.orderOverview}
				breadcrumbs={orderBreadcrumbs(localizationConstants.orderOverview)}
				className="border-b-0 px-6 pt-6 sm:pt-7 pb-2"
			/>

			{/* Main Content Area */}
			<div className="flex flex-1 flex-col px-6 pt-2 pb-8 overflow-y-auto">
				<Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col gap-4 sm:gap-5">
					<TabsList variant="line">
						<TabsTrigger value="list" className="cursor-pointer">
							<Translate text={localizationConstants.orderList} />
						</TabsTrigger>
						<TabsTrigger value="gantt" className="cursor-pointer">
							<Translate text={localizationConstants.orderGanttSchema} />
						</TabsTrigger>
					</TabsList>

					<TabsContent value="list" className="mt-1 sm:mt-2 focus-visible:outline-none">
						<OrderListTab />
					</TabsContent>
					<TabsContent value="gantt" className="mt-1 sm:mt-2 focus-visible:outline-none">
						<OrderGanttTab />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}

export default OrderOverviewPage;
