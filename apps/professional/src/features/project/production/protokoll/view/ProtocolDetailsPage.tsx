"use client";

import { notFound } from "next/navigation";

import { useStoredProtocol } from "../hooks/useStoredProtocol";
import { hasMeeting } from "../protocolView";
import { UploadedProtocolPage } from "../upload/UploadedProtocolPage";
import { ProjectProtocolViewPage } from "./ProjectProtocolViewPage";

export interface ProtocolDetailsPageProps {
	projectId: string;
	protocolId: string;
}

/**
 * Visa detaljer: a Standard or Action protocol opens its meeting, an uploaded
 * one its details and file. An id that is not this project's has no page — a
 * 404, after the hook.
 */
export function ProtocolDetailsPage({ projectId, protocolId }: ProtocolDetailsPageProps) {
	const protocol = useStoredProtocol(projectId, protocolId);

	if (protocol && hasMeeting(protocol)) return <ProjectProtocolViewPage projectId={projectId} protocolId={protocolId} />;
	if (protocol?.kind === "upload") return <UploadedProtocolPage projectId={projectId} protocol={protocol} />;
	notFound();
}

export default ProtocolDetailsPage;
