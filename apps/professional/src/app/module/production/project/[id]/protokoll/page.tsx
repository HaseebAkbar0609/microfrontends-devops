import { parseRecordIdParam } from "@/lib/routeParams";

import ProjectProtocolsPage from "@/features/project/production/protokoll/ProjectProtocolsPage";

interface PageProps {
	params: Promise<{ id: string }>;
}

/** Protokoll — the project's meeting and inspection protocols. The id is validated here. */
export default async function Page({ params }: PageProps) {
	const { id } = await params;

	return <ProjectProtocolsPage projectId={parseRecordIdParam(id)} />;
}
