import { parseRecordIdParam } from "@/lib/routeParams";

import ProjectProductionInfoPage from "@/features/project/production/ProjectProductionInfoPage";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
	const { id } = await params;

	return <ProjectProductionInfoPage projectId={parseRecordIdParam(id)} />;
}
