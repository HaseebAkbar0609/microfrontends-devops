import { parseRecordIdParam } from "@/lib/routeParams";

import ProtocolDetailsPage from "@/features/project/production/protokoll/view/ProtocolDetailsPage";

interface PageProps {
	params: Promise<{ id: string; protocolId: string }>;
}

/**
 * Visa detaljer: a Standard protocol's meeting and agenda, or an uploaded
 * protocol's details and file. Both ids are validated here; the protocol is
 * resolved on the client, which 404s one that is not this project's or has no
 * page.
 */
export default async function Page({ params }: PageProps) {
	const { id, protocolId } = await params;

	return <ProtocolDetailsPage projectId={parseRecordIdParam(id)} protocolId={parseRecordIdParam(protocolId)} />;
}
