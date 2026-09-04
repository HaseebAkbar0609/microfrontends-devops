"use client";

import { Suspense, useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, FolderKanban, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { RotList } from "@/features/rotRut/components/RotList";
import { RutList } from "@/features/rotRut/components/RutList";
import { getProjectListAPIAction } from "@/api-actions";
import type { Quote } from "@/features/quote/types/types";

const rotRutTabTriggerClass =
	"relative flex-none rounded-none border-0 bg-transparent px-4 py-2.5 text-sm shadow-none " +
	"font-normal text-slate-500 transition-colors hover:text-slate-700 " +
	"focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 " +
	"border-b-[3px] border-transparent -mb-[3px] after:hidden " +
	"data-[state=active]:z-[1] data-[state=active]:bg-transparent data-[state=active]:font-semibold " +
	"data-[state=active]:text-slate-900 data-[state=active]:shadow-none " +
	"data-[state=active]:!border-b-[3px] data-[state=active]:!border-slate-900";

function RootRutOverviewContent() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const queryProjectId = searchParams?.get("projectId") ?? "";
	const activeTab = searchParams?.get("tab") || "rot";

	const [projects, setProjects] = useState<Quote[]>([]);
	const [loadingProjects, setLoadingProjects] = useState(true);
	const [fetchError, setFetchError] = useState(false);
	const [selectedProjectId, setSelectedProjectId] = useState<string>(queryProjectId);

	const handleTabChange = (val: string) => {
		const projParam = selectedProjectId ? `projectId=${encodeURIComponent(selectedProjectId)}&` : "";
		const url = `/rotRut?${projParam}tab=${encodeURIComponent(val)}`;
		router.push(url);
	};

	const isCancelledRef = useRef(false);
	const selectedProjectIdRef = useRef(selectedProjectId);
	const activeTabRef = useRef(activeTab);

	useEffect(() => {
		selectedProjectIdRef.current = selectedProjectId;
	}, [selectedProjectId]);

	useEffect(() => {
		activeTabRef.current = activeTab;
	}, [activeTab]);

	const loadProjects = useCallback(async () => {
		if (selectedProjectIdRef.current && queryProjectId === selectedProjectIdRef.current) {
			setLoadingProjects(false);
			return;
		}

		setLoadingProjects(true);
		setFetchError(false);

		try {
			const res = await getProjectListAPIAction({ pageSize: 50 });
			if (isCancelledRef.current) return;
			if (res.success && res.data) {
				const projectList = res.data.quotes;
				setProjects(projectList);

				if (queryProjectId) {
					setSelectedProjectId(queryProjectId);
				} else if (projectList.length > 0) {
					const firstId = projectList[0].id;
					setSelectedProjectId(firstId);
					router.replace(`/rotRut?projectId=${encodeURIComponent(firstId)}&tab=${encodeURIComponent(activeTabRef.current)}`);
				}
			} else {
				if (!isCancelledRef.current) setFetchError(true);
			}
		} catch {
			if (!isCancelledRef.current) setFetchError(true);
		} finally {
			if (!isCancelledRef.current) setLoadingProjects(false);
		}
	}, [queryProjectId, router]);

	useEffect(() => {
		isCancelledRef.current = false;
		void loadProjects();
		return () => {
			isCancelledRef.current = true;
		};
	}, [loadProjects]);

	if (loadingProjects && !selectedProjectId) {
		return (
			<div className="flex flex-1 items-center justify-center min-h-screen bg-white">
				<Loader2 className="h-8 w-8 animate-spin text-slate-500" />
			</div>
		);
	}

	if (fetchError && !selectedProjectId) {
		return (
			<div className="flex flex-1 flex-col items-center justify-center min-h-screen bg-white p-6 text-center">
				<AlertCircle className="h-12 w-12 text-red-500 mb-3" />
				<h3 className="text-lg font-semibold text-slate-900 mb-1">
					<Translate text={localizationConstants.errorTitle} />
				</h3>
				<p className="text-sm text-slate-500 max-w-md mb-4">
					<Translate text={localizationConstants.errorDetailsDesc} />
				</p>
				<Button onClick={loadProjects} variant="outline" size="sm">
					<Translate text={localizationConstants.errorRetry} />
				</Button>
			</div>
		);
	}

	if (!selectedProjectId && projects.length === 0) {
		return (
			<div className="flex flex-1 flex-col items-center justify-center min-h-screen bg-white p-6 text-center">
				<FolderKanban className="h-12 w-12 text-slate-400 mb-3" />
				<h3 className="text-lg font-semibold text-slate-900 mb-1">
					<Translate text={localizationConstants.projectNoProjectsFound} />
				</h3>
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col bg-white min-h-screen font-inter">
			<Tabs value={activeTab} onValueChange={handleTabChange} className="flex flex-1 flex-col">
				{/* Header Area */}
				<PageHeader
					title={localizationConstants.rotRutTitle}
					breadcrumbs={[
						{ label: localizationConstants.home, href: "/home" },
						{ label: localizationConstants.tools, href: "#" },
						{
							label: localizationConstants.rotRutTitle,
							href: selectedProjectId ? `/rotRut?projectId=${selectedProjectId}&tab=${activeTab}` : "/rotRut",
						},
					]}
					className="border-none pb-0"
				>
					<TabsList className="mt-2 flex h-auto w-full justify-start gap-x-4 rounded-none bg-transparent p-0 border-b border-slate-200 px-5">
						<TabsTrigger value="rot" className={rotRutTabTriggerClass}>
							<Translate text={localizationConstants.rotTab} />
						</TabsTrigger>
						<TabsTrigger value="rut" className={rotRutTabTriggerClass}>
							<Translate text={localizationConstants.rutTab} />
						</TabsTrigger>
					</TabsList>
				</PageHeader>

				{/* Main Content */}
				<div className="p-4 sm:p-8">
					<TabsContent value="rot" className="mt-0 flex flex-col">
						<RotList projectId={selectedProjectId} />
					</TabsContent>

					<TabsContent value="rut" className="mt-0 flex flex-col">
						<RutList projectId={selectedProjectId} />
					</TabsContent>
				</div>
			</Tabs>
		</div>
	);
}

export default function RootRutOverviewPage() {
	return (
		<Suspense
			fallback={
				<div className="flex flex-1 items-center justify-center min-h-screen bg-white">
					<Loader2 className="h-8 w-8 animate-spin text-slate-500" />
				</div>
			}
		>
			<RootRutOverviewContent />
		</Suspense>
	);
}



