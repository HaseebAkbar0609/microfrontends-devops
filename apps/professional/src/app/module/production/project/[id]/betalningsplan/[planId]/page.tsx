import { parseRecordIdParam } from "@/lib/routeParams";

import ProjectPaymentPlanViewPage from "@/features/project/production/betalningsplan/view/ProjectPaymentPlanViewPage";

interface PageProps {
	params: Promise<{ id: string; planId: string }>;
}

/**
 * Both ids are validated here, but the plan is looked up in the client
 * component: a plan created in this browser exists only in this browser's
 * store, so a server lookup would 404 every plan the user had just made.
 */
export default async function Page({ params }: PageProps) {
	const { id, planId } = await params;

	return (
		<ProjectPaymentPlanViewPage
			projectId={parseRecordIdParam(id)}
			planId={parseRecordIdParam(planId)}
		/>
	);
}
