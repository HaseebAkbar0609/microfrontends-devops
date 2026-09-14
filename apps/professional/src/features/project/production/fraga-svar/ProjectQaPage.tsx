"use client";

import { Suspense } from "react";
import { notFound } from "next/navigation";

import { ModulePageHeader, SectionTabs } from "@/components/layout/navigation";
import { TabsContent } from "@/components/ui/tabs";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import {
	PROJECT_MODULE_BASE_URL,
	PROJECT_MODULE_TABS,
	PROJECT_MODULE_TITLE,
} from "../../data/projectNav.config";
import { ProjectRecordTitle } from "../components/ProjectRecordTitle";
import { projectProductionTabs } from "../projectProductionNav.config";
import { ProjectQaBoard } from "./components/ProjectQaBoard";
import { useProjectQaBoard } from "./hooks/useProjectQaBoard";

export interface ProjectQaPageProps {
	projectId: string;
}

/**
 * Fråga/Svar — the questions raised on a project, and their answers.
 *
 * Built to the frames, which are the purchase board's template on the project
 * record: Alla / Arkiv, search and filters, and New / Opened / Answered. The
 * ticket's description (threads, mentions, attachments, priority, resolve) is
 * not drawn and not built.
 */
export function ProjectQaPage({ projectId }: ProjectQaPageProps) {
	const t = useTranslate();
	/* One instance for both tabs: archiving on Alla has to show under Arkiv. */
	const board = useProjectQaBoard(projectId);

	/* An id that matches no project is a 404. After the hooks: `notFound()`
	   throws. */
	if (!board.project) notFound();

	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<ModulePageHeader
				title={PROJECT_MODULE_TITLE}
				tabs={PROJECT_MODULE_TABS}
				record={{
					title: (
						<ProjectRecordTitle
							projectNo={board.project.projectNr}
							sectionKey={localizationConstants.projectQaTitle}
						/>
					),
					backHref: `${PROJECT_MODULE_BASE_URL}/overview`,
				}}
				secondaryTabs={projectProductionTabs(projectId)}
			/>

			<div className="flex-1 px-6 pt-4 pb-8">
				{/* `SectionTabs` reads the active tab from the query string, so
				    it needs a Suspense boundary to prerender. */}
				<Suspense fallback={null}>
					<SectionTabs
						items={[
							{ id: "all", labelKey: localizationConstants.projectQaTabAll },
							{ id: "archive", labelKey: localizationConstants.archive },
						]}
						ariaLabel={t(localizationConstants.projectQaTitle)}
					>
						<TabsContent value="all" className="mt-4">
							<ProjectQaBoard board={board} />
						</TabsContent>
						<TabsContent value="archive" className="mt-4">
							<ProjectQaBoard board={board} archivedOnly />
						</TabsContent>
					</SectionTabs>
				</Suspense>
			</div>
		</div>
	);
}

export default ProjectQaPage;
