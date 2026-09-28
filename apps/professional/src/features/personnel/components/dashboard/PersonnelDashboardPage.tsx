"use client";

import React from "react";
import Link from "next/link";
import {
	Clock,
	Layers,
	UserPlus,
	Users,
	Wrench,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	PERSONNEL_NAV_ITEMS,
	PERSONNEL_MODULE_BASE_URL,
	personnelBreadcrumbs,
} from "../../constants/personnelNav.config";
import { PersonnelDashboard } from "./PersonnelDashboard";

const TAB_ICON_MAP: Record<string, React.ElementType> = {
	dashboard: Layers,
	overview: Users,
	equipment: Wrench,
	create: UserPlus,
	worktime: Clock,
};

export function PersonnelDashboardPage() {
	return (
		<div className="flex flex-1 flex-col bg-slate-50/50 min-h-screen">
			{/* Page Header with Breadcrumbs */}
			<PageHeader
				title={localizationConstants.personnel}
				breadcrumbs={personnelBreadcrumbs(localizationConstants.personalDashboardTab)}
				className="border-b-0 px-6 pt-5 pb-2"
			/>

			{/* Main Content Area */}
			<div className="flex flex-1 flex-col px-6 pt-2 pb-8 overflow-y-auto space-y-4">
				{/* Level 2 Sub-Module Navigation Tabs (Edwin's Pattern 2 / Line Tabs) */}
				<div className="flex items-center border-b border-slate-200 bg-white px-4 rounded-t-lg h-[44px] shadow-xs">
					<Tabs defaultValue="dashboard" className="w-full">
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

				{/* 14 Reusable Modular Widgets via ModuleWidgetDashboard */}
				<div className="flex-1">
					<PersonnelDashboard />
				</div>
			</div>
		</div>
	);
}

export default PersonnelDashboardPage;
