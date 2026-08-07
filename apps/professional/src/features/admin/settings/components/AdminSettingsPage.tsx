"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DynamicBreadcrumb } from "@/components/common";
import { useQueryParams } from "@/hooks/useQueryParams";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import ModuleSettingsTab from "./ModuleSettingsTab";

const TAB_IDS = ["module", "system"] as const;

type AdminSettingsTabId = (typeof TAB_IDS)[number];

const TABS: { id: AdminSettingsTabId; labelKey: string }[] = [
	{ id: "module", labelKey: localizationConstants.adminSettingsTabModule },
	{ id: "system", labelKey: localizationConstants.adminSettingsTabSystem },
];

const isTabId = (value: string | null): value is AdminSettingsTabId =>
	TAB_IDS.includes(value as AdminSettingsTabId);

const AdminSettingsPage = () => {
	const { query, changeQueries } = useQueryParams();
	const tabParam = query.get("tab");
	const activeTab: AdminSettingsTabId = isTabId(tabParam)
		? tabParam
		: "module";
	const setActiveTab = (value: string) =>
		changeQueries({ tab: value === "module" ? null : value });

	return (
		<div className="flex flex-col gap-5 p-6">
			<div>
				<h1 className="text-2xl font-bold text-slate-900">
					<Translate text={localizationConstants.adminSetting} />
				</h1>
				<DynamicBreadcrumb
					variant="small"
					className="mt-1"
					items={[
						{
							translationKey: localizationConstants.adminItem,
						},
						{
							translationKey: localizationConstants.adminSetting,
						},
					]}
				/>
			</div>

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
						{TABS.map((tab) => (
							<TabsTrigger
								key={tab.id}
								value={tab.id}
								className="px-0 text-slate-600 data-[state=active]:px-3 data-[state=active]:text-slate-900"
							>
								<Translate text={tab.labelKey} />
							</TabsTrigger>
						))}
					</TabsList>
				</div>
				<TabsContent value="module">
					<ModuleSettingsTab />
				</TabsContent>
				<TabsContent value="system">
					<div className="rounded-md border border-slate-200 bg-white p-10 text-center text-sm text-slate-600">
						<Translate text={localizationConstants.comingSoon} />
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default AdminSettingsPage;
