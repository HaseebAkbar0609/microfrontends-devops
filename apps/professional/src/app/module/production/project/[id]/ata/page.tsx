import { parseRecordIdParam } from "@/lib/routeParams";
import localizationConstants from "@/utils/translation/constants";
import { UnavailableProjectSectionPage } from "@/features/project/production/components/UnavailableProjectSectionPage";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
	const { id } = await params;
	return <UnavailableProjectSectionPage projectId={parseRecordIdParam(id)} sectionKey={localizationConstants.ataTitle} />;
}
