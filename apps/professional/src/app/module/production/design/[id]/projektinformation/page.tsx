import { parseRecordIdParam } from "@/lib/routeParams";
import { DesignProjektinformationPage } from "@/features/design/projektinformation/DesignProjektinformationPage";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
	const { id } = await params;
	return <DesignProjektinformationPage projektId={parseRecordIdParam(id)} />;
}
