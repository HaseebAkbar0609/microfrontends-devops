import { parseRecordIdParam } from "@/lib/routeParams";

import ProjectAtaListPage from "@/features/project/production/ata/list/ProjectAtaListPage";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
	const { id } = await params;

	return <ProjectAtaListPage projectId={parseRecordIdParam(id)} />;
}
