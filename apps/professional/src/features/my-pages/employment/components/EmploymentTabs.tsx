"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryParams } from "@/hooks/useQueryParams";
import { Translate } from "@/utils/translation/translate";
import {
	EMPLOYMENT_TAB_IDS,
	EMPLOYMENT_TABS,
	EmploymentTabId,
} from "../constants/data";
import DocumentsTab from "./DocumentsTab";
import EmploymentContractCard from "./EmploymentContractCard";
import LeaveTab from "./LeaveTab";
import PayslipTab from "./PayslipTab";
import SickReportTab from "./SickReportTab";

const isEmploymentTabId = (value: string | null): value is EmploymentTabId =>
	EMPLOYMENT_TAB_IDS.includes(value as EmploymentTabId);

export default function EmploymentTabs() {
	const { query, changeQueries } = useQueryParams();
	const tabParam = query.get("tab");
	const activeTab: EmploymentTabId = isEmploymentTabId(tabParam)
		? tabParam
		: "contract";
	const setActiveTab = (value: string) =>
		changeQueries({ tab: value === "contract" ? null : value });

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
						{EMPLOYMENT_TABS.map((tab) => (
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
					<TabsContent value="contract">
						<EmploymentContractCard />
					</TabsContent>
					<TabsContent value="sickReport">
						<SickReportTab />
					</TabsContent>
					<TabsContent value="leave">
						<LeaveTab />
					</TabsContent>
					<TabsContent value="payslip">
						<PayslipTab />
					</TabsContent>
					<TabsContent value="documents">
						<DocumentsTab />
					</TabsContent>
				</div>
			</Tabs>
		</div>
	);
}
