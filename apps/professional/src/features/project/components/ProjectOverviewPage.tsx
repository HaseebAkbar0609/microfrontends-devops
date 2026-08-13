"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/PageHeader";
import { useQueryParams } from "@/hooks/useQueryParams";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { PROJECT_OVERVIEW_BREADCRUMBS } from "../constants";
import ProjectListTab from "./ProjectListTab";

const PROJECT_OVERVIEW_TAB_IDS = ["list", "gantt"] as const;

type ProjectOverviewTabId = (typeof PROJECT_OVERVIEW_TAB_IDS)[number];

const PROJECT_OVERVIEW_TABS: { id: ProjectOverviewTabId; label: string }[] = [
	{ id: "list", label: localizationConstants.projectListTab },
	{ id: "gantt", label: localizationConstants.projectListGanttTab },
];

const isProjectOverviewTabId = (
	value: string | null,
): value is ProjectOverviewTabId =>
	PROJECT_OVERVIEW_TAB_IDS.includes(value as ProjectOverviewTabId);

const ProjectOverviewPage = () => {
	const { query, changeQueries } = useQueryParams();
	const tabParam = query.get("tab");
	const activeTab: ProjectOverviewTabId = isProjectOverviewTabId(tabParam)
		? tabParam
		: "list";
	const setActiveTab = (value: string) =>
		changeQueries({ tab: value === "list" ? null : value });

	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<PageHeader
				title={localizationConstants.projectSubOverview}
				breadcrumbs={PROJECT_OVERVIEW_BREADCRUMBS}
			/>
			<div className="flex-1 p-6">
				<Tabs
					value={activeTab}
					onValueChange={setActiveTab}
					className="w-full"
				>
					<div className="border-b border-slate-200 mb-6">
						<TabsList
							variant="line"
							className="h-auto gap-6 rounded-none px-0 p-0 -mb-px"
						>
							{PROJECT_OVERVIEW_TABS.map((tab) => (
								<TabsTrigger
									key={tab.id}
									value={tab.id}
									className="px-0 text-slate-600 data-[state=active]:px-3 data-[state=active]:text-slate-900"
								>
									<Translate text={tab.label} />
								</TabsTrigger>
							))}
						</TabsList>
					</div>
					<TabsContent value="list">
						<ProjectListTab />
					</TabsContent>
					<TabsContent value="gantt">
						<div className="flex flex-col gap-3">
							<h2 className="text-xl font-semibold text-slate-900">
								<Translate
									text={
										localizationConstants.projectListGanttTab
									}
								/>
							</h2>
							<p className="text-sm text-slate-500">
								<Translate
									text={localizationConstants.comingSoonMessage}
								/>
							</p>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
};

export default ProjectOverviewPage;
