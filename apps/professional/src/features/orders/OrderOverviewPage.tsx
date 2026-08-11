"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { OrderListTab } from "./components/OrderListTab";
import { OrderGanttTab } from "./components/OrderGanttTab";

export function OrderOverviewPage() {
	const [activeTab, setActiveTab] = useState<"list" | "gantt">("list");

	return (
		<div className="flex h-full flex-col bg-slate-50/50">
			{/* Page Header with Breadcrumbs */}
			<PageHeader
				title={localizationConstants.orderOverview}
				breadcrumbs={[
					{ label: localizationConstants.home, href: "/dashboard" },
					{ label: localizationConstants.moduleItem, href: "/module/business" },
					{ label: localizationConstants.production, href: "/module/production" },
					{ label: localizationConstants.orderModule, href: "/module/production/order/overview" },
					{ label: localizationConstants.orderOverview },
				]}
			/>

			{/* Main Content Area */}
			<div className="flex flex-1 flex-col px-6 pt-4 pb-8 overflow-y-auto">
				{/* Tabs Navigation */}
				<div className="flex items-center border-b border-slate-200 gap-6 mb-4 bg-white px-4 rounded-t-lg pt-2">
					<button
						type="button"
						onClick={() => setActiveTab("list")}
						className={`pb-3 text-sm font-medium transition-colors relative cursor-pointer ${
							activeTab === "list"
								? "text-slate-900 font-semibold border-b-2 border-slate-900 -mb-px"
								: "text-slate-500 hover:text-slate-800"
						}`}
					>
						<Translate text={localizationConstants.orderList} />
					</button>

					<button
						type="button"
						onClick={() => setActiveTab("gantt")}
						className={`pb-3 text-sm font-medium transition-colors relative cursor-pointer ${
							activeTab === "gantt"
								? "text-slate-900 font-semibold border-b-2 border-slate-900 -mb-px"
								: "text-slate-500 hover:text-slate-800"
						}`}
					>
						<Translate text={localizationConstants.orderGanttSchema} />
					</button>
				</div>

				{/* Active Tab View */}
				<div className="flex-1">
					{activeTab === "list" ? <OrderListTab /> : <OrderGanttTab />}
				</div>
			</div>
		</div>
	);
}

export default OrderOverviewPage;
