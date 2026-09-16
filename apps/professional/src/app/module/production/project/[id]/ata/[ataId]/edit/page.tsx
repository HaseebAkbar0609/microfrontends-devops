import { parseRecordIdParam } from "@/lib/routeParams";

import ProjectAtaFormPage from "@/features/project/production/ata/form/ProjectAtaFormPage";

interface PageProps {
	params: Promise<{ id: string; ataId: string }>;
}

/** Redigera: a saved ÄTA opened on step 1 with its fields filled in. */
export default async function Page({ params }: PageProps) {
	const { id, ataId } = await params;

	return (
		<ProjectAtaFormPage
			projectId={parseRecordIdParam(id)}
			ataId={parseRecordIdParam(ataId)}
			initialStep={1}
		/>
	);
}
