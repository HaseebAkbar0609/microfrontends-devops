import { parseRecordIdParam } from "@/lib/routeParams";
import { UploadedProjectDocumentsPage } from "@/features/project/production/handlingar/UploadedProjectDocumentsPage";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
	const { id } = await params;
	return <UploadedProjectDocumentsPage projectId={parseRecordIdParam(id)} />;
}
