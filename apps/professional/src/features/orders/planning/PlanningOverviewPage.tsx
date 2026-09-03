"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { orderBreadcrumbs } from "@/features/orders/data/orderNav.config";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { usePlanning } from "./hooks/usePlanning";
import { PlanningOverviewTab } from "./components/PlanningOverviewTab";
import { PlanningOrderTab } from "./components/PlanningOrderTab";
import { PlanningPersonnelTab } from "./components/PlanningPersonnelTab";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PlanningTab } from "./types/planning.types";

export function PlanningOverviewPage() {
	const { activeTab, setActiveTab, data } = usePlanning();

	const tabs: { id: PlanningTab; labelKey: string }[] = [
		{ id: "overview", labelKey: localizationConstants.planningOverviewTab },
		{ id: "order", labelKey: localizationConstants.planningOrderTab },
		{ id: "personnel", labelKey: localizationConstants.planningPersonnelTab },
	];

	return (
		<div className="flex flex-1 flex-col bg-white text-slate-900 font-sans">
			{/* Page Title with Breadcrumbs directly below it */}
			<PageHeader
				title={localizationConstants.breadcrumbPlanning}
				breadcrumbs={orderBreadcrumbs(localizationConstants.breadcrumbPlanning)}
				className="border-b-0 px-6 pt-5 pb-2"
			/>

			<div className="px-6 pt-2 pb-6 flex flex-col gap-3">
				{/* Tab Bar Navigation with Accessible ARIA semantics & responsive horizontal scroll */}
				<div className="border-b border-slate-200 h-[36px] -mb-[1px]">
					<Tabs
						value={activeTab}
						onValueChange={(val) => setActiveTab(val as PlanningTab)}
					>
						<TabsList variant="line" className="h-[36px]">
							{tabs.map((tab) => (
								<TabsTrigger
									key={tab.id}
									value={tab.id}
									className="cursor-pointer"
								>
									<Translate text={tab.labelKey} />
								</TabsTrigger>
							))}
						</TabsList>
					</Tabs>
				</div>

				{/* Tab Content Container */}
				<div
					id={`tabpanel-${activeTab}`}
					role="tabpanel"
					aria-labelledby={`tab-${activeTab}`}
					className="mt-1"
				>
					{activeTab === "overview" && <PlanningOverviewTab />}
					{activeTab === "order" && <PlanningOrderTab />}
					{activeTab === "personnel" && (
						<PlanningPersonnelTab resources={data.resources} />
					)}
				</div>
			</div>
		</div>
	);
}

export default PlanningOverviewPage;
