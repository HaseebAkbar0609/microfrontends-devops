import { parseRecordIdParam } from "@/lib/routeParams";

import ProjectWarrantyDetailPage from "@/features/project/production/garantiataganden/view/ProjectWarrantyDetailPage";

interface PageProps {
	params: Promise<{ id: string; commitmentId: string }>;
}

/**
 * Visa detaljer: one warranty commitment, its cards and its documents. Both
 * ids are validated here; the commitment is resolved on the client, which 404s
 * an id that is not this project's.
 */
export default async function Page({ params }: PageProps) {
	const { id, commitmentId } = await params;

	return <ProjectWarrantyDetailPage projectId={parseRecordIdParam(id)} commitmentId={parseRecordIdParam(commitmentId)} />;
}
