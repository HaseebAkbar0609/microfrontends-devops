import { parseRecordIdParam } from "@/lib/routeParams";

import NewDiaryWizardPage from "@/features/project/production/dagbok/wizard/NewDiaryWizardPage";

interface PageProps {
	params: Promise<{ id: string }>;
}

/** Ny dagbok — the two-step wizard. The id is validated here; `?datum=` may name the starting day. */
export default async function Page({ params }: PageProps) {
	const { id } = await params;

	return <NewDiaryWizardPage projectId={parseRecordIdParam(id)} />;
}
