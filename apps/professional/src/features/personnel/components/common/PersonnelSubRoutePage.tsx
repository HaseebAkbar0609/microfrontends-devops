"use client";

import React from "react";
import Link from "next/link";
import {
	Clock,
	Layers,
	Users,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ComingSoonPage } from "@/components/common/ComingSoonPage";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	PERSONNEL_NAV_ITEMS,
	personnelBreadcrumbs,
} from "../../constants/personnelNav.config";

const TAB_ICON_MAP: Record<string, React.ElementType> = {
	dashboard: Layers,
	overview: Users,
	worktime: Clock,
};

interface PersonnelSubRoutePageProps {
	activeTabId: string;
	titleKey: string;
}

export function PersonnelSubRoutePage({ activeTabId, titleKey }: PersonnelSubRoutePageProps) {
	return (
		<div className="flex flex-1 flex-col bg-slate-50/50 min-h-screen">
			<PageHeader
				title={localizationConstants.personnel}
				breadcrumbs={personnelBreadcrumbs(titleKey)}
				className="border-b-0 px-6 pt-5 pb-2"
			/>

			<div className="flex flex-1 flex-col px-6 pt-2 pb-8 overflow-y-auto space-y-4">
				<div className="flex items-center border-b border-slate-200 bg-white px-4 rounded-t-lg h-[44px] shadow-xs">
					<Tabs defaultValue={activeTabId} className="w-full">
						<TabsList variant="line" className="h-[36px] overflow-x-auto">
							{PERSONNEL_NAV_ITEMS.map((item) => {
								const Icon = TAB_ICON_MAP[item.id] || Users;
								return (
									<TabsTrigger key={item.id} value={item.id} className="cursor-pointer gap-1.5" asChild>
										<Link href={item.href || "#"}>
											<Icon className="w-3.5 h-3.5 shrink-0" />
											<Translate text={item.labelKey || ""} />
										</Link>
									</TabsTrigger>
								);
							})}
						</TabsList>
					</Tabs>
				</div>

				<div className="flex-1 flex flex-col bg-white rounded-lg border border-slate-200 p-8 shadow-xs">
					<ComingSoonPage />
				</div>
			</div>
		</div>
	);
}
