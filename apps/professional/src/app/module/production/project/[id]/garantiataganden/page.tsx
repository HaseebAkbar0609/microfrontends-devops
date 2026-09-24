import { parseRecordIdParam } from "@/lib/routeParams";

import ProjectWarrantyCommitmentsPage from "@/features/project/production/garantiataganden/ProjectWarrantyCommitmentsPage";

interface PageProps {
	params: Promise<{ id: string }>;
}

/** Garanti — the project's warranty commitments. The id is validated here. */
export default async function Page({ params }: PageProps) {
	const { id } = await params;

	return <ProjectWarrantyCommitmentsPage projectId={parseRecordIdParam(id)} />;
}
