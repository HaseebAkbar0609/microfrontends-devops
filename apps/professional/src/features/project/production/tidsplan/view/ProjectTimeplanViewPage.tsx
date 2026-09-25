"use client";

import { ConfirmActionDialog } from "@/components/dialog/ConfirmActionDialog";
import { ModulePageHeader } from "@/components/layout/navigation";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import {
	PROJECT_MODULE_TABS,
	PROJECT_MODULE_TITLE,
} from "../../../data/projectNav.config";
import { useProjectIdentity } from "../../hooks/useProjectIdentity";
import { projectProductionTabs } from "../../projectProductionNav.config";
import { TimeplanFormFooter } from "../form/TimeplanFormFooter";
import { timeplanUrls } from "../timeplanNav";
import { AddTaskDialog } from "./AddTaskDialog";
import { TimeplanGantt } from "./TimeplanGantt";
import { useTimeplanEditor } from "./useTimeplanEditor";

export interface ProjectTimeplanViewPageProps {
	projectId: string;
	planId: string;
}

/**
 * Visa tidsplan — one plan's schedule, which can be extended and saved.
 *
 * The plan is resolved on the client: one created in this browser exists only
 * in this browser's store, so a server lookup would 404 it. The frame titles
 * this "View tidsplan" — English inside Swedish copy, which AGENTS.md rule 2
 * forbids — so Swedish reads "Visa tidsplan" and English "View timeplan".
 */
export function ProjectTimeplanViewPage({ projectId, planId }: ProjectTimeplanViewPageProps) {
	const t = useTranslate();
	const projectQuery = useProjectIdentity(projectId);
	const project = projectQuery.data;
	const editor = useTimeplanEditor(projectId, planId);

	if (projectQuery.isLoading || editor.isLoading) {
		return <p role="status" className="p-6">{t(localizationConstants.genericLoading)}</p>;
	}
	if (!project || !editor.plan || editor.isError || projectQuery.isError) {
		return <p role="alert" className="p-6">{t(localizationConstants.genericError)}</p>;
	}

	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<ModulePageHeader
				title={PROJECT_MODULE_TITLE}
				tabs={PROJECT_MODULE_TABS}
				record={{
					title: t(localizationConstants.projectTimeplanViewTitle),
					backHref: timeplanUrls.list(projectId),
				}}
				secondaryTabs={projectProductionTabs(projectId)}
			/>

			<div
				ref={editor.ganttRef}
				tabIndex={-1}
				className="flex flex-1 flex-col gap-4 p-6 focus:outline-none"
			>
				{editor.plan.description && (
					<h3 className="line-clamp-2 text-lg font-semibold text-slate-700">
						{editor.plan.description}
					</h3>
				)}
				<TimeplanGantt
					timeline={editor.timeline}
					rows={editor.rows}
					collapsed={editor.collapsed}
					onToggle={editor.toggle}
					onAdd={editor.requestAdd}
				/>
			</div>

			{editor.dirty && (
				<TimeplanFormFooter onCancel={editor.requestDiscard} onSave={editor.save} />
			)}

			{editor.addTarget && (
				<AddTaskDialog
					key={editor.addTarget.parentId ?? "root"}
					open
					defaultStart={editor.addTarget.defaultStart}
					defaultEnd={editor.addTarget.defaultEnd}
					onClose={editor.cancelAdd}
					onAdd={editor.addTask}
				/>
			)}

			<ConfirmActionDialog
				open={editor.confirmingDiscard}
				onOpenChange={(open) => !open && editor.cancelDiscard()}
				title={localizationConstants.projectTimeplanDiscardTitle}
				description={localizationConstants.projectTimeplanDiscardDescription}
				confirmLabel={localizationConstants.projectTimeplanDiscardConfirm}
				destructive
				onConfirm={editor.confirmDiscard}
			/>
		</div>
	);
}

export default ProjectTimeplanViewPage;
