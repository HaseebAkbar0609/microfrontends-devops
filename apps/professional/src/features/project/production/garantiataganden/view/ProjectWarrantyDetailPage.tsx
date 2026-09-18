"use client";

import { useState } from "react";
import { notFound } from "next/navigation";

import { ConfirmActionDialog } from "@/components/dialog/ConfirmActionDialog";
import { ModulePageHeader } from "@/components/layout/navigation";
import localizationConstants from "@/utils/translation/constants";
import { PROJECT_MODULE_TABS, PROJECT_MODULE_TITLE } from "../../../data/projectNav.config";
import { ProjectRecordTitle } from "../../components/ProjectRecordTitle";
import { projectProductionTabs } from "../../projectProductionNav.config";
import type { WarrantyDocument } from "../types";
import { warrantyUrls } from "../warrantyNav";
import { WarrantyDocumentsCard } from "./components/WarrantyDocumentsCard";
import { WarrantyInfoCard } from "./components/WarrantyInfoCard";
import { WarrantyRulesCard } from "./components/WarrantyRulesCard";
import { WarrantySummaryCard } from "./components/WarrantySummaryCard";
import { WarrantyDocumentDialog } from "./form/WarrantyDocumentDialog";
import { useWarrantyDetail } from "./hooks/useWarrantyDetail";

/* Radix leaves `pointer-events: none` on <body> when a dialog opens in the tick
   a dropdown item closes; defer by a macrotask. A timeout, not
   requestAnimationFrame, which never fires in an occluded page. */
const defer = (fn: () => void) => setTimeout(fn, 0);

interface DialogState {
	document?: WarrantyDocument;
}

export interface ProjectWarrantyDetailPageProps {
	projectId: string;
	commitmentId: string;
}

/**
 * One warranty commitment, as the frame draws it: what it is called and when,
 * the project's own details beside the warranty's, the reminder rules, and the
 * documents hung on it.
 *
 * Everything above Dokument reads only — Datum and Benämning are changed from
 * the list's ⋮ Redigera, and the rest has no source to edit against. The
 * frame's breadcrumb is not built: a record page carries the back arrow and
 * "Projekt nr N / …" instead, which `ModulePageHeader` enforces.
 */
export function ProjectWarrantyDetailPage({ projectId, commitmentId }: ProjectWarrantyDetailPageProps) {
	const detail = useWarrantyDetail(projectId, commitmentId);
	const [dialog, setDialog] = useState<DialogState | null>(null);
	const [deleting, setDeleting] = useState<WarrantyDocument | null>(null);

	/* An unknown project, or a commitment that is not this project's, is a 404. After the hooks. */
	if (!detail.project || !detail.commitment) notFound();

	const { project, commitment } = detail;

	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<ModulePageHeader
				title={PROJECT_MODULE_TITLE}
				tabs={PROJECT_MODULE_TABS}
				record={{
					title: <ProjectRecordTitle projectNo={project.projectNr} sectionKey={localizationConstants.projectWarrantyDetailTitle} />,
					backHref: warrantyUrls.list(projectId),
				}}
				secondaryTabs={projectProductionTabs(projectId)}
			/>

			<div className="flex flex-1 flex-col gap-4 p-4 sm:gap-5 sm:p-6">
				<WarrantySummaryCard commitment={commitment} />
				<WarrantyInfoCard commitment={commitment} project={project} />
				<WarrantyRulesCard commitment={commitment} />
				<WarrantyDocumentsCard
					documents={commitment.documents}
					onAdd={() => setDialog({})}
					onOpen={detail.openDocument}
					onEdit={(document) => defer(() => setDialog({ document }))}
					onDelete={(document) => defer(() => setDeleting(document))}
				/>
			</div>

			{dialog && (
				<WarrantyDocumentDialog
					document={dialog.document}
					onAdd={detail.addDocument}
					onRename={detail.renameDocument}
					onClose={() => setDialog(null)}
				/>
			)}

			<ConfirmActionDialog
				open={Boolean(deleting)}
				onOpenChange={(open) => !open && setDeleting(null)}
				title={localizationConstants.projectWarrantyDocumentDeleteTitle}
				description={localizationConstants.projectWarrantyDocumentDeleteBody}
				confirmLabel={localizationConstants.projectWarrantyRowDelete}
				subject={deleting?.name}
				destructive
				onConfirm={() => {
					if (deleting) detail.removeDocument(deleting.id);
					setDeleting(null);
				}}
			/>
		</div>
	);
}

export default ProjectWarrantyDetailPage;
