"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LeadRow } from "@/features/leads/types";
import { leadDetailTabs } from "@/features/leads/management/constants";
import { useLeadRequestDetails } from "@/features/leads/queries/useLeadRequestDetails";
import { useLeadQuoteList } from "@/features/leads/queries/useLeadQuoteList";
import LeadDetailHeaderActions from "@/features/leads/management/components/LeadDetailHeaderActions";
import LeadOverviewTab from "@/features/leads/management/components/LeadOverviewTab";
import LeadQuoteListTab from "@/features/leads/management/components/LeadQuoteListTab";
import LeadRequestTab from "@/features/leads/management/components/LeadRequestTab";
import { getLeadActivityAPIAction } from "@/api-actions/leads/activity";

type LeadDetailViewProps = {
	lead: LeadRow;
};

export default function LeadDetailView({ lead }: LeadDetailViewProps) {
	// const t = useTranslate();
	const searchParams = useSearchParams();
	const [activeTab, setActiveTab] = useState(() => searchParams.get("tab") ?? "overview");
	const [monitorStatus, setMonitorStatus] = useState("monitor");

	const title = lead.category && lead.category !== "-"
		? `${lead.customer} - ${lead.category}`
		: lead.customer;
	const requestDetailsQuery = useLeadRequestDetails(lead.id);
	const quoteListQuery = useLeadQuoteList(lead.id);
	const requestDetails = requestDetailsQuery.data ?? null;
	const quoteRows = quoteListQuery.data ?? [];
	const activityQuery = useQuery({
		queryKey: ["lead-activity", lead.id],
		queryFn: () => getLeadActivityAPIAction(lead.id),
		enabled: activeTab === "activity" && Boolean(lead.id),
	});
	const isMonitoringView = searchParams.get("source") === "monitoring";
	const showArchiveAction =
		isMonitoringView && (activeTab === "request" || activeTab === "quote-list");
	const detailTabs = useMemo(() => {
		if (!isMonitoringView) return leadDetailTabs;
		return [
			leadDetailTabs[0],
			leadDetailTabs[1],
			leadDetailTabs[2],
			{ value: "activity", labelKey: localizationConstants.activityLogsTab },
		];
	}, [isMonitoringView]);

	return (
		<div className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
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
					className="w-full min-h-12 justify-start gap-1 overflow-x-auto overflow-y-hidden border-b border-slate-200 p-0 sm:gap-3"
				>
					{detailTabs.map((tab) => (
						<TabsTrigger
							key={tab.value}
							value={tab.value}
							className="w-fit flex-none px-3 py-3 text-sm sm:px-6"
						>
							{tab.value === "activity" ? (
								<>
									<span className="sm:hidden"><Translate text={localizationConstants.activityTab} /></span>
									<span className="hidden sm:inline"><Translate text={tab.labelKey} /></span>
								</>
							) : <Translate text={tab.labelKey} />}
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
					{requestDetailsQuery.isPending ? (
						<p className="text-sm text-slate-500"><Translate text={localizationConstants.leadInquiryLoading} /></p>
					) : requestDetailsQuery.isError ? (
						<p className="text-sm text-red-600"><Translate text={localizationConstants.serverError} /></p>
					) : requestDetails ? (
						<LeadRequestTab requestDetails={requestDetails} />
					) : (
						<p className="text-sm text-slate-500"><Translate text={localizationConstants.leadInquiryEmpty} /></p>
					)}
				</TabsContent>

				<TabsContent value="quote-list" className="pt-6">
					<LeadQuoteListTab
						leadId={lead.leadId}
						rows={quoteRows}
						sourceParam={searchParams.get("source") ?? undefined}
					/>
				</TabsContent>

				<TabsContent value="activity" className="pt-6">
					{activityQuery.isPending ? (
						<p className="text-sm text-slate-500"><Translate text={localizationConstants.leadActivityLoading} /></p>
					) : activityQuery.isError ? (
						<p className="text-sm text-red-600"><Translate text={localizationConstants.serverError} /></p>
					) : activityQuery.data.length === 0 ? (
						<p className="text-sm text-slate-500"><Translate text={localizationConstants.leadActivityEmpty} /></p>
					) : (
						<ol className="divide-y divide-slate-200 border-y border-slate-200">
							{activityQuery.data.map((item, index) => (
								<li key={`${item.event}-${item.quote_id ?? "lead"}-${index}`} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-4 text-sm">
									<div className="min-w-0 text-slate-900">
										<Translate text={item.event === "lead_created" ? localizationConstants.leadActivityCreated : item.event === "offer_sent" ? localizationConstants.leadActivityOfferSent : localizationConstants.leadActivityOfferAccepted} />
										{item.company_name && <span className="text-slate-500">{" - "}{item.company_name}</span>}
									</div>
									<time dateTime={item.at} className="shrink-0 text-slate-500">{new Date(item.at).toLocaleString()}</time>
								</li>
							))}
						</ol>
					)}
				</TabsContent>
				<TabsContent value="notes" className="pt-6">
					<div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
						<Translate text={localizationConstants.comingSoon} />
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
