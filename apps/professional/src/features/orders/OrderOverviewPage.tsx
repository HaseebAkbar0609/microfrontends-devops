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
		<div className="flex flex-1 flex-col bg-slate-50/50">
			{/* Page Title with Breadcrumbs directly below it */}
			<PageHeader
				title={localizationConstants.orderOverview}
				breadcrumbs={orderBreadcrumbs(localizationConstants.orderOverview)}
				className="border-b-0 px-6 pt-5 pb-2"
			/>

			{/* Main Content Area */}
			<div className="flex flex-1 flex-col px-6 pt-2 pb-8 overflow-y-auto">
				<Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
					<div className="flex items-center border-b border-slate-200 mb-4 bg-white px-4 rounded-t-lg h-[44px]">
						<TabsList variant="line" className="h-[36px]">
							<TabsTrigger value="list" className="cursor-pointer">
								<Translate text={localizationConstants.orderList} />
							</TabsTrigger>
							<TabsTrigger value="gantt" className="cursor-pointer">
								<Translate text={localizationConstants.orderGanttSchema} />
							</TabsTrigger>
						</TabsList>
					</div>

					<TabsContent value="list" className="mt-0">
						<OrderListTab />
					</TabsContent>
					<TabsContent value="gantt" className="mt-0">
						<OrderGanttTab />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}

export default OrderOverviewPage;
