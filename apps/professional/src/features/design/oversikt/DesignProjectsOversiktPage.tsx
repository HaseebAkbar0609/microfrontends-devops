"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryParams } from "@/hooks/useQueryParams";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import DesignProjectsGantt from "./DesignProjectsGantt";
import DesignProjectsListTab from "./DesignProjectsListTab";

const OVERSIKT_TAB_IDS = ["list", "gantt"] as const;
type OversiktTabId = (typeof OVERSIKT_TAB_IDS)[number];

const OVERSIKT_TABS: { id: OversiktTabId; labelKey: string }[] = [
	{ id: "list", labelKey: localizationConstants.designProjectsListTab },
	{ id: "gantt", labelKey: localizationConstants.designProjectsGanttTab },
];

const isOversiktTabId = (value: string | null): value is OversiktTabId =>
	OVERSIKT_TAB_IDS.includes(value as OversiktTabId);

const DesignProjectsOversiktPage = () => {
	const { query, changeQueries } = useQueryParams();
	const tabParam = query.get("tab");
	const activeTab: OversiktTabId = isOversiktTabId(tabParam) ? tabParam : "list";
	const setActiveTab = (value: string) =>
		changeQueries({ tab: value === "list" ? null : value });

	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
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
							{OVERSIKT_TABS.map((tab) => (
								<TabsTrigger
									key={tab.id}
									value={tab.id}
									className="cursor-pointer px-0 text-slate-600 data-[state=active]:px-3 data-[state=active]:text-slate-900"
								>
									<Translate text={tab.labelKey} />
								</TabsTrigger>
							))}
						</TabsList>
					</div>
					<TabsContent value="list">
						<DesignProjectsListTab />
					</TabsContent>
					<TabsContent value="gantt">
						<div className="rounded-md border border-slate-200 bg-white">
							<DesignProjectsGantt />
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
};

export default DesignProjectsOversiktPage;
