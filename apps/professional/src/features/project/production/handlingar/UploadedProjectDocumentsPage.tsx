"use client";

import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import axios from "axios";

import { useAuthStatus } from "@/context/AuthContext";
import { ModulePageHeader } from "@/components/layout/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { PROJECT_MODULE_BASE_URL, PROJECT_MODULE_TABS, PROJECT_MODULE_TITLE } from "../../data/projectNav.config";
import { listProjectDocuments } from "../../services/projectDocumentService";
import { ProjectRecordTitle } from "../components/ProjectRecordTitle";
import { useProjectIdentity } from "../hooks/useProjectIdentity";
import { projectProductionTabs } from "../projectProductionNav.config";

const DOCUMENT_REFETCH_MS = 60_000;

export function UploadedProjectDocumentsPage({ projectId }: { projectId: string }) {
	const t = useTranslate();
	const { company } = useAuthStatus();
	const project = useProjectIdentity(projectId);
	const documents = useQuery({
		queryKey: ["professional-project-documents", company?.id, projectId],
		queryFn: () => listProjectDocuments(projectId),
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
			<div className="overflow-x-auto border border-slate-200 bg-white">
				<Table className="min-w-[560px] table-fixed">
					<TableHeader><TableRow>
						<TableHead className="w-32 px-4"><Translate text={localizationConstants.dateHeaderLabel} /></TableHead>
						<TableHead className="px-4"><Translate text={localizationConstants.orderDocumentNameHeader} /></TableHead>
						<TableHead className="px-4"><Translate text={localizationConstants.orderFileHeader} /></TableHead>
						<TableHead className="w-16"><span className="sr-only"><Translate text={localizationConstants.projectListOpen} /></span></TableHead>
					</TableRow></TableHeader>
					<TableBody>
						{documents.data?.length ? documents.data.map((doc) => <TableRow key={doc.id}>
							<TableCell className="px-4 py-4 align-top">{doc.date}</TableCell>
							<TableCell className="px-4 py-4 align-top whitespace-normal break-all">{doc.documentName}</TableCell>
							<TableCell className="px-4 py-4 align-top whitespace-normal break-all">{doc.fileName}</TableCell>
							<TableCell className="px-2 py-2 align-top">
								{doc.fileUrl ? <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer"
									aria-label={`${t(localizationConstants.projectListOpen)} ${doc.fileName}`}
									title={t(localizationConstants.projectListOpen)}
									className="inline-flex h-11 w-11 items-center justify-center rounded-md hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-slate-900">
									<ExternalLink className="h-4 w-4" aria-hidden />
								</a> : <span className="text-sm text-slate-500"><Translate text={localizationConstants.projectDocumentsNoFile} /></span>}
							</TableCell>
						</TableRow>) : <TableRow><TableCell colSpan={4} className="p-8 text-center">
							<Translate text={localizationConstants.noRecordsFound} />
						</TableCell></TableRow>}
					</TableBody>
				</Table>
			</div>
		</div>
	</div>;
}
