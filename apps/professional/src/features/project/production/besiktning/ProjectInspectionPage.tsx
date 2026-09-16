"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { notFound } from "next/navigation";

import { ConfirmActionDialog } from "@/components/dialog/ConfirmActionDialog";
import { ModulePageHeader } from "@/components/layout/navigation";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { ProjectRowsToolbar } from "../../components/ProjectRowsToolbar";
import { PROJECT_MODULE_BASE_URL, PROJECT_MODULE_TABS, PROJECT_MODULE_TITLE } from "../../data/projectNav.config";
import { todayIso } from "../../shared/todayIso";
import { ProjectRecordTitle } from "../components/ProjectRecordTitle";
import { projectProductionTabs } from "../projectProductionNav.config";
import { InspectionTableCard } from "./components/InspectionTableCard";
import { InspectionDialog } from "./form/InspectionDialog";
import { useProjectInspectionList } from "./hooks/useProjectInspectionList";
import type { ProjectInspection } from "./types";

/* Radix leaves `pointer-events: none` on <body> when a dialog opens in the tick
   a dropdown item closes; defer by a macrotask. A timeout, not
   requestAnimationFrame, which never fires in an occluded page. */
const defer = (fn: () => void) => setTimeout(fn, 0);

interface DialogState {
	inspection?: ProjectInspection;
	/** A new inspection's Datum, read when the dialog was asked for. */
	today: string;
}

export interface ProjectInspectionPageProps {
	projectId: string;
}

/**
 * Besiktning — the project's inspections.
 *
 * Built to the frames: Sök, Filter and Lägg till over a "Besiktning" card, a row
 * menu of Öppna, Arkivera and Radera, and the add / edit dialog. Archived rows
 * leave the list and are reached from Filter → Arkiverade, where they can be
 * restored. The ticket's description — summary cards, remarks, severity,
 * inspectors, checklists, a media gallery — is not drawn and not built.
 */
export function ProjectInspectionPage({ projectId }: ProjectInspectionPageProps) {
	const list = useProjectInspectionList(projectId);
	const [dialog, setDialog] = useState<DialogState | null>(null);
	const [deleting, setDeleting] = useState<ProjectInspection | null>(null);

	/* An id that matches no project is a 404. After the hooks: `notFound()` throws. */
	if (!list.project) notFound();

	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<ModulePageHeader
				title={PROJECT_MODULE_TITLE}
				tabs={PROJECT_MODULE_TABS}
				record={{
					title: (
						<ProjectRecordTitle
							projectNo={list.project.projectNr}
							sectionKey={localizationConstants.projectInspectionTitle}
						/>
					),
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
					showPrint={false}
					action={
						<Button
							type="button"
							onClick={() => setDialog({ today: todayIso() })}
							className="h-10 cursor-pointer gap-2 rounded-md bg-[#111721] px-4 text-sm font-medium text-white hover:bg-slate-800"
						>
							<Plus className="h-4 w-4 shrink-0" aria-hidden />
							<Translate text={localizationConstants.inspectionAddButton} />
						</Button>
					}
				/>

				<InspectionTableCard
					list={list}
					onOpen={(inspection) => defer(() => setDialog({ inspection, today: todayIso() }))}
					onDelete={(inspection) => defer(() => setDeleting(inspection))}
				/>
			</div>

			{dialog && (
				<InspectionDialog
					inspection={dialog.inspection}
					today={dialog.today}
					onSave={list.save}
					onClose={() => setDialog(null)}
				/>
			)}

			<ConfirmActionDialog
				open={Boolean(deleting)}
				onOpenChange={(open) => !open && setDeleting(null)}
				title={localizationConstants.projectInspectionDeleteTitle}
				description={localizationConstants.projectInspectionDeleteBody}
				confirmLabel={localizationConstants.projectListDeleteAction}
				subject={deleting ? list.labelOf(deleting) : undefined}
				destructive
				onConfirm={() => {
					if (deleting) list.remove(deleting);
					setDeleting(null);
				}}
			/>
		</div>
	);
}

export default ProjectInspectionPage;
