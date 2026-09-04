"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { machineBreadcrumbs } from "@/features/machines/data/machineNav.config";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MachineListTab } from "./components/MachineListTab";
import { MachineGanttTab } from "./components/MachineGanttTab";

/**
 * Machine overview (TFS-803 / TFS-955) — the machine register for the Production module.
 * Standardized 2-level tabs: ModuleHeader (Level 1) + Page Tabs (Level 2: Översikt / Gantt-schema).
 */
export function MachineOverviewPage() {
	const [activeTab, setActiveTab] = useState<string>("overview");

	return (
		<div className="flex flex-1 flex-col bg-slate-50/50">
			{/* Page Title with Breadcrumbs */}
			<PageHeader
				title={localizationConstants.machineOverviewTitle}
				breadcrumbs={machineBreadcrumbs(
					localizationConstants.machineOverviewBreadcrumb,
				)}
				className="border-b-0 px-6 pt-5 pb-2"
			/>

			{/* Main Content Area with 2-level Tab Row */}
			<div className="flex flex-1 flex-col px-6 pt-2 pb-8 overflow-y-auto">
				<Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
					<div className="flex items-center border-b border-slate-200 mb-4 bg-white px-4 rounded-t-lg h-[44px]">
						<TabsList variant="line" className="h-[36px]">
							<TabsTrigger value="overview" className="cursor-pointer">
								<Translate text={localizationConstants.machineTabOverview} />
							</TabsTrigger>
							<TabsTrigger value="gantt" className="cursor-pointer">
								<Translate text={localizationConstants.machineTabGantt} />
							</TabsTrigger>
						</TabsList>
					</div>

					<TabsContent value="overview" className="mt-0">
						<MachineListTab />
					</TabsContent>
					<TabsContent value="gantt" className="mt-0">
						<MachineGanttTab />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}

export default MachineOverviewPage;
