"use client";

import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import axios from "axios";

import { useAuthStatus } from "@/context/AuthContext";
import { ModulePageHeader } from "@/components/layout/navigation";
import { Button } from "@/components/ui/button";
import { ProjectDocumentsList } from "@/features/document-workflows/ProjectDocumentsList";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { PROJECT_MODULE_BASE_URL, PROJECT_MODULE_TABS, PROJECT_MODULE_TITLE } from "../../data/projectNav.config";
import { listProjectDocuments } from "../../services/projectDocumentService";
import { ProjectRecordTitle } from "../components/ProjectRecordTitle";
import { useProjectIdentity } from "../hooks/useProjectIdentity";
import { projectProductionTabs } from "../projectProductionNav.config";

const DOCUMENT_REFETCH_MS = 60_000;

export function UploadedProjectDocumentsPage({ projectId }: { projectId: string }) {
	const { company } = useAuthStatus();
	const project = useProjectIdentity(projectId);
	const documents = useQuery({
		queryKey: ["professional-project-documents", company?.id, projectId],
		queryFn: () => listProjectDocuments(projectId, true),
		enabled: Boolean(project.data && company),
		retry: false,
		refetchInterval: DOCUMENT_REFETCH_MS,
	});
	if (axios.isAxiosError(project.error) && project.error.response?.status === 404) notFound();
	if (project.isLoading || documents.isLoading) {
		return <p role="status" className="p-6"><Translate text={localizationConstants.genericLoading} /></p>;
	}
	if (project.isError || documents.isError || !project.data) {
		return <div role="alert" className="flex flex-wrap items-center gap-3 p-6">
			<Translate text={localizationConstants.genericError} />
			<Button variant="outline" onClick={() => { void project.refetch(); void documents.refetch(); }}>
				<Translate text={localizationConstants.retry} />
			</Button>
		</div>;
	}
	return <div className="flex min-w-0 flex-1 flex-col bg-blue-gray-50">
		<ModulePageHeader title={PROJECT_MODULE_TITLE} tabs={PROJECT_MODULE_TABS}
			record={{ title: <ProjectRecordTitle projectNo={project.data.projectNr} sectionKey={localizationConstants.projectDocumentsTitle} />,
				backHref: `${PROJECT_MODULE_BASE_URL}/overview` }}
			secondaryTabs={projectProductionTabs(projectId)} />
		<div className="min-w-0 flex-1 p-4 sm:p-6">
			<ProjectDocumentsList documents={documents.data || []} projectId={projectId}
        refresh={() => void documents.refetch()} refreshing={documents.isFetching} />
		</div>
	</div>;
}
