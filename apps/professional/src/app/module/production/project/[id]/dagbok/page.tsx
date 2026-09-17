import { parseRecordIdParam } from "@/lib/routeParams";

import ProjectDiaryPage from "@/features/project/production/dagbok/ProjectDiaryPage";

interface PageProps {
	params: Promise<{ id: string }>;
}

/** Dagbok — the project's construction diary. The id is validated here; the day comes from `?datum=`. */
export default async function Page({ params }: PageProps) {
	const { id } = await params;

	return <ProjectDiaryPage projectId={parseRecordIdParam(id)} />;
}
