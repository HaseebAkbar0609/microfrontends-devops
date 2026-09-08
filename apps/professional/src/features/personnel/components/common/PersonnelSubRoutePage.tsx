"use client";

import React from "react";
import Link from "next/link";
import {
	Award,
	Clock,
	Heart,
	Layers,
	Sparkles,
	UserPlus,
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
							<TabsTrigger value="dashboard" className="cursor-pointer gap-1.5" asChild>
								<Link href={PERSONNEL_NAV_ITEMS[0]?.href ?? "#"}>
									<Layers className="w-3.5 h-3.5 shrink-0" />
									<Translate text={localizationConstants.personalDashboardTab} />
								</Link>
							</TabsTrigger>
							<TabsTrigger value="overview" className="cursor-pointer gap-1.5" asChild>
								<Link href={PERSONNEL_NAV_ITEMS[1]?.href ?? "#"}>
									<Users className="w-3.5 h-3.5 shrink-0" />
									<Translate text={localizationConstants.personalOverviewTab} />
								</Link>
							</TabsTrigger>
							<TabsTrigger value="create" className="cursor-pointer gap-1.5" asChild>
								<Link href={PERSONNEL_NAV_ITEMS[2]?.href ?? "#"}>
									<UserPlus className="w-3.5 h-3.5 shrink-0" />
									<Translate text={localizationConstants.createEmployeeTab} />
								</Link>
							</TabsTrigger>
							<TabsTrigger value="competences" className="cursor-pointer gap-1.5" asChild>
								<Link href={PERSONNEL_NAV_ITEMS[3]?.href ?? "#"}>
									<Award className="w-3.5 h-3.5 shrink-0" />
									<Translate text={localizationConstants.competencesTab} />
								</Link>
							</TabsTrigger>
							<TabsTrigger value="wellness" className="cursor-pointer gap-1.5" asChild>
								<Link href={PERSONNEL_NAV_ITEMS[4]?.href ?? "#"}>
									<Heart className="w-3.5 h-3.5 shrink-0" />
									<Translate text={localizationConstants.wellnessTab} />
								</Link>
							</TabsTrigger>
							<TabsTrigger value="process" className="cursor-pointer gap-1.5" asChild>
								<Link href={PERSONNEL_NAV_ITEMS[5]?.href ?? "#"}>
									<Sparkles className="w-3.5 h-3.5 shrink-0" />
									<Translate text={localizationConstants.personalProcessesTab} />
								</Link>
							</TabsTrigger>
							<TabsTrigger value="worktime" className="cursor-pointer gap-1.5" asChild>
								<Link href={PERSONNEL_NAV_ITEMS[6]?.href ?? "#"}>
									<Clock className="w-3.5 h-3.5 shrink-0" />
									<Translate text={localizationConstants.worktimeTab} />
								</Link>
							</TabsTrigger>
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
