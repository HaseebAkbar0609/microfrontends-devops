"use client";

import { Info, Video } from "lucide-react";
import { notFound } from "next/navigation";

import { ModulePageHeader } from "@/components/layout/navigation";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { PROJECT_MODULE_TABS, PROJECT_MODULE_TITLE } from "../../../data/projectNav.config";
import { projectProductionTabs } from "../../projectProductionNav.config";
import { ProtocolProjectLine } from "../components/ProtocolProjectLine";
import { useProtocolProject } from "../hooks/useProtocolProject";
import { protocolUrls } from "../protocolNav";
import { MeetingDetailsCard } from "./MeetingDetailsCard";
import { detailFields, nextFields } from "./meetingDetailFields";
import { MeetingPointsCard } from "./MeetingPointsCard";
import { ProtocolViewDialogs } from "./ProtocolViewDialogs";
import { ProtocolViewFooter } from "./ProtocolViewFooter";
import { usePointsPage } from "./usePointsPage";
import { useProtocolView } from "./useProtocolView";
import { useProtocolViewDialogs, type ProtocolLeaveTarget } from "./useProtocolViewDialogs";

const M = localizationConstants;

export interface ProjectProtocolViewPageProps {
	projectId: string;
	protocolId: string;
}

/**
 * Visa protokoll — a Standard protocol: its meeting, the next one, and the
 * agenda written here. The frame titles it "View Protokoll", English inside
 * Swedish copy, so Swedish reads "Visa protokoll".
 */
export function ProjectProtocolViewPage({ projectId, protocolId }: ProjectProtocolViewPageProps) {
	const t = useTranslate();
	const project = useProtocolProject(projectId);
	const view = useProtocolView(projectId, protocolId);
	const pointsPage = usePointsPage(view.points);
	const dialogs = useProtocolViewDialogs();

	/* An unknown project, a protocol that is not this project's, or one with no
	   meeting — an Action or an uploaded PDF — is a 404. After the hooks:
	   `notFound()` throws. */
	if (!project || !view.meeting) notFound();

	const { details, next } = view.meeting;
	const leave = (target: ProtocolLeaveTarget) =>
		view.dirty ? dialogs.open({ kind: "discard", then: target }) : view.leave(target);

	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<ModulePageHeader
				title={PROJECT_MODULE_TITLE}
				tabs={PROJECT_MODULE_TABS}
				record={{
					title: t(M.protocolViewTitle),
					description: t(M.projectProtocolCreateStandard),
					backHref: protocolUrls.list(projectId),
				}}
				secondaryTabs={projectProductionTabs(projectId)}
			/>

			<div className="flex flex-1 flex-col gap-4 p-4 sm:gap-5 sm:p-6">
				<div className="flex w-full max-w-4xl flex-col gap-4 sm:gap-5">
					<ProtocolProjectLine projectNo={project.projectNo} projectName={project.projectName} />
					<MeetingDetailsCard titleKey={M.protocolMeetingInfo} icon={Info} fields={detailFields(details, t)} />
					<MeetingDetailsCard titleKey={M.protocolNextMeeting} icon={Video} fields={nextFields(next, t)} />
					<MeetingPointsCard
						page={pointsPage}
						onAdd={() => dialogs.open({ kind: "addPoint" })}
						onEdit={(point) => dialogs.open({ kind: "editPoint", point })}
						onDelete={(point) => dialogs.open({ kind: "deletePoint", point })}
					/>
				</div>
			</div>

			<ProtocolViewFooter
				onCancel={() => leave("list")}
				onEdit={() => leave("edit")}
				onSave={view.save}
				onSend={() => dialogs.open({ kind: "send" })}
			/>

			<ProtocolViewDialogs view={view} dialogs={dialogs} pointsPage={pointsPage} />
		</div>
	);
}

export default ProjectProtocolViewPage;
