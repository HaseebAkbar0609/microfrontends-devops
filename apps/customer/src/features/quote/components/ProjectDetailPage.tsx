"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryParams } from "@/hooks/useQueryParams";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
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
import { getProjectByIdAPIAction } from "@/api-actions/project/get";
import { mapProjectDetailToFormHydration } from "../utils/projectDetailToForm";
import type { CreateOfferFormValues } from "../types/form";

export default function ProjectDetailPage() {
	const params = useParams();
	const searchParams = useSearchParams();
	const { changeQueries, replaceQueries } = useQueryParams();
	const id = params.id as string;

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [projectData, setProjectData] = useState<
		Partial<CreateOfferFormValues> & { refNo?: string }
	>({});

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

	const fetchProject = useCallback(async () => {
		if (!id) return;
		setLoading(true);
		setError(null);
		const res = await getProjectByIdAPIAction(id);
		if (res.success && res.data) {
			const hydration = mapProjectDetailToFormHydration(res.data);
			const rawRefNo =
				(res.data.client_no as string) ||
				(res.data.ref_no as string) ||
				(res.data.refNo as string) ||
				"";
			setProjectData({
				...hydration.values,
				refNo: rawRefNo,
			});
		} else {
			setError(res.error || "Failed to load quote project detail");
		}
		setLoading(false);
	}, [id]);

	useEffect(() => {
		void fetchProject();
	}, [fetchProject]);

	const handleTabChange = (value: string) => {
		changeQueries({ tab: value });
	};

	const projectName = projectData.projectName || "Project";

	const breadcrumbs: BreadcrumbItem[] = [
		{ label: localizationConstants.home, href: "/home" },
		{ label: localizationConstants.business, href: "/business" },
		{ label: localizationConstants.quote, href: "/business/offer" },
		{ label: projectName },
	];

	if (loading) {
		return (
			<div className="flex flex-1 items-center justify-center p-12 min-h-screen">
				<Loader2 className="w-8 h-8 animate-spin text-slate-600" role="status" aria-label="Loading project detail" />
			</div>
		);
	}

	if (error || !projectData.projectName) {
		return (
			<div className="flex flex-1 flex-col items-center justify-center p-12 min-h-screen text-center bg-slate-50">
				<AlertCircle className="w-12 h-12 text-red-500 mb-4" />
				<h2 className="text-xl font-semibold text-slate-900 mb-2">Failed to Load Project</h2>
				<p className="text-sm text-slate-500 max-w-md mb-6">{error || "The requested quote project details could not be found."}</p>
				<Button onClick={() => void fetchProject()} className="gap-2 bg-slate-900 text-white hover:bg-slate-800">
					<RefreshCw className="w-4 h-4" />
					Retry
				</Button>
			</div>
		);
	}

	return (
		<div className="flex flex-col flex-1 bg-slate-50/50 min-h-screen">
			{/* Header Section */}
			<div className="bg-white  border-slate-200">
				<PageHeader
					title={projectName}
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
								<ProjectOverviewTab project={projectData} />
							</TabsContent>

							<TabsContent value="quote-list" className="mt-0">
								<QuoteListTab suppliers={projectData.invitedSuppliers} />
							</TabsContent>

							<TabsContent value="documents" className="mt-0">
								<ProjectDocumentsTab projectId={id} initialDocuments={projectData.documents} />
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
