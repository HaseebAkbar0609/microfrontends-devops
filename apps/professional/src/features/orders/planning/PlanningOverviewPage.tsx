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
		<div className="flex min-h-screen flex-col bg-white text-slate-900 font-sans">
			{/* Page Header with localized breadcrumbs */}
			<div className="sticky top-0 z-40 bg-white">
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
			</div>

			<div className="px-3 sm:px-6 pt-2 sm:pt-3 pb-6 flex flex-col gap-3">
				{/* Tab Bar Navigation */}
				<div className="w-full min-w-0 flex items-center border-b border-slate-200 gap-6 sm:gap-8 overflow-x-auto no-scrollbar whitespace-nowrap">
					{tabs.map((tab) => {
						const isActive = activeTab === tab.id;
						return (
							<button
								key={tab.id}
								type="button"
								onClick={() => setActiveTab(tab.id)}
								className={`py-3 text-xs sm:text-sm font-medium transition-colors border-b-2 cursor-pointer shrink-0 -mb-px ${
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

				{/* Tab Content Container */}
				<div className="mt-1">
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
