"use client";

import { PageHeader } from "@/components/common";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs";
import { useQueryParams } from "@/hooks/useQueryParams";
import { isAllowedQueryValue } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	CONSULTANT_DIRECTORY_DEFAULT_TAB,
	CONSULTANT_DIRECTORY_TABS,
	CONSULTANT_DIRECTORY_TAB_VALUES,
	DIRECTORY_BREADCRUMBS,
} from "../constants/directory";
import { ConsultantTypePanel } from "./type/ConsultantTypePanel";
import { ConsultantRequestsPanel } from "./requests/ConsultantRequestsPanel";

export default function ConsultantDirectory() {
	const { query, changeQuery } = useQueryParams();

	const tabParam = query.get("tab");
	const activeTab = isAllowedQueryValue(
		tabParam,
		CONSULTANT_DIRECTORY_TAB_VALUES,
	)
		? tabParam
		: CONSULTANT_DIRECTORY_DEFAULT_TAB;

	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<PageHeader
				title={localizationConstants.consultantDirectoryTitle}
				breadcrumbs={DIRECTORY_BREADCRUMBS}
			/>

			<Tabs
				value={activeTab}
				onValueChange={(value) => changeQuery("tab", value)}
				className="flex-1 gap-0"
			>
				<div className="border-b border-slate-200 px-5">
					<TabsList variant="line" className="h-auto gap-4 p-0">
						{CONSULTANT_DIRECTORY_TABS.map((tab) => (
							<TabsTrigger
								key={tab.value}
								value={tab.value}
								className="flex-none rounded-none px-1 py-3 after:hidden data-[state=active]:border-b-2 data-[state=active]:!border-slate-900"
							>
								<Translate text={tab.label} />
							</TabsTrigger>
						))}
					</TabsList>
				</div>

				<TabsContent value="type" className="flex flex-col">
					<ConsultantTypePanel />
				</TabsContent>
				<TabsContent value="requests">
					<ConsultantRequestsPanel />
				</TabsContent>
			</Tabs>
		</div>
	);
}
