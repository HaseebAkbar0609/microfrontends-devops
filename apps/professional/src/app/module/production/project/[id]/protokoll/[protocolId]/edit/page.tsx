import { parseRecordIdParam } from "@/lib/routeParams";

import ProjectProtocolEditPage from "@/features/project/production/protokoll/edit/ProjectProtocolEditPage";

interface PageProps {
	params: Promise<{ id: string; protocolId: string }>;
}

/** Ändra on a Standard protocol. Validates both ids; the client component resolves the protocol (see `[protocolId]`). */
export default async function Page({ params }: PageProps) {
	const { id, protocolId } = await params;

	return <ProjectProtocolEditPage projectId={parseRecordIdParam(id)} protocolId={parseRecordIdParam(protocolId)} />;
}
