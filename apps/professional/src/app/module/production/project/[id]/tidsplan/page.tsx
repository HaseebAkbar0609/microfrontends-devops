import { parseRecordIdParam } from "@/lib/routeParams";

import ProjectTimeplanListPage from "@/features/project/production/tidsplan/list/ProjectTimeplanListPage";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
	const { id } = await params;

	return <ProjectTimeplanListPage projectId={parseRecordIdParam(id)} />;
}
