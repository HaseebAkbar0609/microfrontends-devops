"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useOrderTimeplanDetail } from "../../hooks/useOrderTimeplanDetail";
import { TIMEPLAN_CONSTANTS } from "../../constants/timeplan.constants";
import type { OrderTimeplan } from "../../types/timeplan.types";
import { OrderTimeplanViewGanttTab } from "./OrderTimeplanViewGanttTab";
import { OrderTimeplanViewInfoTab } from "./OrderTimeplanViewInfoTab";

interface OrderTimeplanDetailViewProps {
	orderId?: string;
	plan: OrderTimeplan | null;
	onClose: () => void;
}

export function OrderTimeplanDetailView({
	orderId = TIMEPLAN_CONSTANTS.DEFAULT_ORDER_ID,
	plan: initialPlan,
	onClose,
}: OrderTimeplanDetailViewProps) {
	const t = useTranslate();
	const [activeTab, setActiveTab] = useState<"timeline" | "info">("timeline");

	const {
		isLoading: _isLoading,
		plan,
		tasks,
		formData,
		handleFormChange,
		handleAddTask,
	} = useOrderTimeplanDetail({
		orderId,
		planId: initialPlan?.id,
		initialPlan,
	});

	return (
		<div className="flex flex-col flex-1 min-h-[calc(100vh-140px)] -ml-4 sm:-ml-[3.25rem] -mr-4 sm:-mr-6 -mt-px -mb-4 px-3 sm:px-6 pt-5 sm:pt-7 pb-10 bg-slate-50 justify-between font-sans">
			<div className="flex flex-col flex-1 space-y-5 w-full">
				{/* Top Header matching Figma: "← View tidsplan" */}
				<div className="flex items-center gap-2.5 pb-1">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={onClose}
						className="size-7 shrink-0 rounded-md text-slate-900 hover:bg-slate-200/60 cursor-pointer flex items-center justify-center p-0 shadow-none"
						aria-label={t(localizationConstants.orderTimeplanBtnBackTo)}
					>
						<ArrowLeft className="size-5 text-slate-900" aria-hidden="true" />
					</Button>
					<h1 className="font-sans font-semibold text-xl sm:text-2xl leading-8 text-slate-900">
						<Translate text={localizationConstants.orderTimeplanViewPageTitle} />
					</h1>
				</div>

				{/* Sub-Navigation Tabs using shared project line-variant TabsList */}
				<Tabs
					value={activeTab}
					onValueChange={(val) => setActiveTab(val as "timeline" | "info")}
					className="w-full gap-4"
				>
					<div className="w-full pl-0 sm:pl-7">
						<TabsList variant="line" className="gap-6 sm:gap-8 bg-transparent p-0 -mb-px">
							<TabsTrigger value="timeline" className="px-0 sm:px-0">
								<Translate text={localizationConstants.orderTimeplanSubTabTimeline} />
							</TabsTrigger>
							<TabsTrigger value="info" className="px-0 sm:px-0">
								<Translate text={localizationConstants.orderTimeplanSubTabInfo} />
							</TabsTrigger>
						</TabsList>
					</div>

					{/* Tab Contents */}
					<TabsContent value="timeline" className="mt-2 outline-none">
						<OrderTimeplanViewGanttTab
							plan={plan}
							tasks={tasks}
							onAddTask={handleAddTask}
						/>
					</TabsContent>

					<TabsContent value="info" className="mt-2 outline-none">
						<OrderTimeplanViewInfoTab
							plan={plan}
							formData={formData}
							onChange={handleFormChange}
							readOnly={true}
						/>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}

export default OrderTimeplanDetailView;
