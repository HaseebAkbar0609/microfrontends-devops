"use client";

import { Suspense } from "react";
import { notFound } from "next/navigation";

import { ModulePageHeader, SectionTabs } from "@/components/layout/navigation";
import { TabsContent } from "@/components/ui/tabs";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { PROJECT_MODULE_BASE_URL, PROJECT_MODULE_TABS, PROJECT_MODULE_TITLE } from "../../data/projectNav.config";
import { ProjectRecordTitle } from "../components/ProjectRecordTitle";
import { projectProductionTabs } from "../projectProductionNav.config";
import { DocumentsPanel } from "./components/DocumentsPanel";
import { useProjectDocuments } from "./hooks/useProjectDocuments";
import { DOCUMENT_VIEW_LABELS, DOCUMENT_VIEWS } from "./projectDocuments.config";

/** Module constant: the tab row. Handlingar comes first, so it is the default. */
const TAB_ITEMS = DOCUMENT_VIEWS.map((id) => ({ id, labelKey: DOCUMENT_VIEW_LABELS[id] }));

export interface ProjectDocumentsPageProps {
	projectId: string;
}

/**
 * Handlingar — the project's documents, drawings and contracts.
 *
 * Built to the frames: Handlingar, Ritningar, Kontrakt and Arkiv tabs, each
 * with Sök, Filter, print and "Ladda upp", a table with the `+` column picker,
 * and a row menu of Visa, Radera and Arkivera. The ticket's description — a
 * size column, drag-and-drop, progress bars, renaming, a date range and
 * folders — is not drawn and not built.
 */
export function ProjectDocumentsPage({ projectId }: ProjectDocumentsPageProps) {
	const t = useTranslate();
	/* One instance for every tab: archiving on Handlingar has to show under Arkiv. */
	const documents = useProjectDocuments(projectId);

	/* An id that matches no project is a 404. After the hooks: `notFound()` throws. */
	if (!documents.project) notFound();

	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<ModulePageHeader
				title={PROJECT_MODULE_TITLE}
				tabs={PROJECT_MODULE_TABS}
				record={{
					title: (
						<ProjectRecordTitle
							projectNo={documents.project.projectNr}
							sectionKey={localizationConstants.projectDocumentsTitle}
						/>
					),
					backHref: `${PROJECT_MODULE_BASE_URL}/overview`,
				}}
				secondaryTabs={projectProductionTabs(projectId)}
			/>

			<div className="flex-1 px-4 pt-4 pb-8 sm:px-6">
				{/* `SectionTabs` reads the query string, so it needs Suspense. */}
				<Suspense fallback={null}>
					<SectionTabs items={TAB_ITEMS} ariaLabel={t(localizationConstants.projectDocumentsTitle)}>
						{DOCUMENT_VIEWS.map((view) => (
							<TabsContent key={view} value={view} className="mt-4">
								<DocumentsPanel view={view} documents={documents} />
							</TabsContent>
						))}
					</SectionTabs>
				</Suspense>
			</div>
		</div>
	);
}

export default ProjectDocumentsPage;
