"use client";

import { useState } from "react";
import { notFound } from "next/navigation";

import { ConfirmActionDialog } from "@/components/dialog/ConfirmActionDialog";
import { ModulePageHeader } from "@/components/layout/navigation";
import { TablePagination } from "@/components/table/TablePagination";
import localizationConstants from "@/utils/translation/constants";
import { ProjectRowsToolbar } from "../../components/ProjectRowsToolbar";
import { PROJECT_MODULE_BASE_URL, PROJECT_MODULE_TABS, PROJECT_MODULE_TITLE } from "../../data/projectNav.config";
import { ProjectRecordTitle } from "../components/ProjectRecordTitle";
import { projectProductionTabs } from "../projectProductionNav.config";
import { CreateProtocolMenu } from "./components/CreateProtocolMenu";
import { ProtocolTableCard } from "./components/ProtocolTableCard";
import { NewMeetingDialog } from "./form/NewMeetingDialog";
import { UploadProtocolDialog } from "./form/UploadProtocolDialog";
import { useProjectProtocols } from "./hooks/useProjectProtocols";
import { useProtocolList } from "./hooks/useProtocolList";
import type { ProjectProtocol, ProtocolKind } from "./types";

/* Radix leaves `pointer-events: none` on <body> when a dialog opens in the tick
   a dropdown item closes; defer by a macrotask. A timeout, not
   requestAnimationFrame, which never fires in an occluded page. Only the items
   that open a dialog wait — Öppna and Skriv ut may open a tab, which must
   happen in the click. */
const defer = (fn: () => void) => setTimeout(fn, 0);

export interface ProjectProtocolsPageProps {
	projectId: string;
}

/**
 * Protokoll — the project's meeting and inspection protocols.
 *
 * Built to the frame: Sök, Filter and "Skapa protokoll" (Standard, Action,
 * Ladda upp) over a card of Datum, Typ and PDF, each row with "Visa detaljer"
 * and ⋮ Öppna, Arkivera, Skriv ut and Radera, and paging underneath. Archived
 * protocols leave the list and are found under Filter → Arkiverade. Standard
 * and Action open Nytt möte, Ladda upp Nytt protokoll; a protocol's Visa
 * detaljer opens its page. The orders module's own protocol feature is left
 * untouched.
 */
export function ProjectProtocolsPage({ projectId }: ProjectProtocolsPageProps) {
	const protocols = useProjectProtocols(projectId);
	const list = useProtocolList(protocols.protocols, protocols.typeLabel);
	const [creating, setCreating] = useState<ProtocolKind | null>(null);
	const [deleting, setDeleting] = useState<ProjectProtocol | null>(null);

	/* An id that matches no project is a 404. After the hooks: `notFound()` throws. */
	if (!protocols.project) notFound();

	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<ModulePageHeader
				title={PROJECT_MODULE_TITLE}
				tabs={PROJECT_MODULE_TABS}
				record={{
					title: <ProjectRecordTitle projectNo={protocols.project.projectNr} sectionKey={localizationConstants.projectProtocolTitle} />,
					backHref: `${PROJECT_MODULE_BASE_URL}/overview`,
				}}
				secondaryTabs={projectProductionTabs(projectId)}
			/>

			<div className="flex flex-1 flex-col gap-4 p-4 sm:gap-5 sm:p-6">
				<ProjectRowsToolbar
					search={list.search}
					onSearchChange={list.setSearch}
					filter={list.filter}
					onFilterChange={list.setFilter}
					filterOptions={list.filterOptions}
					/* The frame draws no page print — each row prints its own file. */
					showPrint={false}
					action={<CreateProtocolMenu onCreate={(kind) => defer(() => setCreating(kind))} />}
				/>

				<ProtocolTableCard
					list={list}
					typeLabel={protocols.typeLabel}
					onOpen={protocols.open}
					onToggleArchive={protocols.toggleArchive}
					onPrint={protocols.print}
					onDelete={(protocol) => defer(() => setDeleting(protocol))}
				/>

				<TablePagination
					currentPage={list.currentPage}
					totalPages={list.totalPages}
					pageSize={list.pageSize}
					onPageChange={list.setPage}
					onPageSizeChange={list.setPageSize}
					className="justify-center sm:justify-center"
				/>
			</div>

			{(creating === "standard" || creating === "action") && protocols.facts && (
				<NewMeetingDialog
					key={creating}
					kind={creating}
					projectId={projectId}
					projectNo={protocols.facts.projectNo}
					projectName={protocols.facts.projectName}
					onCreate={(input) => protocols.createMeeting(creating, input)}
					onClose={() => setCreating(null)}
				/>
			)}

			{creating === "upload" && protocols.facts && (
				<UploadProtocolDialog
					projectId={projectId}
					projectNo={protocols.facts.projectNo}
					projectName={protocols.facts.projectName}
					onSave={(details, file) => {
						const created = protocols.createUpload(details, file);
						if (created) list.reveal(created.row, created.protocols);
						return Boolean(created);
					}}
					onClose={() => setCreating(null)}
				/>
			)}


			<ConfirmActionDialog
				open={Boolean(deleting)}
				onOpenChange={(open) => !open && setDeleting(null)}
				title={localizationConstants.projectProtocolDeleteTitle}
				description={localizationConstants.projectProtocolDeleteBody}
				confirmLabel={localizationConstants.projectListDeleteAction}
				subject={deleting?.name}
				destructive
				onConfirm={() => {
					if (deleting) protocols.remove(deleting);
					setDeleting(null);
				}}
			/>
		</div>
	);
}

export default ProjectProtocolsPage;
