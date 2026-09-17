import { parseRecordIdParam } from "@/lib/routeParams";

import ProjectDocumentsPage from "@/features/project/production/handlingar/ProjectDocumentsPage";

interface PageProps {
	params: Promise<{ id: string }>;
}

/** Handlingar — the project's documents, drawings and contracts. The id is validated here. */
export default async function Page({ params }: PageProps) {
	const { id } = await params;

	return <ProjectDocumentsPage projectId={parseRecordIdParam(id)} />;
}
