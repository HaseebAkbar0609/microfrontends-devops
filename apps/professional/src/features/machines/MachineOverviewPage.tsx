"use client";

import { useState } from "react";
import { ModulePageHeader } from "@/components/layout/navigation";
import {
	MACHINE_MODULE_TITLE,
	machineBreadcrumbs,
} from "@/features/machines/data/machineNav.config";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { MachineListTab } from "./components/MachineListTab";
import { MachineGanttTab } from "./components/MachineGanttTab";

type MachineTab = "overview" | "gantt";

/**
 * Machine overview (TFS-803) — the machine register for the Production module.
 * Layout follows the Figma frame "Maskin - Översikt": module header with
 * breadcrumbs, an Overview / Gantt-schema tab row, then the searchable and
 * sortable machine table.
 */
export function MachineOverviewPage() {
	const [activeTab, setActiveTab] = useState<MachineTab>("overview");

	const tabs: { id: MachineTab; labelKey: string }[] = [
		{ id: "overview", labelKey: localizationConstants.machineTabOverview },
		{ id: "gantt", labelKey: localizationConstants.machineTabGantt },
	];

	return (
		<div className="flex h-full flex-col bg-slate-50/50">
			<ModulePageHeader
				title={MACHINE_MODULE_TITLE}
				breadcrumbs={machineBreadcrumbs(
					localizationConstants.machineOverviewBreadcrumb
				)}
			/>

			<div className="flex flex-1 flex-col px-6 pt-4 pb-8 overflow-y-auto">
				{/* Tab row: Översikt | Gantt-schema */}
				<div className="flex items-center border-b border-slate-200 gap-6 mb-4 bg-white px-4 rounded-t-lg pt-2">
					{tabs.map((tab) => (
						<button
							key={tab.id}
							type="button"
							onClick={() => setActiveTab(tab.id)}
							className={`pb-3 text-sm font-medium transition-colors relative cursor-pointer ${
								activeTab === tab.id
									? "text-slate-900 font-semibold border-b-2 border-slate-900 -mb-px"
									: "text-slate-500 hover:text-slate-800"
							}`}
						>
							<Translate text={tab.labelKey} />
						</button>
					))}
				</div>

				<div className="flex-1">
					{activeTab === "overview" ? <MachineListTab /> : <MachineGanttTab />}
				</div>
			</div>
		</div>
	);
}

export default MachineOverviewPage;
