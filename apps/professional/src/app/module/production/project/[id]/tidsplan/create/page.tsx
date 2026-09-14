import { parseRecordIdParam } from "@/lib/routeParams";

import ProjectTimeplanFormPage from "@/features/project/production/tidsplan/form/ProjectTimeplanFormPage";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
	const { id } = await params;

	return <ProjectTimeplanFormPage projectId={parseRecordIdParam(id)} />;
}
