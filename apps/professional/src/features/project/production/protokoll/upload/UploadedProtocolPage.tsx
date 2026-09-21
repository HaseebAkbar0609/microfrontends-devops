"use client";

import { Info } from "lucide-react";
import { notFound } from "next/navigation";

import { ModulePageHeader } from "@/components/layout/navigation";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { PROJECT_MODULE_TABS, PROJECT_MODULE_TITLE } from "../../../data/projectNav.config";
import { projectProductionTabs } from "../../projectProductionNav.config";
import { ProtocolProjectLine } from "../components/ProtocolProjectLine";
import { useProtocolFileActions } from "../hooks/useProtocolFileActions";
import { useProtocolProject } from "../hooks/useProtocolProject";
import { protocolUrls } from "../protocolNav";
import { uploadDetailsOf } from "../protocolView";
import type { ProjectProtocol } from "../types";
import { MeetingDetailsCard } from "../view/MeetingDetailsCard";
import { uploadFields } from "../view/meetingDetailFields";
import { UploadedFileCard } from "./UploadedFileCard";

const M = localizationConstants;

export interface UploadedProtocolPageProps {
	projectId: string;
	protocol: ProjectProtocol;
}

/**
 * Visa detaljer on an uploaded protocol: what Nytt protokoll recorded, in the
 * meeting protocol's Mötesinformation card, and the file to open or print.
 * Read-only — no frame draws this page; it keeps what was entered on show. A
 * seeded upload's details are read from its row.
 */
export function UploadedProtocolPage({ projectId, protocol }: UploadedProtocolPageProps) {
	const t = useTranslate();
	const project = useProtocolProject(projectId);
	const { openFile, printFile } = useProtocolFileActions();

	/* An unknown project is a 404. After the hooks: `notFound()` throws. */
	if (!project) notFound();

	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<ModulePageHeader
				title={PROJECT_MODULE_TITLE}
				tabs={PROJECT_MODULE_TABS}
				record={{
					title: t(M.protocolViewTitle),
					description: t(M.projectProtocolUploadedSubtitle),
					backHref: protocolUrls.list(projectId),
				}}
				secondaryTabs={projectProductionTabs(projectId)}
			/>

			<div className="flex flex-1 flex-col gap-4 p-4 sm:gap-5 sm:p-6">
				<div className="flex w-full max-w-4xl flex-col gap-4 sm:gap-5">
					<ProtocolProjectLine projectNo={project.projectNo} projectName={project.projectName} />
					<MeetingDetailsCard titleKey={M.protocolMeetingInfo} icon={Info} fields={uploadFields(uploadDetailsOf(protocol), t)} />
					<UploadedFileCard
						fileName={protocol.fileName ?? ""}
						url={protocol.url}
						onOpen={() => openFile(protocol.url)}
						onPrint={() => printFile(protocol.url)}
					/>
				</div>
			</div>
		</div>
	);
}

export default UploadedProtocolPage;
