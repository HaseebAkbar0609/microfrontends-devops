import { parseRecordIdParam } from "@/lib/routeParams";

import ProjectStaffLedgerPage from "@/features/project/production/personalliggare/ProjectStaffLedgerPage";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
	const { id } = await params;

	return <ProjectStaffLedgerPage projectId={parseRecordIdParam(id)} />;
}
