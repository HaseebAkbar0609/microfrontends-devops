import { parseRecordIdParam } from "@/lib/routeParams";

import ProjectAtaFormPage from "@/features/project/production/ata/form/ProjectAtaFormPage";

interface PageProps {
	params: Promise<{ id: string; ataId: string }>;
}

/**
 * Visa detaljer: a saved ÄTA opened on step 2, the read-only preview with its
 * rows and documents. Both ids are validated here; the ÄTA is resolved on the
 * client, which 404s an id that is not this project's.
 */
export default async function Page({ params }: PageProps) {
	const { id, ataId } = await params;

	return (
		<ProjectAtaFormPage
			projectId={parseRecordIdParam(id)}
			ataId={parseRecordIdParam(ataId)}
			initialStep={2}
		/>
	);
}
