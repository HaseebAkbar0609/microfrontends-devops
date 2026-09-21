import { parseRecordIdParam } from "@/lib/routeParams";

import ProjectProtocolViewPage from "@/features/project/production/protokoll/view/ProjectProtocolViewPage";

interface PageProps {
	params: Promise<{ id: string; protocolId: string }>;
}

/**
 * Visa detaljer on a Standard protocol: its meeting and agenda. Both ids are
 * validated here; the protocol is resolved on the client, which 404s one that
 * is not this project's or has no meeting.
 */
export default async function Page({ params }: PageProps) {
	const { id, protocolId } = await params;

	return <ProjectProtocolViewPage projectId={parseRecordIdParam(id)} protocolId={parseRecordIdParam(protocolId)} />;
}
