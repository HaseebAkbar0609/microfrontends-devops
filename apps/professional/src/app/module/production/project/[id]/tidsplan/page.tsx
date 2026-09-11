import { parseRecordIdParam } from "@/lib/routeParams";

import ProjectDetailPage from "@/features/project/components/ProjectDetailPage";

interface PageProps {
	params: Promise<{ id: string }>;
}

/**
 * The project schedule.
 *
 * This Gantt was the whole of `/project/[id]` until that route became the
 * record and started redirecting to Projektinformation. A schedule is Tidsplan,
 * one of the record's sections, so it moved here rather than being dropped.
 */
export default async function Page({ params }: PageProps) {
	const { id } = await params;

	return <ProjectDetailPage projectId={parseRecordIdParam(id)} />;
}
