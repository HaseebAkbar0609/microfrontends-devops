import { parseRecordIdParam } from "@/lib/routeParams";

import ProjectQaPage from "@/features/project/production/fraga-svar/ProjectQaPage";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
	const { id } = await params;

	return <ProjectQaPage projectId={parseRecordIdParam(id)} />;
}
