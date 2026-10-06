"use client";

import React from "react";
import Link from "next/link";
import { Clock, Layers, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	PERSONNEL_NAV_ITEMS,
	PERSONNEL_MODULE_BASE_URL,
	personnelBreadcrumbs,
} from "../../constants/personnelNav.config";
import { WorktimeGroupView } from "./group/WorktimeGroupView";

const TAB_ICON_MAP: Record<string, React.ElementType> = {
	dashboard: Layers,
	overview: Users,
	worktime: Clock,
};

export function PersonnelWorktimePage() {
	return (
		<div className="flex flex-1 flex-col bg-slate-50/50 min-h-screen">
			{/* Standardized PageHeader */}
			<PageHeader
				title={localizationConstants.personnel}
				breadcrumbs={personnelBreadcrumbs(localizationConstants.worktimeTab)}
				className="border-b-0 px-6 pt-5 pb-2"
			/>

			<div className="flex flex-1 flex-col px-6 pt-2 pb-8 overflow-y-auto space-y-4">
				{/* Level 1 Navigation Tabs: Dashboard | Personnel Overview | Worktime */}
				<div className="flex items-center border-b border-slate-200 bg-white px-4 rounded-t-lg h-[44px] shadow-xs">
					<Tabs defaultValue="worktime" className="w-full">
						<TabsList variant="line" className="h-[36px] overflow-x-auto">
							{PERSONNEL_NAV_ITEMS.map((item) => {
								const Icon = TAB_ICON_MAP[item.id] || Users;
								return (
									<TabsTrigger key={item.id} value={item.id} className="cursor-pointer gap-1.5" asChild>
										<Link href={item.href || PERSONNEL_MODULE_BASE_URL}>
											<Icon className="w-3.5 h-3.5 shrink-0" />
											<Translate text={item.labelKey || ""} />
										</Link>
									</TabsTrigger>
								);
							})}
						</TabsList>
					</Tabs>
				</div>

				{/* Worktime Group Overview (TFS-987 Group by Person & TFS-988 Group by Project) */}
				<WorktimeGroupView />
			</div>
		</div>
	);
}
