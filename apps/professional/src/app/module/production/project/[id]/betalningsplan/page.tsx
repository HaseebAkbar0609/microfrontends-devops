import { parseRecordIdParam } from "@/lib/routeParams";

import ProjectPaymentPlanListPage from "@/features/project/production/betalningsplan/list/ProjectPaymentPlanListPage";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
	const { id } = await params;

	return <ProjectPaymentPlanListPage projectId={parseRecordIdParam(id)} />;
}
