"use client";

import { Suspense } from "react";
import { notFound } from "next/navigation";

import { ModulePageHeader } from "@/components/layout/navigation";
import localizationConstants from "@/utils/translation/constants";
import { PROJECT_MODULE_BASE_URL, PROJECT_MODULE_TABS, PROJECT_MODULE_TITLE } from "../../data/projectNav.config";
import { ProjectRecordTitle } from "../components/ProjectRecordTitle";
import { projectProductionTabs } from "../projectProductionNav.config";
import { DiaryWorkspace } from "./components/DiaryWorkspace";
import { useDiaryProject } from "./hooks/useDiaryProject";

export interface ProjectDiaryPageProps {
	projectId: string;
}

/**
 * Dagbok — the project's construction diary, one day at a time.
 *
 * Built to the frame: weather with its calendar, the four tables, the notes and
 * Bekräfta, plus drafts that are saved, signed and published. The ticket's
 * description — a list view, fetched weather, a media gallery, PDF export — is
 * not drawn and not built.
 */
export function ProjectDiaryPage({ projectId }: ProjectDiaryPageProps) {
	const facts = useDiaryProject(projectId);

	/* An id that matches no project is a 404. After the hooks: `notFound()` throws. */
	if (!facts) notFound();

	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<ModulePageHeader
				title={PROJECT_MODULE_TITLE}
				tabs={PROJECT_MODULE_TABS}
				record={{
					title: <ProjectRecordTitle projectNo={facts.projectNr} sectionKey={localizationConstants.projectDiaryTitle} />,
					backHref: `${PROJECT_MODULE_BASE_URL}/overview`,
				}}
				secondaryTabs={projectProductionTabs(projectId)}
			/>
			{/* The workspace reads the chosen day from the query string, so it needs Suspense. */}
			<Suspense fallback={null}>
				<DiaryWorkspace projectId={projectId} facts={facts} />
			</Suspense>
		</div>
	);
}

export default ProjectDiaryPage;
