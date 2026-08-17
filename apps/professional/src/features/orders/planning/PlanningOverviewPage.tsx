"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { usePlanning } from "./hooks/usePlanning";
import { PlanningOverviewTab } from "./components/PlanningOverviewTab";
import { PlanningOrderTab } from "./components/PlanningOrderTab";
import { PlanningPersonnelTab } from "./components/PlanningPersonnelTab";
import type { PlanningTab } from "./types/planning.types";

export function PlanningOverviewPage() {
	const { activeTab, setActiveTab, data } = usePlanning();

	const tabs: { id: PlanningTab; labelKey: string }[] = [
		{ id: "overview", labelKey: localizationConstants.planningOverviewTab },
		{ id: "order", labelKey: localizationConstants.planningOrderTab },
		{ id: "personnel", labelKey: localizationConstants.planningPersonnelTab },
	];

	return (
		<div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans">
			{/* Page Header with localized breadcrumbs */}
			<PageHeader
				title={localizationConstants.planningOverviewTab}
				breadcrumbs={[
					{ label: localizationConstants.breadcrumbHome, href: "/" },
					{ label: localizationConstants.breadcrumbModule, href: "/module" },
					{ label: localizationConstants.breadcrumbProduction, href: "/module/production" },
					{ label: localizationConstants.breadcrumbOrder, href: "/module/production/order" },
					{ label: localizationConstants.breadcrumbPlanning, href: "/module/production/order/planning" },
				]}
			/>

			<div className="px-6 py-4 flex flex-col gap-4">
				{/* Tab Bar Navigation with Accessible ARIA semantics */}
				<div className="border-b border-slate-200">
					<div
						className="flex gap-8"
						role="tablist"
						aria-label="Planning Navigation Tabs"
					>
						{tabs.map((tab) => {
							const isActive = activeTab === tab.id;
							return (
								<button
									key={tab.id}
									id={`tab-${tab.id}`}
									role="tab"
									type="button"
									aria-selected={isActive}
									aria-controls={`tabpanel-${tab.id}`}
									tabIndex={isActive ? 0 : -1}
									onClick={() => setActiveTab(tab.id)}
									className={`py-3 text-sm font-medium transition-colors border-b-2 cursor-pointer ${
										isActive
											? "border-slate-900 text-slate-900 font-semibold"
											: "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
									}`}
								>
									<Translate text={tab.labelKey} />
								</button>
							);
						})}
					</div>
				</div>

				{/* Tab Content Container */}
				<div
					id={`tabpanel-${activeTab}`}
					role="tabpanel"
					aria-labelledby={`tab-${activeTab}`}
					className="mt-2"
				>
					{activeTab === "overview" && <PlanningOverviewTab />}
					{activeTab === "order" && <PlanningOrderTab orders={data.orders} />}
					{activeTab === "personnel" && (
						<PlanningPersonnelTab resources={data.resources} />
					)}
				</div>
			</div>
		</div>
	);
}

export default PlanningOverviewPage;
