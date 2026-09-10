import { parseRecordIdParam } from "@/lib/routeParams";

import ProjectWarrantyPage from "@/features/project/components/ProjectWarrantyPage";

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	return <ProjectWarrantyPage recordId={parseRecordIdParam(id)} />;
}
