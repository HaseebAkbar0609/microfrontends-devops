"use client";

import { useState } from "react";
import { notFound } from "next/navigation";

import { ConfirmActionDialog } from "@/components/dialog/ConfirmActionDialog";
import { Form } from "@/components/form";
import { ModulePageHeader } from "@/components/layout/navigation";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { PROJECT_MODULE_TABS, PROJECT_MODULE_TITLE } from "../../../data/projectNav.config";
import { projectProductionTabs } from "../../projectProductionNav.config";
import { protocolUrls } from "../protocolNav";
import { EditNextMeetingSection } from "./EditNextMeetingSection";
import { EditOtherInfoSection } from "./EditOtherInfoSection";
import { EditPeopleSection } from "./EditPeopleSection";
import { EditTimeSection } from "./EditTimeSection";
import type { EditSection, EditSectionProps } from "./editSections";
import { ProtocolEditFooter } from "./ProtocolEditFooter";
import { useProtocolEditForm } from "./useProtocolEditForm";

const M = localizationConstants;

export interface ProjectProtocolEditPageProps {
	projectId: string;
	protocolId: string;
}

/**
 * Redigera protokoll — Ändra on a Standard protocol: Tid, Deltagare, Övrig
 * information and Nästa möte, each collapsible, over a sticky Avbryt / Spara.
 * The frame titles it "Edit Protokoll", English inside Swedish copy, so Swedish
 * reads "Redigera protokoll". The discard confirm renders outside the form, so
 * its buttons never submit it.
 */
export function ProjectProtocolEditPage({ projectId, protocolId }: ProjectProtocolEditPageProps) {
	const t = useTranslate();
	const edit = useProtocolEditForm(projectId, protocolId);
	const [discarding, setDiscarding] = useState(false);

	/* A protocol that is not this project's, or has no meeting, is a 404. After the hooks. */
	if (!edit.meeting) notFound();

	const section = (key: EditSection): EditSectionProps => ({
		form: edit.form,
		people: edit.people,
		translateError: edit.translateError,
		open: edit.sections[key],
		onOpenChange: (open) => edit.setSectionOpen(key, open),
	});

	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<ModulePageHeader
				title={PROJECT_MODULE_TITLE}
				tabs={PROJECT_MODULE_TABS}
				record={{
					title: t(M.protocolEditTitle),
					description: t(M.projectProtocolCreateStandard),
					backHref: protocolUrls.view(projectId, protocolId),
				}}
				secondaryTabs={projectProductionTabs(projectId)}
			/>

			<Form {...edit.form}>
				<form onSubmit={edit.save} noValidate className="flex flex-1 flex-col">
					<div className="flex flex-1 flex-col p-4 sm:p-6">
						<div className="flex w-full max-w-3xl flex-col gap-4 sm:gap-5">
							<EditTimeSection {...section("time")} />
							<EditPeopleSection {...section("people")} />
							<EditOtherInfoSection {...section("other")} />
							<EditNextMeetingSection {...section("next")} />
						</div>
					</div>
					<ProtocolEditFooter onCancel={() => (edit.dirty ? setDiscarding(true) : edit.leave())} />
				</form>
			</Form>

			<ConfirmActionDialog
				open={discarding}
				onOpenChange={setDiscarding}
				title={M.projectProtocolDiscardTitle}
				description={M.projectProtocolDiscardBody}
				confirmLabel={M.projectProtocolDiscardConfirm}
				destructive
				onConfirm={() => {
					setDiscarding(false);
					edit.leave();
				}}
			/>
		</div>
	);
}

export default ProjectProtocolEditPage;
