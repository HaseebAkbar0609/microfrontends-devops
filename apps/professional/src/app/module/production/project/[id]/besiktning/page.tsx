import { parseRecordIdParam } from "@/lib/routeParams";

import ProjectInspectionPage from "@/features/project/production/besiktning/ProjectInspectionPage";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
	const { id } = await params;

	return <ProjectInspectionPage projectId={parseRecordIdParam(id)} />;
}
