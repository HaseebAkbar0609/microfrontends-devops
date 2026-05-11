"use client";

import { useEffect, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryParams } from "@/hooks/useQueryParams";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	DUMMY_DATA,
	PROJECT_DETAIL_DEFAULT_TAB,
	PROJECT_DETAIL_TABS,
	PROJECT_DETAIL_TAB_VALUES,
	projectDetailTabTriggerClass,
} from "../constants";
import { PageHeader } from "@/components/common";
import { cn, isAllowedQueryValue } from "@/lib/utils";
import { BreadcrumbItem } from "@/types/user";
import { QuoteListTab } from "./QuoteListTab";
import { ProjectDocumentsTab } from "./ProjectDocumentsTab";
import { ProjectChatTab } from "./ProjectChatTab";
import { ProjectOverviewTab } from "./detail/ProjectOverviewTab";

export default function ProjectDetailPage() {
	const params = useParams();
	const searchParams = useSearchParams();
	const { changeQueries, replaceQueries } = useQueryParams();
	const id = params.id as string;

	const activeTab = useMemo(() => {
		const raw = searchParams.get("tab");
		if (isAllowedQueryValue(raw, PROJECT_DETAIL_TAB_VALUES)) return raw;
		return PROJECT_DETAIL_DEFAULT_TAB;
	}, [searchParams]);

	useEffect(() => {
		const raw = searchParams.get("tab");
		if (!isAllowedQueryValue(raw, PROJECT_DETAIL_TAB_VALUES)) {
			replaceQueries({ tab: PROJECT_DETAIL_DEFAULT_TAB });
		}
	}, [searchParams, replaceQueries]);

	const handleTabChange = (value: string) => {
		changeQueries({ tab: value });
	};

	const project = useMemo(() => {
		return DUMMY_DATA.find((q) => q.id === id) || DUMMY_DATA[0];
	}, [id]);

	const breadcrumbs: BreadcrumbItem[] = [
		{ label: localizationConstants.home, href: "/home" },
		{ label: localizationConstants.business, href: "/business" },
		{ label: localizationConstants.quote, href: "/business/quote" },
		{ label: project.projectName },
	];

	return (
		<div className="flex flex-col flex-1 bg-slate-50/50 min-h-screen">
			{/* Header Section */}
			<div className="bg-white  border-slate-200">
				<PageHeader
					title={project.projectName}
					breadcrumbs={breadcrumbs}
					className="border-none px-8 py-6"
				/>

				<div className="px-5 py-3">
					<Tabs
						value={activeTab}
						onValueChange={handleTabChange}
						className="w-full"
					>
						{/* Underline tabs: full-width hairline + thick active indicator (matches design) */}
						<TabsList className="flex h-auto w-full flex-wrap justify-start gap-x-8 gap-y-1 rounded-none border-0 border-b border-slate-200 bg-transparent p-0 md:gap-x-10">
							{PROJECT_DETAIL_TABS.map((tab) => (
								<TabsTrigger
									key={tab.value}
									value={tab.value}
									className={cn(projectDetailTabTriggerClass)}
								>
									<Translate text={tab.label} />
								</TabsTrigger>
							))}
						</TabsList>

						<div className="mt-6">
							<TabsContent value="overview">
								<ProjectOverviewTab project={project} />
							</TabsContent>

							<TabsContent value="quote-list" className="mt-0">
								<QuoteListTab />
							</TabsContent>

							<TabsContent value="documents" className="mt-0">
								<ProjectDocumentsTab />
							</TabsContent>

							<TabsContent value="chat" className="mt-0">
								<ProjectChatTab />
							</TabsContent>
						</div>
					</Tabs>
				</div>
			</div>
		</div>
	);
}
