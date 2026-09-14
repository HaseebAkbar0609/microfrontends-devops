import { parseRecordIdParam } from "@/lib/routeParams";

import ProjectTimeplanFormPage from "@/features/project/production/tidsplan/form/ProjectTimeplanFormPage";

interface PageProps {
	params: Promise<{ id: string; planId: string }>;
}

/** Validates both ids; the client component resolves the plan (see `[planId]`). */
export default async function Page({ params }: PageProps) {
	const { id, planId } = await params;

	return (
		<ProjectTimeplanFormPage
			projectId={parseRecordIdParam(id)}
			planId={parseRecordIdParam(planId)}
		/>
	);
}
