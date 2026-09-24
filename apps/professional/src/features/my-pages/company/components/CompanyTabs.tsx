"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryParams } from "@/hooks/useQueryParams";
import { Translate } from "@/utils/translation/translate";
import {
	COMPANY_TAB_IDS,
	COMPANY_TABS,
	CompanyTabId,
} from "../types";
import CompanyInfoTab from "./CompanyInfoTab";
import MessagesTab from "./MessagesTab";
import NewsTab from "./NewsTab";
import OrganisationTab from "./OrganisationTab";
import UpdatesTab from "./UpdatesTab";
import WhistleblowerTab from "./WhistleblowerTab";

const isCompanyTabId = (value: string | null): value is CompanyTabId =>
	COMPANY_TAB_IDS.includes(value as CompanyTabId);

export default function CompanyTabs() {
	const { query, changeQueries } = useQueryParams();
	const tabParam = query.get("tab");
	const activeTab: CompanyTabId = isCompanyTabId(tabParam)
		? tabParam
		: "info";
	const setActiveTab = (value: string) =>
		changeQueries({ tab: value === "info" ? null : value });

	return (
		<div className="space-y-6">
			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className="w-full"
			>
				<div className="px-5 border-b border-slate-200 mb-6">
					<TabsList
						variant="line"
						className="h-auto gap-6 rounded-none px-0 p-0 -mb-px"
					>
						{COMPANY_TABS.map((tab) => (
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
				<div className="px-6 pb-6">
					<TabsContent value="info">
						<CompanyInfoTab />
					</TabsContent>
					<TabsContent value="organisation">
						<OrganisationTab />
					</TabsContent>
					<TabsContent value="messages">
						<MessagesTab />
					</TabsContent>
					<TabsContent value="news">
						<NewsTab />
					</TabsContent>
					<TabsContent value="whistleblower">
						<WhistleblowerTab />
					</TabsContent>
					<TabsContent value="updates">
						<UpdatesTab />
					</TabsContent>
				</div>
			</Tabs>
		</div>
	);
}
