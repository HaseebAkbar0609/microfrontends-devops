"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LeadRow } from "@/features/leads/types";
import { leadDetailTabs } from "@/features/leads/management/constants";
import { useLeadRequestDetails } from "@/features/leads/queries/useLeadRequestDetails";
import { previewRequestDetails } from "@/features/leads/management/constants/previewRequestDetails";
import { useLeadQuoteList } from "@/features/leads/queries/useLeadQuoteList";
import LeadDetailHeaderActions from "@/features/leads/management/components/LeadDetailHeaderActions";
import LeadOverviewTab from "@/features/leads/management/components/LeadOverviewTab";
import LeadQuoteListTab from "@/features/leads/management/components/LeadQuoteListTab";
import LeadRequestTab from "@/features/leads/management/components/LeadRequestTab";

type LeadDetailViewProps = {
	lead: LeadRow;
};

export default function LeadDetailView({ lead }: LeadDetailViewProps) {
	// const t = useTranslate();
	const searchParams = useSearchParams();
	const [activeTab, setActiveTab] = useState(() => searchParams.get("tab") ?? "overview");
	const [monitorStatus, setMonitorStatus] = useState("monitor");

	const title = `${lead.customer} - ${lead.category}`;
	const requestDetailsQuery = useLeadRequestDetails(lead.id);
	const quoteListQuery = useLeadQuoteList(lead.leadId);
	const requestDetails = requestDetailsQuery.data ?? previewRequestDetails;
	const quoteRows = quoteListQuery.data ?? [];
	const isMonitoringView = searchParams.get("source") === "monitoring";
	const showArchiveAction =
		isMonitoringView && (activeTab === "request" || activeTab === "quote-list");
	const detailTabs = useMemo(() => {
		if (!isMonitoringView) return leadDetailTabs;
		return [
			leadDetailTabs[0],
			leadDetailTabs[1],
			{ value: "quote-list", labelKey: localizationConstants.quoteListTab },
			{ value: "activity", labelKey: localizationConstants.activityLogsTab },
		];
	}, [isMonitoringView]);

	return (
		<div className="flex h-full flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
			<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
				<div className="flex flex-col gap-1">
					<h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
					<DynamicBreadcrumb
						className="text-xs text-slate-500 [&_a]:text-slate-500 [&_a:hover]:text-slate-700"
						separator={<span className="px-1">›</span>}
						items={[
							{
								label: <Translate text={localizationConstants.leads} />,
								href: "/leads/management",
							},
							{
								label: <Translate text={localizationConstants.leadsManagement} />,
								href: "/leads/management",
							},
							{ label: title },
						]}
					/>
				</div>

				<LeadDetailHeaderActions
					isMonitoringView={isMonitoringView}
					showArchiveAction={showArchiveAction}
					monitorStatus={monitorStatus}
					onMonitorStatusChange={setMonitorStatus}
				/>
			</div>

			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				<TabsList
					variant="line"
					className="w-full justify-start gap-3 border-b border-slate-200 p-0"
				>
					{detailTabs.map((tab) => (
						<TabsTrigger
							key={tab.value}
							value={tab.value}
							className="w-fit flex-none px-6 py-3 text-sm"
						>
							<Translate text={tab.labelKey} />
						</TabsTrigger>
					))}
				</TabsList>

				<TabsContent value="overview" className="pt-6">
					<LeadOverviewTab
						lead={lead}
						projectType={requestDetails?.projectType}
					/>
				</TabsContent>

				<TabsContent value="request" className="pt-6">
					<LeadRequestTab requestDetails={requestDetails} />
				</TabsContent>

				<TabsContent value="quote-list" className="pt-6">
					<LeadQuoteListTab
						leadId={lead.leadId}
						rows={quoteRows}
						sourceParam={searchParams.get("source") ?? undefined}
					/>
				</TabsContent>

				{leadDetailTabs
					.filter(
						(
							tab
						): tab is (typeof leadDetailTabs)[number] =>
							tab.value !== "overview" && tab.value !== "request"
					)
					.map((tab) => (
						<TabsContent key={tab.value} value={tab.value} className="pt-6">
							<div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 ">
								<Translate text={localizationConstants.comingSoon} />
							</div>
						</TabsContent>
					))}
			</Tabs>
		</div>
	);
}
