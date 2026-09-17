import { parseRecordIdParam } from "@/lib/routeParams";

import ProjectAtaFormPage from "@/features/project/production/ata/form/ProjectAtaFormPage";

interface PageProps {
	params: Promise<{ id: string }>;
}

/** Skapa ÄTA. `create` is a static segment, so Next matches it before `[ataId]`. */
export default async function Page({ params }: PageProps) {
	const { id } = await params;

	return <ProjectAtaFormPage projectId={parseRecordIdParam(id)} initialStep={1} />;
}
