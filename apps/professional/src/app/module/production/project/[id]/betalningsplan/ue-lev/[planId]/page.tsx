import { parseRecordIdParam } from "@/lib/routeParams";

import ProjectSupplierPlanViewPage from "@/features/project/production/betalningsplan/ue-lev/view/ProjectSupplierPlanViewPage";

interface PageProps {
	params: Promise<{ id: string; planId: string }>;
}

/**
 * A subcontractor's or supplier's payment plan. `ue-lev` is a static segment,
 * so Next matches it before the Beställare plan's `[planId]`. Both ids are
 * validated here; the plan is resolved in the client component, as on the
 * Beställare side.
 */
export default async function Page({ params }: PageProps) {
	const { id, planId } = await params;

	return (
		<ProjectSupplierPlanViewPage
			projectId={parseRecordIdParam(id)}
			planId={parseRecordIdParam(planId)}
		/>
	);
}
