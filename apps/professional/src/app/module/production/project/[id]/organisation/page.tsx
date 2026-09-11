import { parseRecordIdParam } from "@/lib/routeParams";

import ProjectOrganisationPage from "@/features/project/production/organisation/ProjectOrganisationPage";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
	const { id } = await params;

	return <ProjectOrganisationPage projectId={parseRecordIdParam(id)} />;
}
